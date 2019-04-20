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
const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'l08MwyMLLeI5P4HvZj5SapkY',
    'client_secret': 'Rt3GmAHzrGOwU9bovblTjHubUCG9gW7C'
});
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
ai.post("/sendMsg",function(req,res){
	var text1 = req.body.text
	https.get({
		hostname: 'aip.baidubce.com',
		path: '/oauth/2.0/token?' + param,
		agent: false
	},function (res2) {
		// 在标准输出中查看运行结果
		// res2.pipe(process.stdout);
		// console.log('statusCode:', res2.statusCode);
		// console.log('headers:', res2.headers);
		res2.on('data', (d) => {
			console.log("认证成功")
			console.log('' + d); //将buffer转为字符串或者使用d.toString()
			let b = JSON.parse('' + d); //将buffer转成JSON
			console.log(b)
			var access_token = b["access_token"]
			console.log(access_token)
			// res.end(JSON.stringify(b));
			request_url = "https://aip.baidubce.com/rpc/2.0/nlp/v2/simnet" + "?access_token=" + access_token
			// var list = ['出险了去哪理赔？','旅行买什么保险？','出国买什么保险？','哪些保险好？']
			var list = '出险了去哪理赔？'
			var textObj = []
			// list.forEach(function(item,index){
			// 	let text2 = item
				request({
					url: request_url,
					method: "POST",
					json: true,
					headers: {
							"content-type": "application/json",
					},
					body: {text_1:text1,text_2:'吃饭了吗?'}
				}, function (error, response, body) {
						console.log(error)
						// console.log(response)
						// console.log(body)
						if (!error && response.statusCode == 200) {
								console.log(body) // 请求成功的处理逻辑
								// if(textObj.length < list.length){
								// 	textObj.push({'score':body.score,'text':body.texts.text_2})
								// }else{
									// res.end(JSON.stringify(textObj[0].text));
								// }
								res.end(JSON.stringify(body));
						}
					});
				});
			// })
		});
		// res.cookie('token',token)
    // res.send({"code": "0", "text": req.body.text})
});

 
ai.listen(8081, '0.0.0.0');
console.log("开启服务器");