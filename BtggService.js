const selenium = require('selenium-webdriver');
const cheerio = require('cheerio');
const By = selenium.By;
require('geckodriver');

const TEAM_DICT = {
	'에스케이티': 'skt'
}

const TEAM_DICT_REV = {
	'AFS': '아프리카', 'C9': '씨나인', 'FIN': '그리핀', 'FNC': '프나틱', 'G2': '지투', 'IG': '아이지', 'GEN': '젠지', 'KZ': '킹존', 'RNG': '알엔지', 'SKT': '에스케이티'
}

class BtggService {
	/*
	async find_team_ranks() {
		let driver = await new selenium.Builder().forBrowser('firefox').build();
		try {
			await driver.get('http://best.gg/standings/team/league=lck');
		} finally {
			let result = [];
			let elem = driver.getPageSource();
			elem.then(v => {
				let $ = cheerio.load(v);
				let rank_list = $('.dbook__leaderboard-item');
				rank_list.each((i, elem) => {
					let rank = $('.dbook__leaderboard-rank', $(elem)).text();
					let team_name = $('.dbook__leaderboard-name-team', $(elem)).text();
					result.push([rank, team_name]);
				});
			})
			await driver.quit();
			return result;
		}
	}

	async find_play_results() {
		let driver = await new selenium.Builder().forBrowser('firefox').build();
		try {
			await driver.get('http://best.gg/');
		} finally {
			let result = [];
			let elem = driver.getPageSource();
			elem.then(v => {
				let $ = cheerio.load(v);
				let schedule_list = $('li', '.home__schedule-list');
				schedule_list.each((i, elem) => {
					let list = [];
					let date = $('.home__schedule-item-title-date', $(elem)).text();
					list.push(date);
					let team = $('.home__schedule-item-score-item', $(elem));
					team.each((i, elem) => {
						let team_name = $('.home__schedule-item-score-item-name', $(elem)).text();
						let team_score = $('.home__schedule-item-score-item-score', $(elem)).text();
						list.push([team_name, team_score]);
					});
					result.push(list);
				});
			})
			await elem;
			await driver.quit();
			return result;
		}
	}

	async esportsResultsByTeamName(team_name) {
		let driver = await new selenium.Builder().forBrowser('firefox').build();
		try {
			await driver.get('http://best.gg/team/' + TEAM_DICT[team_name]);
		} finally {
			let result = [];
			let elem = driver.getPageSource();
			elem.then(v => {
				let $ = cheerio.load(v);
				let play_list = $('.team__matches-item-content-header-match-info');
				play_list.each((i, elem) => {
					let my_team_name = $('.team__matches-item-content-header-match-info-my-team', $(elem)).text();
					let my_team_score = $('.team__matches-item-content-header-match-info-my-score', $(elem)).text();
					let oppo_name = $('.team__matches-item-content-header-match-info-opponent-team', $(elem)).text();
					let oppo_score = $('.team__matches-item-content-header-match-info-opponent-score', $(elem)).text();
					result.push([[TEAM_DICT_REV[my_team_name], my_team_score],[TEAM_DICT_REV[oppo_name], oppo_score], my_team_score > oppo_score ? '승리' : '패배']);
				});
			})
			await driver.quit();
			return result.slice(0, 2);
		}
	}
  */
	async proteamToRank(team_name) {
		const TEAM_DICT = {
			'케이티': '일등', '그리핀': '이등', '아프리카': '삼등', '킹존': '사등', '젠지': '오등'
		};

		return [team_name, TEAM_DICT[team_name]];
	}

	async rankToProteam(rank) {
		const RANK_DICT = {
			'일등': 0, '이등': 1, '삼등': 2, '사등': 3, '오등': 4
		};
		let result = ['케이티', '그리핀', '아프리카', '킹존', '젠지'];

		return [rank, result[RANK_DICT[rank]]];
	}

  async esportsResultsByTeamName(team_name) {
		let result = [[['에스케이티', '2'], ['젠지', '3'], '패배'],
							[['에스케이티', '0'], ['킹존', '2'], '패배']];

		return result;
	}

	async recentEsportsResults() {
		let result = [['11월 3일 오후 4시 30분', '아이지', '프나틱', '3', '0', '아이지'],
							['10월 28일 오후 5시', '씨나인', '프나틱', '0', '3', '프나틱']];
		return result;
	}
}

module.exports = new BtggService();
