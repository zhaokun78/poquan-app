'use strict';
const {
	wxConfigMp,
	wxConfigApp,
	wxConfigH5,
	aliConfigMp,
	aliConfigApp,
	aliConfigH5,
	// aliConfigSandbox
} = require('config')
const uniPay = require('uni-pay')
const db = uniCloud.database()
exports.main = async (event, context) => {
	let uniPayInstance
	let provider
	switch (event.path.substring(1)) {
		case 'wxpay_mp-weixin':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(wxConfigMp)
			break;
		case 'wxpay_app-plus':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(wxConfigApp)
			break;
		case 'wxpay_h5':
			provider = 'weixin'
			uniPayInstance = uniPay.initWeixin(wxConfigH5)
			break;
		case 'alipay_mp-alipay':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(aliConfigMp)
			break;
		case 'alipay_app-plus':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(aliConfigApp)
			break;
		case 'alipay_h5':
			provider = 'alipay'
			uniPayInstance = uniPay.initAlipay(aliConfigH5)
			// uniPayInstance = uniPay.initAlipay(aliConfigSandbox)
			break;
		default:
			console.log('---------参数错误-------')
			return {
				code: -1,
				msg: '参数错误'
			}
	}
	let verifyResult = await uniPayInstance.verifyPaymentNotify(event)
	if (!verifyResult) {
		console.log('---------!verifyResult-------')
		return {}
	}
	let {
		outTradeNo,
		totalFee,
		transactionId,
		resultCode
	} = verifyResult

	const orderList = await db.collection('order').where({
		outTradeNo
	}).get()

	if (orderList.data.length < 0) {
		console.log('---------orderList.data.length < 0-------')
		return {}
	}

	const orderDetail = orderList.data[0]

	if (totalFee === orderDetail.totalFee && (resultCode === 'SUCCESS' || resultCode === 'FINISHED')) {
		console.log('---------updatedb-------')
		await db.collection('order').where({
			outTradeNo
		}).update({
			status: 2,
			transactionId
		})
	}
	console.log("verifyResult: " + JSON.stringify(verifyResult));
	// 注意如果处理成功需要严格按照下面的格式进行返回，否则厂商会持续通知
	if (provider === 'weixin') {
		// 微信处理成功之后 
		return {  
			statusCode: 200,  
			headers: {  
					'content-type': 'text/xml;charset=utf-8'  
			},  
			body: `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`  
		}
	}
	// 支付宝处理成功后  
	return {  
	  statusCode: 200,
	  headers: {  
	    'content-type': 'text/plain'  
	  },  
	  body: "success"
	}
};
