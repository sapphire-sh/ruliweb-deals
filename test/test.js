'use strict';

let App = require('../src/app');
let app = new App();

describe('@ruliweb_deals', function() {
	it('start', function(done) {
		app.start().then(() => {
			done();
		});
	});
	
	it('parse', function(done) {
		this.timeout(20000);
		app.parse(1900, 0).then(() => {
			done();
		});
	});
	
	it('insert', function(done) {
		app.insert([]).then(() => {
			done();
		});
	});
});

