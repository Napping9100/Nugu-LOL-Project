const request = require('request');

const TEAM_DICT = {'우리 팀': {100: 100, 200: 200}, '상대 팀': {100: 200, 200: 100}};
const CHAMPION_DICT = {
	'가렌': 86, '갈리오': 3, '갱플랭크': 41, '그라가스': 79, '그레이브즈': 104, '나르': 150, '나미': 267, '나서스': 75, '노틸러스': 111, '녹턴': 56,
	'누누와 윌럼프': 20, '니달리': 76, '니코': 518, '다리우스': 122, '다이애나': 131, '드레이븐': 119, '라이즈': 13, '라칸': 497, '람머스': 33, '럭스': 99,
	'럼블': 68, '레넥톤': 58, '레오나': 89, '렉사이': 421, '렝가': 107, '루시안': 236, '룰루': 117, '르블랑': 7, '리신': 64, '리븐': 92, 
	'리산드라': 127, '마스터 이': 11, '마오카이': 57, '말자하': 90, '말파이트': 54, '모데카이저': 82, '모르가나': 25, '문도 박사': 36, '미스 포츈': 21, '바드': 432,
	'바루스': 110, '바이': 254, '베이가': 45, '베인': 67, '벨코즈': 161, '볼리베어': 106, '브라움': 201, '브랜드': 63, '블라디미르': 8, '블리츠크랭크': 53,
	'빅토르': 112, '뽀삐': 78, '사이온': 14, '샤코': 35, '세주아니': 113, '소나': 37, '소라카': 16, '쉔': 98, '쉬바나': 102, '스웨인': 50,
	'스카너': 72, '시비르': 15, '신 짜오': 5, '신드라': 134, '신지드': 27, '쓰레쉬': 412, '아리': 103, '아무무': 32, '아우렐리온 솔': 136, '아이번': 427,
	'아지르': 268, '아칼리': 84, '아트록스': 266, '알리스타': 12, '애니': 1, '애니비아': 34, '애쉬': 22, '야스오': 157, '에코': 245, '엘리스': 60,
	'오공': 62, '오른': 516, '오리아나': 61, '올라프': 2, '요릭': 83, '우디르': 77, '우르곳': 6, '워윅': 19, '이렐리아': 39, '이블린': 28,
	'이즈리얼': 81, '일라오이': 420, '자르반 4세': 59, '자야': 498, '자이라': 143, '자크': 154, '잔나': 40, '잭스': 24, '제드': 238, '제라스': 101,
	'제이스': 126, '조이': 142, '직스': 115, '진': 202, '질리언': 26, '징크스': 222, '초가스': 31, '카르마': 43, '카밀': 164, '카사딘': 38,
	'카서스': 30, '카시오페아': 69, '카이사': 145, '카직스': 121, '카타리나': 55, '칼리스타': 429, '케넨': 85, '케이틀린': 51, '케인': 141, '케일': 10,
	'코그모': 96, '코르키': 42, '퀸': 133, '클레드': 240, '킨드레드': 203, '타릭': 44, '탈론': 91, '탈리야': 163, '탐 켄치': 223, '트런들': 48,
	'트리스타나': 18, '트린다미어': 23, '트위스티드 페이트': 4, '트위치': 29, '티모': 17, '파이크': 555, '판테온': 80, '피들스틱': 9, '피오라': 114, '피즈': 105,
	'하이머딩거': 74, '헤카림': 120
};
const TIER_DICT = {
	'IRON': '아이언', 'BRONZE': '브론즈', 'SILVER': '실버', 'GOLD': '골드', 'PLATINUM': '플레티넘', 'DIAMOND': '다이아몬드',
	'MASTER': '마스터', 'GRANDMASTER': '그랜드마스터', 'CHALLENGER': '챌린저'
};
const RANK_DICT = { 'I': '1', 'II': '2', 'III': '3', 'IV': '4', 'V': '5' };

class RiotService {
	constructor() {
		this.API_KEY = 'RGAPI-4e2b89d8-957c-4d2b-96b9-1cd1dfcb68bb';
		this.NUM_RECENT_GAMES = 15;
	}

	getAccountId(summonerName) {
		return new Promise(resolve => {
			request('https://kr.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + encodeURIComponent(summonerName) + '?api_key=' + this.API_KEY, (err, res, body) => {
					let accountId = null;

					if (res.statusCode == 200) {
						let response = JSON.parse(body);
						accountId = response.accountId;
					}

					resolve(accountId);
					});
		});
	}

	getSummonerId(summonerName) {
		return new Promise(resolve => {
			request('https://kr.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + encodeURIComponent(summonerName) + '?api_key=' + this.API_KEY, (err, res, body) => {
					let summonerId = null;

					if (res.statusCode == 200) {
						let response = JSON.parse(body);
						summonerId = response.id;
					}

					resolve(summonerId);
					});
		});
	}

	getResult(gameId, accountId) {
		return new Promise(resolve => {
			request('https://kr.api.riotgames.com/lol/match/v3/matches/' + gameId + '?api_key=' + this.API_KEY, (err, res, body) => {
					let result = null;

					if (res.statusCode == 200) {
						let participantId;

						let response = JSON.parse(body);
						for (let i in response.participantIdentities)
							if (response.participantIdentities[i].player.accountId == accountId)
								participantId = response.participantIdentities[i].participantId;

						for (let i in response.participants)
							if (response.participants[i].participantId == participantId)
								result = response.participants[i].stats.win;
					}

					resolve(result);
					});
		});
	}

	getNumWins(accountId, matches) {
		return new Promise(resolve => {
			let counter = matches.length;
			let numWins = 0;

			matches.forEach(match => {
				request('https://kr.api.riotgames.com/lol/match/v3/matches/' + match.gameId + '?api_key=' + this.API_KEY, (err, res, body) => {
						let result = null;

						if (res.statusCode == 200) {
							let participantId;

							let response = JSON.parse(body);
							for (let i in response.participantIdentities)
								if (response.participantIdentities[i].player.accountId == accountId)
									participantId = response.participantIdentities[i].participantId;

							for (let i in response.participants)
								if (response.participants[i].participantId == participantId)
									result = response.participants[i].stats.win;
						}

						if (result)
						numWins++;

						if (--counter == 0)
						resolve(numWins);
			});
			});
		});
	}

	async answerTier(summonerName) {
		let answer = ['정보를 읽어올 수 없습니다. 잠시 후에 다시 시도해주세요.'];
		let summonerId = await this.getSummonerId(summonerName);

		if (summonerId) {
			answer = await new Promise(resolve => {
				request('https://kr.api.riotgames.com/lol/league/v3/positions/by-summoner/' + summonerId + '?api_key=' + this.API_KEY, (err, res, body) => {
						if (res.statusCode == 200) {
							answer = ['소환사님의 솔로랭크 티어가 존재하지 않습니다'];

							let response = JSON.parse(body);
							for (let i in response)
								if (response[i].queueType == 'RANKED_SOLO_5x5')
									answer = [TIER_DICT[response[i].tier] + ' ' + RANK_DICT[response[i].rank] + ' ' + response[i].leaguePoints + 'LP '];
						}

						resolve(answer);
						});
			});
		}

		return answer;
	}

	async answerWinRate(summonerName) {
		let answer = ['정보를 읽어올 수 없습니다. 잠시 후에 다시 시도해주세요.'];
		let summonerId = await this.getSummonerId(summonerName);

		if (summonerId) {
			answer = await new Promise(resolve => {
				request('https://kr.api.riotgames.com/lol/league/v3/positions/by-summoner/' + summonerId + '?api_key=' + this.API_KEY, (err, res, body) => {
						if (res.statusCode == 200) {
							answer = ['소환사님의 솔로랭크 전적이 존재하지 않습니다'];

							let response = JSON.parse(body);
							for (let i in response)
								if (response[i].queueType == 'RANKED_SOLO_5x5')
									answer = [response[i].wins + '승 ' + response[i].losses + '패 ', Math.floor(response[i].wins / (response[i].wins + response[i].losses) * 100) + '퍼센트 '];
						}

						resolve(answer);
						});
			});
		}

		return answer;
	}

	async answerTodayWinRate(summonerName) {
		let answer = ['정보를 읽어올 수 없습니다. 잠시 후에 다시 시도해주세요.'];
		let accountId = await this.getAccountId(summonerName);

		if (accountId) {
			answer = ['소환사님의 오늘 게임 전적이 존재하지 않습니다.'];

			let date = new Date();
			let endTime = date.getTime();
			date.setHours(0, 0, 0, 0);
			let beginTime = date.getTime();

			let matches = await new Promise(resolve => {
				request('https://kr.api.riotgames.com/lol/match/v3/matchlists/by-account/' + accountId + '?endTime=' + endTime + '&beginTime=' + beginTime + '&api_key=' + this.API_KEY, (err, res, body) => {
						let matches = null;

						if (res.statusCode == 200) {
							let response = JSON.parse(body);
							matches = response.matches;
						}

						resolve(matches);
						});
			});


			if (matches) {
				let numWins = await this.getNumWins(accountId, matches);
				answer = [numWins + '승 ' + (matches.length - numWins) + '패 ', + Math.floor(numWins / matches.length * 100) + '퍼센트 '];
			}
		}

		return answer;
	}

	async answerRecentWinRate(summonerName) {
		let answer = ['정보를 읽어올 수 없습니다. 잠시 후에 다시 시도해주세요.'];
		let accountId = await this.getAccountId(summonerName);

		if (accountId) {
			answer = ['소환사님의 최근 게임 수가 부족합니다.'];

			let matches = await new Promise(resolve => {
				request('https://kr.api.riotgames.com/lol/match/v3/matchlists/by-account/' + accountId + '?endIndex=' + this.NUM_RECENT_GAMES + '&beginIndex=0&api_key=' + this.API_KEY, (err, res, body) => {
						let matches = null;

						if (res.statusCode == 200) {
							let response = JSON.parse(body);
							matches = response.matches;
						}

						resolve(matches);
						});
			});


			if (matches && matches.length == this.NUM_RECENT_GAMES) {
				let numWins = await this.getNumWins(accountId, matches);
				answer = [Math.floor(numWins / this.NUM_RECENT_GAMES * 100) + '퍼센트 '];
			}
		}

		return answer;
	}

	async answerRecentChampionWinRate(summonerName, champion) {
		let answer = ['정보를 읽어올 수 없습니다. 잠시 후에 다시 시도해주세요.'];
		let accountId = await this.getAccountId(summonerName);

		if (accountId) {
			answer = ['소환사님의 최근 ' + champion + ' 플레이 수가 부족합니다.'];

			let matches = await new Promise(resolve => {
				request('https://kr.api.riotgames.com/lol/match/v3/matchlists/by-account/' + accountId + '?champion=' + CHAMPION_DICT[champion] + '&endIndex=' + this.NUM_RECENT_GAMES + '&beginIndex=0&api_key=' + this.API_KEY, (err, res, body) => {
						let matches = null;

						if (res.statusCode == 200) {
							let response = JSON.parse(body);
							matches = response.matches;
						}

						resolve(matches);
						});
			});

			if (matches && matches.length == this.NUM_RECENT_GAMES) {
				let numWins = await this.getNumWins(accountId, matches);
				answer = [champion, Math.floor(numWins / this.NUM_RECENT_GAMES * 100) + '퍼센트 '];
			}
		}

		return answer;
	}

	async answerChampionMastery(summonerName, champion) {
		let answer = ['정보를 읽어올 수 없습니다. 잠시 후에 다시 시도해주세요.'];
		let summonerId = await this.getSummonerId(summonerName);

		if (summonerId) {
			answer = ['소환사님의 ' + champion + ' 숙련도가 존재하지 않습니다.'];

			answer = await new Promise(resolve => {
				request('https://kr.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/' + summonerId + '/by-champion/' + CHAMPION_DICT[champion] + '?api_key=' + this.API_KEY, (err, res, body) => {
						if (res.statusCode == 200) {
							let response = JSON.parse(body);
							answer = [champion, response.championLevel + '레벨 '];
						}

						resolve(answer);
						});
			});
		}

		return answer;
	}

	getSummonerNameByChampion(summonerId, team, champion) {
		return new Promise(resolve => {
			request('https://kr.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/' + summonerId + '?api_key=' + this.API_KEY, (err, res, body) => {
					let summonerNameByChampion = null;

					if (res.statusCode == 200) {
						let teamId;

						let response = JSON.parse(body);
						for (let i in response.participants)
							if (response.participants[i].summonerId == summonerId)
								teamId = TEAM_DICT[team][response.participants[i].teamId];

						for (let i in response.participants)
							if (response.participants[i].teamId == teamId && response.participants[i].championId == CHAMPION_DICT[champion])
								summonerNameByChampion = response.participants[i].summonerName;
					}

					resolve(summonerNameByChampion);
					});
		});
	}

	async answerTierByChampion(summonerName, team, champion) {
		let answer = ['정보를 읽어올 수 없습니다. 잠시 후에 다시 시도해주세요.'];
		let summonerId = await this.getSummonerId(summonerName);

		if (summonerId) {
			answer = ['소환사님이 현재 게임 중이지 않습니다.'];

			let summonerNameByChampion = await this.getSummonerNameByChampion(summonerId, team, champion);

			if (summonerNameByChampion)
				answer = await answerTier(summonerNameByChampion);
		}

		return answer;
	}

	async answerWinRateByChampion(summonerName, team, champion) {
		let answer = ['정보를 읽어올 수 없습니다. 잠시 후에 다시 시도해주세요.'];
		let summonerId = await this.getSummonerId(summonerName);

		if (summonerId) {
			answer = ['소환사님이 현재 게임 중이지 않습니다.'];

			let summonerNameByChampion = await this.getSummonerNameByChampion(summonerId, team, champion);

			if (summonerNameByChampion)
				answer = await answerWinRate(summonerNameByChampion);
		}

		return answer;
	}

	async answerRecentChampionWinRateByChampion(summonerName, team, champion) {
		let answer = ['정보를 읽어올 수 없습니다. 잠시 후에 다시 시도해주세요.'];
		let summonerId = await this.getSummonerId(summonerName);

		if (summonerId) {
			answer = ['소환사님이 현재 게임 중이지 않습니다.'];

			let summonerNameByChampion = await this.getSummonerNameByChampion(summonerId, team, champion);

			if (summonerNameByChampion)
				answer = await answerRecentChampionWinRate(summonerNameByChampion, champion);
		}

		return answer;
	}

	async answerChampionMasteryByChampion(summonerName, team, champion) {
		let answer = ['정보를 읽어올 수 없습니다. 잠시 후에 다시 시도해주세요.'];
		let summonerId = await this.getSummonerId(summonerName);

		if (summonerId) {
			answer = ['소환사님이 현재 게임 중이지 않습니다.'];

			let summonerNameByChampion = await this.getSummonerNameByChampion(summonerId, team, champion);

			if (summonerNameByChampion)
				answer = await answerChampionMastery(summonerNameByChampion, champion);
		}

		return answer;
	}
}

module.exports = new RiotService();
