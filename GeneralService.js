class GeneralService {
	constructor() {
		this.userName = "Hide on bush";
	}

	async getParameters(reqObj) {
		return reqObj.action.parameters;
	}

	async getResponse(output) {
		let resObj = {
			'version': "2.0",
			'resultCode': "OK"
		};
		resObj.output = output;
		return resObj;
	}

	async getTestRequest(actionName, parameters) {
		let reqObj = {
			'version': "2.0",
			'action': {
				'actionName': actionName,
				'parameters': parameters
			}
		};
		return reqObj;
	}

	async getUserName() {
		return this.userName;
	}
}

module.exports = new GeneralService();
