var fetch = require('node-fetch');

let max = 100;

const user = {};
function dataGeted(data){
	if (data === null) return true;
	const messageActions = data.continuationContents.liveChatContinuation.actions;
	for(const messageAction of messageActions){
		for(const action of messageAction.replayChatItemAction.actions){
			let item = action.addChatItemAction;
			if(!item)continue;
			item = item.item.liveChatTextMessageRenderer;
			if(!item)continue;
			// const time = item.timestampText.simpleText;
			const username = item.authorName.simpleText;
			// const message = item.message.runs[0].text;
			
			// const space1 = new Array(10 - time.length + 1).join(' ');
			// let length = 0;
			// for(let i = 0; i < username.length; i++)
				// if (username.charCodeAt(i) < 127)
					// length ++;
				// else
					// length += 2;
			// length = 20 - length + 1;
			// const space2 = new Array(length<0?0:length).join(' ');
			
			if (user[username] === undefined)
				user[username] = 0;
			user[username]++;
			// console.log(`${time}${space1}: ${username}${space2}-> ${message}`);
		}
	}
	return false;
}

function getChatData(continuation, offset, init, whenDone){
	fetch("https://www.youtube.com/youtubei/v1/live_chat/get_live_chat_replay?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", {
		body: '{"context":{"client":{"hl":"zh-TW","gl":"TW","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)","clientName":"WEB","clientVersion":"2.20211210.01.00"}},"continuation":"'+continuation+'","currentPlayerState":{"playerOffsetMs":"'+offset+'"}}',
		method: 'POST',
	}).then(e=>e.json()).then((json)=>{
		const data = json.continuationContents.liveChatContinuation.actions;
		if (data === undefined) {
			whenDone(null);
			return;
		}
		if (!init) data.splice(0,1);
		if (data.length === 0) {
			whenDone(null);
			return;
		}
		// console.log(json)
		whenDone(json);
		if(!init && max-- > 0){
			offset = data[data.length-1].replayChatItemAction.videoOffsetTimeMsec;
			getChatData(continuation, offset, init, whenDone);
		}
	});
}

function getKey(e){
	let startKey = '"continuation":"';
	let startIndex = e.indexOf(startKey);
	if (startIndex === -1) return null;
	startIndex += startKey.length;
	let endIndex = e.indexOf('"', startIndex+1);
	return e.slice(startIndex, endIndex);
}

function getChat(videoURL, done){
	console.log(videoURL);
	fetch(videoURL).then(e=>e.text()).then((e)=>{
		let key = getKey(e);
		if (key === null) {
			console.log('cant get: ' + videoURL);
			return;
		}
		getChatData(key, 0, true, (json)=>{
			// console.log(key);
			dataGeted(json);
			fetch('https://www.youtube.com/live_chat_replay?continuation=' + key, 
				{headers:{'user-agent':'Mozilla/5.0 Chrome/96.0.4664.93'}}
			).then(e=>e.text()).then((e)=>{
				let key = getKey(e);
				// console.log(key);
				const data = json.continuationContents.liveChatContinuation.actions;
				const offset = data[data.length-1].replayChatItemAction.videoOffsetTimeMsec;
				getChatData(key, offset, false, (json)=>{
					if(dataGeted(json))
						done();
				});
			});
		});
	});
}

let urls = [
    "https://www.youtube.com/watch?v=3xN61yWbJdU",
    "https://www.youtube.com/watch?v=e4RmbXZNvls",
    "https://www.youtube.com/watch?v=ekzOqOmEsWI",
    "https://www.youtube.com/watch?v=1rQ22qAiOJM",
    "https://www.youtube.com/watch?v=3u7WH99MHlE",
    "https://www.youtube.com/watch?v=iH0CzRJf2Sc",
    "https://www.youtube.com/watch?v=sTLvCMm7b0Y",
    "https://www.youtube.com/watch?v=WLdbdLyl-rk",
    "https://www.youtube.com/watch?v=GnRi4kS-eas",
    "https://www.youtube.com/watch?v=eBPEXVV0ntg",
    "https://www.youtube.com/watch?v=UZidr3bH4fU",
    "https://www.youtube.com/watch?v=tPLBhj9_Tbc",
    "https://www.youtube.com/watch?v=DPHF8Xl5AX8",
    "https://www.youtube.com/watch?v=UszKwGU2CsE",
    "https://www.youtube.com/watch?v=ijMHfEE8S1A",
    "https://www.youtube.com/watch?v=YTLukAKG6Pk",
    "https://www.youtube.com/watch?v=K7r7Eke60kA",
    "https://www.youtube.com/watch?v=lw2e26oJHF8",
    "https://www.youtube.com/watch?v=YjpZAvGILag",
    "https://www.youtube.com/watch?v=QjekZ0f_o3s",
    "https://www.youtube.com/watch?v=lEnra-oMSKA",
    "https://www.youtube.com/watch?v=h9s57zkk5ig",
    "https://www.youtube.com/watch?v=HWb-A48SBsQ",
    "https://www.youtube.com/watch?v=EYU_keYZxFs",
    "https://www.youtube.com/watch?v=2cqWU7zhknw",
    "https://www.youtube.com/watch?v=zvizqssh9z0",
    "https://www.youtube.com/watch?v=_Uuu0hgkXB0",
    "https://www.youtube.com/watch?v=L8oggxxvSis",
    "https://www.youtube.com/watch?v=MiZXMo2Wf7E",
    "https://www.youtube.com/watch?v=rjrkEg3-le8",
    "https://www.youtube.com/watch?v=csdspDuOEDM",
    "https://www.youtube.com/watch?v=JFIQCEv_MWw",
    "https://www.youtube.com/watch?v=veoWdOklpfI",
    "https://www.youtube.com/watch?v=MiRlft7kl_g",
    "https://www.youtube.com/watch?v=ERyDq6rq8IU",
    "https://www.youtube.com/watch?v=6-S_ryhOhg0",
    "https://www.youtube.com/watch?v=IX3GsROm9AY",
    "https://www.youtube.com/watch?v=JFg0jkDfgJw",
    "https://www.youtube.com/watch?v=RcIeF6cIt_I",
    "https://www.youtube.com/watch?v=JdbvRlugsLY",
    "https://www.youtube.com/watch?v=gZAK1x1_W4Y",
    "https://www.youtube.com/watch?v=ReLEIiIe3Wg",
    "https://www.youtube.com/watch?v=gykKjjjZVK0",
    "https://www.youtube.com/watch?v=r7VGcRt8Ybk",
    "https://www.youtube.com/watch?v=9BN2dU0Tysk",
    "https://www.youtube.com/watch?v=Hs2_MJx7zU0",
    "https://www.youtube.com/watch?v=q9TIbpOuPIs",
    "https://www.youtube.com/watch?v=UnUba2pKMDM",
    "https://www.youtube.com/watch?v=Fx1dxrTFwk8",
    "https://www.youtube.com/watch?v=qtu4sw-5i4o",
    "https://www.youtube.com/watch?v=kwy2ZXJbWng",
    "https://www.youtube.com/watch?v=1ABjaIqvOR8",
    "https://www.youtube.com/watch?v=Y9EHAgTtHs4",
    "https://www.youtube.com/watch?v=AVWjvJfkg9E",
    "https://www.youtube.com/watch?v=Dt0ISbrhLEY",
    "https://www.youtube.com/watch?v=sKeuc2q5PwM",
    "https://www.youtube.com/watch?v=Nkdyz77eHjU",
    "https://www.youtube.com/watch?v=9Zai3K9tcbU",
    "https://www.youtube.com/watch?v=jQHgeNSxu_A",
    "https://www.youtube.com/watch?v=mvvBVnPOyKU",
    "https://www.youtube.com/watch?v=x7YRlpvZSMA",
    "https://www.youtube.com/watch?v=BJSX14lvvZY",
    "https://www.youtube.com/watch?v=2bvu-BzDSOQ",
    "https://www.youtube.com/watch?v=okIdpV6MGZw",
    "https://www.youtube.com/watch?v=aXpCpHWuePM",
    "https://www.youtube.com/watch?v=1H7GHNznMsM",
    "https://www.youtube.com/watch?v=EbFpiHMNsAc",
    "https://www.youtube.com/watch?v=zDFy3aqpoUw",
    "https://www.youtube.com/watch?v=4SxeBnF7voE",
    "https://www.youtube.com/watch?v=sHH4tvYl4lg",
    "https://www.youtube.com/watch?v=gzQWOG_lxls",
    "https://www.youtube.com/watch?v=3Og7LGfSPiM",
    "https://www.youtube.com/watch?v=tJP0EXmUnAA",
    "https://www.youtube.com/watch?v=fBeIAiExHXg",
    "https://www.youtube.com/watch?v=GRHH87TS9LY",
    "https://www.youtube.com/watch?v=gtXH87PyY9g",
    "https://www.youtube.com/watch?v=V7CRmle8In4",
    "https://www.youtube.com/watch?v=aiZXLavtn2E",
    "https://www.youtube.com/watch?v=GUO0XRSDfJk",
    "https://www.youtube.com/watch?v=KM0gefwmTJE",
    "https://www.youtube.com/watch?v=4RdY1medyJY",
    "https://www.youtube.com/watch?v=prZoLgsAXLw",
    "https://www.youtube.com/watch?v=37yLj3TfnUM",
    "https://www.youtube.com/watch?v=7_O21hPjeGk",
    "https://www.youtube.com/watch?v=lnQoT9LaaeU",
    "https://www.youtube.com/watch?v=XtAATCUQUK4",
    "https://www.youtube.com/watch?v=ZVTQocGKFIY",
    "https://www.youtube.com/watch?v=mN13lr9htTI",
    "https://www.youtube.com/watch?v=CTsocrT6lYk",
    "https://www.youtube.com/watch?v=7CAnZPaecDc",
    "https://www.youtube.com/watch?v=XjhpmkH0Lqo",
    "https://www.youtube.com/watch?v=Hjn4jgdsqoQ",
    "https://www.youtube.com/watch?v=h213o4AK1NA",
    "https://www.youtube.com/watch?v=kvgY9SI0qt0",
    "https://www.youtube.com/watch?v=PYfxbMwAGLI",
    "https://www.youtube.com/watch?v=d9sIVf7rezs",
    "https://www.youtube.com/watch?v=JBAPPdQJyl0",
    "https://www.youtube.com/watch?v=yZLUJoA7Nck",
    "https://www.youtube.com/watch?v=Tym-8Aj_eHs",
    "https://www.youtube.com/watch?v=JNByYI-N6Ms",
    "https://www.youtube.com/watch?v=KL1C5ln0i0s",
    "https://www.youtube.com/watch?v=gd11Wf9W9Zg",
    "https://www.youtube.com/watch?v=N5gwjI5Mj84",
    "https://www.youtube.com/watch?v=GoDPgItOkIg",
    "https://www.youtube.com/watch?v=g5SoQBqF54I",
    "https://www.youtube.com/watch?v=O_zunohr-v4",
    "https://www.youtube.com/watch?v=0FZtp1fhNbk",
    "https://www.youtube.com/watch?v=rOxbtwTVfOQ",
    "https://www.youtube.com/watch?v=oDLv3-F237Y",
    "https://www.youtube.com/watch?v=VKZw94VNGD8",
    "https://www.youtube.com/watch?v=YVIXaSfH2TA",
    "https://www.youtube.com/watch?v=iYly2aKzfgU",
    "https://www.youtube.com/watch?v=yIScBwFouFs",
    "https://www.youtube.com/watch?v=I378tt_D4cY",
    "https://www.youtube.com/watch?v=XaQNdrUawHM",
    "https://www.youtube.com/watch?v=6xq420GjHvk",
    "https://www.youtube.com/watch?v=05vJCo2fEzM",
    "https://www.youtube.com/watch?v=3DtaSw4MX7s",
    "https://www.youtube.com/watch?v=5W2PuT6p2AY",
    "https://www.youtube.com/watch?v=e68zad24D_4"
];

for(const url of urls) {
	getChat(url, ()=>{
		console.log(JSON.stringify(user));
	});
}
