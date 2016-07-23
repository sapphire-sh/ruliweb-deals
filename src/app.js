'use strict';

const CONFIG = require('../config');

const _ = require('underscore');
const jsdom = require('jsdom');
const schedule = require('node-schedule');
const knex = require('knex')(CONFIG.knex);
const twit = new (require('twit'))(CONFIG.twitter);

const TABLE_NAME = 'ruliweb_deals';

let LATEST_ID;

knex.schema.hasTable(TABLE_NAME)
.then((exists) => {
	if(exists) {
		return Promise.resolve();
	}
	else {
		return knex.schema.createTableIfNotExists(TABLE_NAME, (table) => {
			table.increments();
			table.integer('rid').notNullable();
			table.string('title').notNullable();
			table.string('link').notNullable();
			table.integer('tweet', 1).notNullable();
			table.timestamp('created_at').defaultTo(knex.fn.now());
		});
	}
})
.then(() => {
		start();
		schedule.scheduleJob('*/2 * * * *', start);
});

function start() {
	knex(TABLE_NAME)
	.limit(1)
	.then(function(rows) {
		LATEST_ID = (rows.length === 0 ? 5 : rows[0].rid);
		parse()
		.then(function(rows) {
			rows = rows.reverse();
			insert(rows);
		});
	});
}

function parse(page) {
	page = (page === undefined ? 1 : page);
	
	const URL = `http://bbs.ruliweb.com/news/board/1020/list?page=${page}`;
	
	return new Promise((resolve, reject) => {
		jsdom.env(URL, ['http://code.jquery.com/jquery.js'], (err, window) => {
			const $ = window.$;
			
			const rows = $('.board_list_table > tbody > tr:not(.notice) > td');
			
			let data = [];
			
			let rid;
			let title;
			let link;
			rows.each(function(i) {
				switch(i % 7) {
				case 0:
					rid = $(this).text().trim();
					break;
				case 1:
					break;
				case 2:
					title = $(this).find('a').text().trim();
					link = $(this).find('a').attr('href');
					break;
				case 6:
					data.push({
						rid: rid,
						title: title,
						link: link,
						tweet: 0
					});
					
					break;
				}
			});
			
			window.close();
			if(data.length > 0) {
				if(data[data.length - 1].rid > LATEST_ID) {
					parse(page + 1)
					.then(function(rows) {
						data = _.union(data, rows);
						resolve(data);
					});
				}
				else {
					resolve(data);
				}
			}
			else {
				resolve([]);
			}
		});
	});
}

function insert(data) {
	data.reduce((prev, curr) => {
		return prev.then(() => {
			return knex(TABLE_NAME)
			.where('rid', curr.rid)
			.then((rows) => {
				if(rows.length === 0) {
					return knex(TABLE_NAME).insert(curr);
				}
				else {
					return Promise.resolve();
				}
			});
		});
	}, Promise.resolve())
	.then(() => {
		knex(TABLE_NAME)
		.where('tweet', 0)
		.then((rows) => {
			rows.reduce((prev, curr) => {
				return prev.then(() => {
					return tweet(curr)
					.then(function() {
						return knex(TABLE_NAME)
						.where('id', curr.id)
						.update('tweet', 1);
					});
				});
			}, Promise.resolve())
			.then(() => {});
		})
		.catch((err) => {
			console.log(err);
		});
	})
	.catch((err) => {
		console.log(err);
	});
}

function tweet(data) {
	return new Promise((resolve, reject) => {
		let title = data.title;
		if(title.length >= 117) {
			title = title.substr(0, 117 - 2) + '…';
		}
		let link = data.link;
		let status = `${title}\n${link}`;
		
		twit.post('statuses/update', {
			status: status
		}, (err, res) => {
			if(err) {
				console.log(err);
			}
			resolve();
		});
	});
}

