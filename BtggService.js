const selenium = require('selenium-webdriver');
const cheerio = require('cheerio');
const By = selenium.By;
require('geckodriver');

/*
	 find_team_ranks().then(function (result) {
	 console.log(result);
	 });
	 find_team_results('skt').then(function (result) {
	 console.log(result);
	 });
	 find_play_results().then(function (result) {
	 console.log(result);

	 });
*/

class BtggService {
	async find_team_ranks() {
		let driver = await new selenium.Builder().forBrowser('firefox').build();
		try {
			await driver.get('http://best.gg/standings/team/league=lck');
		} finally {
			let result = [];
			let elem = driver.getPageSource();
			elem.then(function (v) {
				let $ = cheerio.load(v);
				let rank_list = $('.dbook__leaderboard-item');
				rank_list.each(function () {
					let rank = $('.dbook__leaderboard-rank', $(this)).text();
					let team_name = $('.dbook__leaderboard-name-team', $(this)).text();
					result.push([rank, team_name]);
				});
			})
			await driver.quit();
			return result;
		}
	}

	async find_team_results(team_name) {
		let driver = await new selenium.Builder().forBrowser('firefox').build();
		try {
			await driver.get('http://best.gg/team/' + team_name);
		} finally {
			let result = [];
			let elem = driver.getPageSource();
			elem.then(function (v) {
				let $ = cheerio.load(v);
				let play_list = $('.team__matches-item-content-header-match-info');
				play_list.each(function () {
					let my_team_name = $('.team__matches-item-content-header-match-info-my-team', $(this)).text();
					let my_team_score = $('.team__matches-item-content-header-match-info-my-score', $(this)).text();
					let oppo_name = $('.team__matches-item-content-header-match-info-opponent-team', $(this)).text();
					let oppo_score = $('.team__matches-item-content-header-match-info-opponent-score', $(this)).text();
					result.push([[my_team_name, my_team_score],[oppo_name, oppo_score]]);
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
			elem.then(function (v) {
				let $ = cheerio.load(v);
				let schedule_list = $('li', '.home__schedule-list');
				schedule_list.each(function () {
					let list = [];
					let date = $('.home__schedule-item-title-date', $(this)).text();
					list.push(date);
					let team = $('.home__schedule-item-score-item', $(this));
					team.each(function () {
						let team_name = $('.home__schedule-item-score-item-name', $(this)).text();
						let team_score = $('.home__schedule-item-score-item-score', $(this)).text();
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
}

module.exports = new BtggService();
