const express = require('express');
const app = express();

const generalService = require('./GeneralService.js');
const riotService = require('./RiotService.js');
const opggService = require('./OpggService.js');
const btggService = require('./BtggService.js');

app.use(express.json());

class Controller {
	constructor() {
		// General Services
		app.get('/', this.hello.bind(this));
		app.get('/health', this.hello.bind(this));
		app.get('/test/getUserName', this.getUserName.bind(this));
		app.get('/test/setUserName/:userName', this.setUserName.bind(this));

		// RIOT Services
		app.post('/myTier', this.myTier.bind(this));
		app.post('/myWinRate', this.myWinRate.bind(this));
		app.post('/myTodayWinRate', this.myTodayWinRate.bind(this));
		app.post('/myRecentWinRate', this.myRecentWinRate.bind(this));
		app.post('/myRecentChampionWinRate', this.myRecentChampionWinRate.bind(this));
		app.post('/myChampionMastery', this.myChampionMastery.bind(this));
		app.post('/tierByChampion', this.tierByChampion.bind(this));
		app.post('/winRateByChampion', this.winRateByChampion.bind(this));
		app.post('/recentChampionWinRateByChampion', this.recentChampionWinRateByChampion.bind(this));
		app.post('/championMasteryByChampion', this.championMasteryByChampion.bind(this));

		app.get('/test/myTier', this.myTierTest.bind(this));
		app.get('/test/myWinRate', this.myWinRateTest.bind(this));
		app.get('/test/myTodayWinRate', this.myTodayWinRateTest.bind(this));
		app.get('/test/myRecentWinRate', this.myRecentWinRateTest.bind(this));
		app.get('/test/myRecentChampionWinRate', this.myRecentChampionWinRateTest.bind(this));
		app.get('/test/myChampionMastery', this.myChampionMasteryTest.bind(this));
		app.get('/test/tierByChampion', this.tierByChampionTest.bind(this));
		app.get('/test/winRateByChampion', this.winRateByChampionTest.bind(this));
		app.get('/test/recentChampionWinRateByChampion', this.recentChampionWinRateByChampionTest.bind(this));
		app.get('/test/championMasteryByChampion', this.championMasteryByChampionTest.bind(this));

		// OPGG Services
		app.post('/recommendChampionByLine', this.recommendChampionByLine.bind(this));
		app.post('/recommendCounterChampionByChampion', this.recommendCounterChampionByChampion.bind(this));
		app.post('/recommendSkillByChampion', this.recommendSkillByChampion.bind(this));
		app.post('/recommendRuneByChampion', this.recommendRuneByChampion.bind(this));

		app.get('/test/recommendChampionByLine', this.recommendChampionByLineTest.bind(this));
		app.get('/test/recommendCounterChampionByChampion', this.recommendCounterChampionByChampionTest.bind(this));
		app.get('/test/recommendSkillByChampion', this.recommendSkillByChampionTest.bind(this));
		app.get('/test/recommendRuneByChampion', this.recommendRuneByChampionTest.bind(this));

		// BTGG Services
		app.post('/esportsResultsByTeamName', this.esportsResultsByTeamName.bind(this));

		app.get('/test/esportsResultsByTeamName', this.esportsResultsByTeamNameTest.bind(this));
	}

	start() {
		app.listen(3000, () => console.log('Controller is running on port 3000'));
	}

	/*--------------------------- General Services ----------------------------*/
	hello(req, res) {
		res.send('OK\n');
	}

	getUserName(req, res) {
		generalService.getUserName().then(userName => {
			res.json(userName);
		});
	}

	setUserName(req, res) {
		generalService.setUserName(req.params.userName).then(() => {
			res.json(req.params.userName);	
		})
	}

	/*--------------------------- RIOT Services ----------------------------*/
	// myTier
	myTier(req, res) {
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
		let parameters = {};

		generalService.getTestRequest('myTier', parameters).then(reqObj => {
			req.body = reqObj;
			this.myTier(req, res);
		});
	}

	// myWinRate
	myWinRate(req, res) {
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
		let parameters = {}

		generalService.getTestRequest('myWinRate', parameters).then(reqObj => {
			req.body = reqObj;
			this.myWinRate(req, res);
		});
	}

	//myTodayWinRate
	myTodayWinRate(req, res) {
		generalService.getUserName().then(userName => {
			return riotService.answerTodayWinRate(userName);	
		}).then(rate => {
			let output = {
				'win_lose_mtwr': rate[0],
				'win_rate_mtwr': rate[1]
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	myTodayWinRateTest(req, res) {
		let parameters = {}

		generalService.getTestRequest('myTodayWinRate', parameters).then(reqObj => {
			req.body = reqObj;
			this.myTodayWinRate(req, res);
		});
	}

	//myRecentWinRate
	myRecentWinRate(req, res) {
		generalService.getUserName().then(userName => {
			return riotService.answerRecentWinRate(userName);	
		}).then(rate => {
			let output = {
				'win_rate_mrwr': rate[0]
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	myRecentWinRateTest(req, res) {
		let parameters = {}

		generalService.getTestRequest('myRecentWinRate', parameters).then(reqObj => {
			req.body = reqObj;
			this.myRecentWinRate(req, res);
		});
	}

	//myRecentChampionWinRate
	myRecentChampionWinRate(req, res) {
		Promise.all([generalService.getParameters(req.body), generalService.getUserName()]).then(([parameters, userName]) => {
			return riotService.answerRecentChampionWinRate(userName, parameters.champion_mrcwr.value);	
		}).then(rate => {
			let output = {
				'champion_mrcwr': rate[0],
				'win_rate_mrcwr': rate[1]
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	myRecentChampionWinRateTest(req, res) {
		let parameters = {
			'champion_mrcwr': {
				'type': 'CHAMPION',
				'value': '아리'
			}
		};

		generalService.getTestRequest('myRecentChampionWinRate', parameters).then(reqObj => {
			req.body = reqObj;
			this.myRecentChampionWinRate(req, res);
		});
	}

	// myChampionMastery
	myChampionMastery(req, res) {
		Promise.all([generalService.getParameters(req.body), generalService.getUserName()]).then(([parameters, userName]) => {
			return riotService.answerChampionMastery(userName, parameters.champion_mcm.value);	
		}).then(mcm => {
			let output = {
				'champion_mcm': mcm[0],
				'mastery_mcm': mcm[1]
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	myChampionMasteryTest(req, res) {
		let parameters = {
			'champion_mcm': {
				'type': 'CHAMPION',
				'value': '아리'
			}
		};

		generalService.getTestRequest('myChampionMastery', parameters).then(reqObj => {
			req.body = reqObj;
			this.myChampionMastery(req, res);
		});
	}

	// tierByChampion
	tierByChampion(req, res) {
		Promise.all([generalService.getParameters(req.body), generalService.getUserName()]).then(([parameters, userName]) => {
			return Promise.all([parameters, riotService.answerTierByChampion(userName, parameters.team_tc.value, parameters.champion_tc.value)]);
		}).then(([parameters, tier]) => {
			let output = {
				'team_tc': parameters.team_tc.value,
				'champion_tc': parameters.champion_tc.value,
				'tier_tc': tier[0]
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	tierByChampionTest(req, res) {
		let parameters = {
			'champion_tc': {
				'type': 'CHAMPION',
				'value': '아리'
			},
			'team_tc': {
				'type': 'TEAM',
				'value': '우리팀'
			}
		};

		generalService.getTestRequest('tierByChampion', parameters).then(reqObj => {
			req.body = reqObj;
			this.tierByChampion(req, res);
		});
	}

	// winRateByChampion
	winRateByChampion(req, res) {
		Promise.all([generalService.getParameters(req.body), generalService.getUserName()]).then(([parameters, userName]) => {
			return Promise.all([parameters, riotService.answerWinRateByChampion(userName, parameters.team_wrc.value, parameters.champion_wrc.value)]);
		}).then(([parameters, rate]) => {
			let output = {
				'team_wrc': parameters.team_wrc.value,
				'champion_wrc': parameters.champion_wrc.value,
				'win_lose_wrc': rate[0],
				'win_rate_wrc': rate[1] || "NULL Value"
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	winRateByChampionTest(req, res) {
		let parameters = {
			'champion_wrc': {
				'type': 'CHAMPION',
				'value': '아리'
			},
			'team_wrc': {
				'type': 'TEAM',
				'value': '우리팀'
			}
		};

		generalService.getTestRequest('winRateByChampion', parameters).then(reqObj => {
			req.body = reqObj;
			this.winRateByChampion(req, res);
		});
	}

	// recentChampionWinRateByChampion
	recentChampionWinRateByChampion(req, res) {
		Promise.all([generalService.getParameters(req.body), generalService.getUserName()]).then(([parameters, userName]) => {
			return Promise.all([parameters, riotService.answerRecentChampionWinRateByChampion(userName, parameters.team_rcwrc.value, parameters.champion_rcwrc.value)]);
		}).then(([parameters, rate]) => {
			let output = {
				'team_rcwrc': parameters.team_rcwrc.value,
				'champion_rcwrc': rate[0],
				'win_rate_rcwrc': rate[1] || "NULL Value"
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	recentChampionWinRateByChampionTest(req, res) {
		let parameters = {
			'champion_rcwrc': {
				'type': 'CHAMPION',
				'value': '아리'
			},
			'team_rcwrc': {
				'type': 'TEAM',
				'value': '우리팀'
			}
		};

		generalService.getTestRequest('recentChapionWinRateByChampion', parameters).then(reqObj => {
			req.body = reqObj;
			this.recentChampionWinRateByChampion(req, res);
		});
	}

	// championMasteryByChampion
	championMasteryByChampion(req, res) {
		Promise.all([generalService.getParameters(req.body), generalService.getUserName()]).then(([parameters, userName]) => {
			return Promise.all([parameters, riotService.answerChampionMasteryByChampion(userName, parameters.team_cmc.value, parameters.champion_cmc.value)]);
		}).then(([parameters, cmc]) => {
			let output = {
				'team_cmc': parameters.team_cmc.value,
				'champion_cmc': cmc[0],
				'mastery_cmc': cmc[1] || "NULL Value"
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	championMasteryByChampionTest(req, res) {
		let parameters = {
			'champion_cmc': {
				'type': 'CHAMPION',
				'value': '아리'
			},
			'team_cmc': {
				'type': 'TEAM',
				'value': '우리팀'
			}
		};

		generalService.getTestRequest('championMasteryByChampion', parameters).then(reqObj => {
			req.body = reqObj;
			this.championMasteryByChampion(req, res);
		});
	}

	/*--------------------------- OPGG Services ----------------------------*/
	// recommendChampionByLine
	recommendChampionByLine(req, res) {
		generalService.getParameters(req.body).then(parameters => {
			return opggService.recommendChampionByLine(parameters.role_rcl.value)
		}).then(recommend => {
			let output = {
				'role_rcl': recommend[0],
				'champion_rcl': recommend[1]
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	recommendChampionByLineTest(req, res) {
		let parameters = {
			'role_rcl': {
				'type': 'ROLE',
				'value': '미드'
			}	
		};

		generalService.getTestRequest('recommendChampionByLine', parameters).then(reqObj => {
			req.body = reqObj;
			this.recommendChampionByLine(req, res);
		});
	}

	// recommendCounterChampionByChampion
	recommendCounterChampionByChampion(req, res) {
		generalService.getParameters(req.body).then(parameters => {
			return opggService.recommendCounterChampionByChampion(parameters.champion_rccc.value)
		}).then(recommend => {
			let output = {
				'champion_rccc': recommend[0],
				'champions_rccc': recommend[1]
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	recommendCounterChampionByChampionTest(req, res) {
		let parameters = {
			'champion_rccc': {
				'type': 'CHAMPION',
				'value': '가렌'
			}	
		};

		generalService.getTestRequest('recommendCounterChampionByChampion', parameters).then(reqObj => {
			req.body = reqObj;
			this.recommendCounterChampionByChampion(req, res);
		});
	}

	//recommendSkillByChampion
	recommendSkillByChampion(req, res) {
		generalService.getParameters(req.body).then(parameters => {
			return opggService.recommendSkillByChampion(parameters.champion_rsc.value)
		}).then(recommend => {
			let output = {
				'champion_rsc': recommend[0],
				'skill_order_rsc': recommend[1]
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	recommendSkillByChampionTest(req, res) {
		let parameters = {
			'champion_rsc': {
				'type': 'CHAMPION',
				'value': '가렌'
			}	
		};

		generalService.getTestRequest('recommendSkillByChampion', parameters).then(reqObj => {
			req.body = reqObj;
			this.recommendSkillByChampion(req, res);
		});
	}

	//recommendRuneByChampion
	recommendRuneByChampion(req, res) {
		generalService.getParameters(req.body).then(parameters => {
			return opggService.recommendRuneByChampion(parameters.champion_rrc.value)
		}).then(recommend => {
			let output = {
				'champion_rrc': recommend[0],
				'rune_rsc': recommend[1]
			};
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}

	recommendRuneByChampionTest(req, res) {
		let parameters = {
			'champion_rrc': {
				'type': 'CHAMPION',
				'value': '조이'
			}	
		};

		generalService.getTestRequest('recommendRuneByChampion', parameters).then(reqObj => {
			req.body = reqObj;
			this.recommendRuneByChampion(req, res);
		});
	}

	/*--------------------------- BTGG Services ----------------------------*/
	// esportsResultsByTeamName
  esportsResultsByTeamName(req, res) {
		generalService.getParameters(req.body).then(parameters => {
			return Promise.all([parameters, btggService.esportsResultsByTeamName(parameters.pro_team_name_ertn.value)])
		}).then(([parameters, result]) => {
			let output= {
				'pro_team_name_ertn': parameters.pro_team_name_ertn.value,

			  'opponent_team_1_ertn': result[0][1][0],
				'our_team_score_1_ertn': result[0][0][1],
				'opponent_team_score_1_ertn': result[0][1][1],
				'result_1_ertn': result[0][2],

			  'opponent_team_2_ertn': result[1][1][0],
				'our_team_score_2_ertn': result[1][0][1],
				'opponent_team_score_2_ertn': result[1][1][1],
				'result_2_ertn': result[1][2]
			}
			return generalService.getResponse(output);
		}).then(resObj => {
			res.json(resObj);	
		});
	}	

	esportsResultsByTeamNameTest(req, res) {
		let parameters = {
			'pro_team_name_ertn': {
				'type': 'PRO_TEAM',
				'value': '에스케이티'
			}
		};

		generalService.getTestRequest('esportsResultsByTeamName', parameters).then(reqObj => {
			req.body = reqObj;
			this.esportsResultsByTeamName(req, res);
		});
	}
}

module.exports = new Controller();
