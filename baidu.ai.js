const https = require('https')
const express=require("express");
var request = require('request')
const bodyParser=require("body-parser");
var qs = require('querystring');
var cookieParser = require('cookie-parser');
const ai=express();

ai.use('/web', express.static('web'));
ai.use(cookieParser());
 //apppid 16070855
var token = ''
const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'QC8rHYEA2EvZEtP5BxaffKQA',
    'client_secret': '7hWggxufIODfPgqZX63rrXO18OpS3nug'
});
https.get(
    {
        hostname: 'aip.baidubce.com',
        path: '/oauth/2.0/token?' + param,
        agent: false
    },
    function (res) {
        res.on('data', (d) => {
			console.log("认证成功")
			let b = JSON.parse('' + d); //将buffer转成JSON
			token = b["access_token"]
			console.log(token)
		})
    }
);

ai.use(bodyParser.urlencoded({
    extended: false
}));
ai.use(bodyParser.json());
ai.use("*", function(request, response, next) {
    response.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
    next();
});
// {
// 	hostname: 'aip.baidubce.com',
// 	path: '/oauth/2.0/token?' + param,
// 	agent: false
// },
// res.cookie('token',process.stdout.access_token)
// ai.get("/acctoken",function(req,res){

// });
var logId = 1000
ai.post("/sendMsg",function(req,res){
	var text1 = req.body.text
	logId + 1
	console.log(text1)
	var setData = {
		'log_id': logId,
		'version': '2.0',
		'request': {
			'user_id': '88888',
			'query': text1,
		},
		'dialog_state': {
			'contexts': {
				'SYS_REMEMBERED_SKILLS': ['49631']
			}
		},
		'session_id': '',
		'service_id': 'S17156'
	}
	if(req.body.session_id){
		setData.session_id = req.body.session_id
	}
	// if(req.body.origin){
	// 	setData.dialog_state.contexts.SYS_REMEMBERED_SKILLS.push(req.body.origin)
	// }
	// console.log(setData)
	request(
		{
			url: 'https://aip.baidubce.com/rpc/2.0/unit/service/chat?access_token=' + token,
			method: 'POST',
			json: true,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			},
			body:setData
		},
		function (error, response, body) {
			// 在标准输出中查看运行结果
			if (!error && response.statusCode == 200) {
				console.log(body) // 请求成功的处理逻辑
				// if(textObj.length < list.length){
				// 	textObj.push({'score':body.score,'text':body.texts.text_2})
				// }else{
					// res.end(JSON.stringify(textObj[0].text));
				// }
				res.end(JSON.stringify(body));
			}
		}
	)
});

 
ai.listen(8081, '0.0.0.0');
console.log("开启服务器");