const express = require('express');
const app = express();

const generalService = require('./GeneralService.js');
const riotService = require('./RiotService.js');

app.use(express.json());

class Controller {
	constructor() {
		app.get('/', this.hello.bind(this));

	  app.post('/myTier', this.myTier.bind(this));
		app.get('/test/myTier', this.myTierTest.bind(this));

		app.post('/myWinRate', this.myWinRate.bind(this));
		app.get('/test/myWinRate', this.myWinRateTest.bind(this));
	}

	start() {
		app.listen(3000, () => console.log('Controller is running on port 3000'));
	}

	hello(req, res) {
		res.send('Hello, World!\n');
	}

	// myTier
	myTier(req, res) {
		let parameters = generalService.getParameters(req.body);
		generalService.getUserName().then(userName => {
			return riotService.answerTier(userName);
		}).then(tier => {
			let output = {
				'tier_mt': tier[0]
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	myTierTest(req, res) {
		let parameters = {
			'tier_mt': {
				'type': 'backend',
				'value': null
			}
		};

		generalService.getTestRequest('myTier', parameters).then(reqObj => {
			req.body = reqObj;
			this.myTier(req, res);
		});
	}

	// myWinRate
	myWinRate(req, res) {
		let paramters = generalService.getParameters(req.body);
		generalService.getUserName().then(userName => {
			return riotService.answerWinRate(userName);	
		}).then(rate => {
			let output = {
				'win_lose_mwr': rate[0],
				'win_rate_mwr': rate[1]
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	myWinRateTest(req, res) {
		let parameters = {
			'win_lose_mwr': {
				'type': 'backend',
				'value': null
			},
			'win_rate_mwr': {
				'type': 'backend',
				'value': null
			}
		}

		generalService.getTestRequest('myWinRate', parameters).then(reqObj => {
			req.body = reqObj;
			this.myWinRate(req, res);
		});
	}
}

module.exports = new Controller();
