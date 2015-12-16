PlatformService = {
	getJSON: function(contentType) {
        return new Promise(function(resolve, reject) {
			$.post("/taxonomy-service/v1/content/list/" + contentType , function(resp) {
	            resolve(resp);
	        })
	        .fail(function(err){
	        	reject(err);
	        });
		});
	},
	setAPIEndpoint: function(endpoint) {
		return endpoint;
	},
	getContentList: function() {
		var result = {"data": []};
		return new Promise(function(resolve, reject) {
			PlatformService.getJSON('Story')
			.then(function(stories) {
				if (stories && stories.contents) {
					if (stories.contents == null) {
						stories.contents = [];
					}
					for(i=0;i < stories.contents.length; i++) {
                    	var item = stories.contents[i];
                    	item.type = 'story';
                    	result.data.push(item);
                	}
                	result.appStatus = stories.appStatus;
				}
			})
			.then(function() {
				return PlatformService.getJSON('Worksheet')
			})
			.then(function(worksheets) {
				if (worksheets  && worksheets.contents) {
					if (worksheets.contents == null) {
						worksheets.contents = [];
					}
					for(i=0;i<worksheets.contents.length; i++) {
                    	var item = worksheets.contents[i];
                    	item.type = 'worksheet';
                    	result.data.push(item);
                	}
                	result.appStatus = worksheets.appStatus;
                }
				resolve(result);
			})
			.catch(function(err) {
				reject(err);
			})
		})
	},
	getContent: function(id) {
		var result = {"data": null};
		return new Promise(function(resolve, reject) {
			PlatformService.getJSON('stories.json')
			.then(function(stories) {
				if (stories && stories.result && stories.result.content) {
					if (stories.result.content == null) {
						stories.result.content = [];
					}
					for(i=0;i < stories.result.content.length; i++) {
                    	var item = stories.result.content[i];
                    	item.type = 'story';
                    	if(item.identifier == id) {
                    		result.data = item;
                    		break;
                    	}
                	}
				}
			})
			.then(function() {
				return PlatformService.getJSON('worksheets.json')
			})
			.then(function(worksheets) {
				if(result.data == null) {
					if (worksheets && worksheets.result && worksheets.result.content) {
						if (worksheets.result.content == null) {
							worksheets.result.content = [];
						}
						for(i=0;i<worksheets.result.content.length; i++) {
	                    	var item = worksheets.result.content[i];
	                    	item.type = 'worksheet';
	                    	if(item.identifier == id) {
	                    		result.data = item;
	                    		break;
	                    	}
	                	}
	                }
				}
				resolve(result);
			})
			.catch(function(err) {
				reject(err);
			})
		})
	}
}