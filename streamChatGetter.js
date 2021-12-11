var fetch = require('node-fetch');

let max = 100;
let videoURL = 'https://www.youtube.com/watch?v=ekzOqOmEsWI';

function getChatData(continuation, offset, init, whenDone){
	fetch("https://www.youtube.com/youtubei/v1/live_chat/get_live_chat_replay?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", {
		body: '{"context":{"client":{"hl":"zh-TW","gl":"TW","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)","clientName":"WEB","clientVersion":"2.20211210.01.00"}},"continuation":"'+continuation+'","currentPlayerState":{"playerOffsetMs":"'+offset+'"}}',
		method: 'POST',
	}).then(e=>e.json()).then((json)=>{
		const data = json.continuationContents.liveChatContinuation.actions;
		if (!init) data.splice(0,1);
		if (data.length === 0) return;
		// console.log(json)
		whenDone(json);
		if(!init && max-- > 0){
			offset = data[data.length-1].replayChatItemAction.videoOffsetTimeMsec;
			getChatData(continuation, offset, init, whenDone);
		}
	});
}

function getKey(e){
	let startKey = 'continuation';
    let startIndex = e.indexOf('"'+startKey+'"');
    startIndex = e.indexOf('"', startIndex+startKey.length+2)+1;
    let endIndex = e.indexOf('"', startIndex+1);
    return e.slice(startIndex,endIndex);
}

function dataGeted(data){
	const messageActions = data.continuationContents.liveChatContinuation.actions;
	for(const messageAction of messageActions){
		for(const action of messageAction.replayChatItemAction.actions){
			const item = action.addChatItemAction.item.liveChatTextMessageRenderer;
			if(!item)continue;
			const time = item.timestampText.simpleText;
			const username = item.authorName.simpleText;
			const message = item.message.runs[0].text;
			console.log(`${time}: ${username} -> ${message}`);
		}
	}
}

fetch(videoURL).then(e=>e.text()).then((e)=>{
    let key = getKey(e);
	getChatData(key, 0, true, (json)=>{
		console.log(key);
		dataGeted(json);
		fetch('https://www.youtube.com/live_chat_replay?continuation=' + key, 
			{headers:{'user-agent':'Mozilla/5.0 Chrome/96.0.4664.93'}}
		).then(e=>e.text()).then((e)=>{
			let key = getKey(e);
			// console.log(key);
			const data = json.continuationContents.liveChatContinuation.actions;
			const offset = data[data.length-1].replayChatItemAction.videoOffsetTimeMsec;
			getChatData(key, offset, false, (json)=>{
				dataGeted(json);
			})
		});
	});
});
