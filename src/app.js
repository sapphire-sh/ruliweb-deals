'use strict';

const config = require('../config');

let knex = require('knex')(config.knex);
let twit;
if(process.env.NODE_ENV !== 'test') {
	twit = new (require('twit'))(config.twitter);
}

let request = require('request');
let cheerio = require('cheerio');

const table_name = 'ruliweb_deals';

let LATEST_ID = 2276;
class App {
	constructor() {
		let self = this;
		
		knex.schema.hasTable(table_name).then((exists) => {
			if(exists) {
				return Promise.resolve();
			}
			else {
				return knex.schema.createTableIfNotExists(table_name, (table) => {
					table.integer('id').primary().notNullable();
					table.string('type').notNullable();
					table.string('title').notNullable();
					table.string('link').notNullable();
					table.integer('tweet', 1).notNullable();
					table.timestamp('created_at').defaultTo(knex.fn.now());
				});
			}
		}).then(() => {
			if(process.env.NODE_ENV !== 'test') {
				Promise.resolve(0).then(function loop(i) {
					console.log(i);
					
					return self.start().then((id) => {
console.log(id);
						return self.parse(id, 1).then(function loop(data) {
console.log(data);
							if(data.items.length > 0) {
								return self.insert(data.items, id, data.page).then((data) => {
									return self.parse(id, data.page + 1);
								}).then(loop).catch((e) => {
									console.log(e);
								});
							}
							else {
								return Promise.resolve();
							}
						}).catch((e) => {
							console.log(e);
						});
					}).then(() => {
						return self.tweet();
					}).then(() => {
						return new Promise((resolve, reject) => {
							setTimeout(() => {
								resolve(i + 1);
							}, 5 * 60 * 1000);
						});
					}).then(loop).catch((e) => {
						console.log(e);
					});
				}).catch((e) => {
					console.log(e);
				});
			}
		}).catch((e) => {
			console.log(e);
		});
	}
	
	start() {
		let self = this;
		
		return new Promise((resolve, reject) => {
			knex(table_name).orderBy('id', 'desc').limit(1).then((rows) => {
				if(rows.length === 0) {
					resolve(LATEST_ID);
				}
				else {
					resolve(rows[0].id);
				}
			}).catch((e) => {
				console.log(e);
			});
		});
	}
	
	parse(id, page) {
		const url = `http://bbs.ruliweb.com/news/board/1020/list?page=${page}`;
		
		let data = {
			items: [],
			id: id,
			page: page
		};
		
		return new Promise((resolve, reject) => {
			request(url, (err, res, body) => {
console.log(err);
				if(!err && res.statusCode === 200) {
					let $ = cheerio.load(body);
					
					let items = [];
					
					$('table.board_list_table tr.table_body:not(.notice)').each((i, e) => {
						let item = {};
						
						item.tweet = 0;
						
						$(e).find('td').each((i, e) => {
							let str = $(e).text().trim();
							switch(i) {
							case 0:
								item.id = str;
								break;
							case 1:
								item.type = str;
								break;
							case 2:
								item.title = $(e).find('a').text().trim();
								item.link = $(e).find('a').attr('href');
								
								break;
							}
						});
						console.log(parseInt(item.id), id);
						if(parseInt(item.id) > id) {
							items.push(item);
						}
					});
					
					data.items = items;
				}
				else {
					console.log(err);
				}
				resolve(data);
			});
		});
	}
	
	insert(items, id, page) {
		let self = this;
		
		return new Promise((resolve, reject) => {
			let promises = items.map((item) => {
				return knex(table_name).where({
					id: item.id
				}).then((rows) => {
					if(rows.length === 0) {
						return knex(table_name).insert(item);
					}
					else {
						return Promise.resolve();
					}
				}).catch((e) => {
					console.log(e);
				});
			});
			Promise.all(promises).then(() => {
				resolve({
					id: id,
					page: page
				});
			}).catch((e) => {
				console.log(e);
			});
		});
	}
	
	tweet() {
		let self = this;
		
		return new Promise((resolve, reject) => {
			knex(table_name).where({
				tweet: 0
			}).then((rows) => {
				let promises = rows.map((row) => {
					return new Promise((resolve, reject) => {
						let title = row.title;
						let type = row.type;
						let status = `[${type}]\n${title}\n`;
						if(status.length > 111) {
							title = `${title.substr(0, 110)}…`;
							status = `[${type}]\n${title}\n`;
						}
						status += row.link;
						
						twit.post('statuses/update', {
							status: status
						}, (err, res) => {
							if(err) {
								throw new Error(err);
							}
							
							knex(table_name).where({
								id: row.id
							}).update({
								tweet: 1
							}).then(() => {
								resolve();
							}).catch((e) => {
								console.log(e);
							});
						});
					});
				});
				Promise.all(promises).then(() => {
					resolve();
				}).catch((e) => {
					console.log(e);
				});
			}).catch((e) => {
				console.log(e);
			});
		});
	}
}

if(process.env.NODE_ENV !== 'test') {
	let app = new App();
}

module.exports = App;

