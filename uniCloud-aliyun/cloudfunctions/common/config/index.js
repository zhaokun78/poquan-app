const path = require('path')
module.exports = {
	// 微信小程序端对应的微信支付及登录配置配置
	wxConfigMp: {
		appId: '',
		secret: '',
		mchId: '',
		key: '',
	},
	// App端对应的微信支付配置
	wxConfigApp: {
		appId: '',
		mchId: '',
		key: '',
	},
	// 微信PC网站支付
	wxConfigH5: {
		appId: '',
		mchId: '',
		key: '',
	},
	// 支付宝小程序端对应的支付宝支付及登录配置
	aliConfigMp: {
		mchId: "",
		appId: "",
		alipayPublicKey: "",
		privateKey: "",
	},
	// App端对应的支付宝支付配置
	aliConfigApp: {
		mchId: "2088041555343457",
		appId: "2021002139630063",
		alipayPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtxuaEeZZ3FjrSg2W6K3lOs3CQHCwher/eHgd69+5kOtgjXvRLsLotMrA0DwbKjiKWZD3wtddloL/m9W+0rWXI2AuTBOVfhmIpnH8/K6t/1mz70Kos56DG/+NbPjVbsRBK4bL5o5ukQ2DzK1k52NXHcSLs4ZUCM71yW0v+S72ti8FJzbszQiVOtJx4ObQc9Kx/R4Vs4r7yNKseOJJ1o06xWxxHjUgiY/XLfz1uZ7Z/bIjQrGrNpwcruHmcSqWp7o7Vg5m3FUPWxwo7tdYOX7qt6RyAPHot06KE8UeQ8hczPkKN5yvXozt0NhdCEULT5Xer3BaGtEvQO8rOBZhOIo94QIDAQAB",
		privateKey: "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyIqkqA4xZgusV2BU/6o9HHPI0XAvOiWeY+oyLDe22shR//7Z0T5Nb0DdSTq+end0yfaLRkjHu8jsTkUmjxDQtPT/je5kh9Kz8DCdqX6nUn/2bUHVnAwkUES1QS9qeUFAgurYvFqu8Y5JbKk0/r4iM2d8HFYwBOBET5V3aURgpb/JvKE7L+gWjO26NoHS88+ZmLdE0MSGTZ/9p4E+ZydQx+Pjnxjc9By7ScpwDfstukpCWLkqAnty5EtPK1W2lJE4P9PoztrHhTQ+pFQpXMnekD5wfui3np4ofg8Mv01Jt/hz0oRyLz8nODblo5FSHqmVnv8jHoBUhCP/ZQ3dRIx45AgMBAAECggEACnFhvWbL2YuFQJiUVlTn5WFbCZrDzm3btuopRxWf8+/op8BT7+miV+WS+K5IOWJDz2vyGZsadkmZEQKZcJJWBLjsf+eFCKqRYY1M2j2VdTOT6IEFAO76n0SKhYSM4m8O43xOpeAMXVTxBYsrUCp4NNmo639l38Rrq+DsaZoLcpJWciU3QWz0NhIEtDSTF5hP1i3r0+5j2lQQpJbqhQduD4FvhZ5YnsQSwhXX/LA2/YjPuDiancVcSE0ks8J9L/eGeX4W0MT5jxuevC0+wGyl5OHaQVcYhRyeheI+IjBQC0vUEEDxr9c15abRUkIBGHlHSkAaKFlc4x+i/bK8CaacSQKBgQDfHMUrbP31nZQq5LZiHt4s7XFx78Jpm/6ECSzyEQ4jfvx8jOCw59pPrI9wKcOvEUSkpF21jH7yo74nn46g9SNeqJJnWx6/byhSu7HO8VBzXbtLXKqT8Z/ZkEzqLFuVHZNPQ5nd1CVfbPX+t2zBBvGocpwV5YieG1ou1D67vSK80wKBgQDMZKq9pd34GX6RNFtCtulirx+nPVrgbkn3iT4E6tGbLmwXq6nOfNd7MIImfAhs32IYHpHkWpsuEgmT/PRhHPdPjXYCdsqy35uesJ7fVaooa6j+28INFlZW+PmLjvcf0n3FBh3nYJWk0x51/ZsRRakpdz7bf6Q+FgoYOhNoy6mhQwKBgQDAV/o3NNA/1eitjd0Z/AiH7O+XTR5qk3w48fwYd9GbklczPPRcLpWLiHVkOe0kWRu3YKgU4plyru05FZoNcyhZ67PDfM+mM7ssj/l7MZiszIqyLqIzxuOK2ZclbrZJeGTNubbFgaXyfWoZfKI6SrU9Bgk/61D7FROLOZkXmrd+1wKBgQCzEN6lF9PHsE46WGw7npQJaPOKSS58wSL8QribBj5sfdclRbeWt7jwrCbaIIAhIfOGvgGC1f5t9k9933caPY5Nm9lvfzNGUrC77nDBqQNSNj/wSAdR/+fUenvl0HKg5oBZRGqecvenV26wYGaiUy1IrrfbBZCW9CgT4Y1vmj4akQKBgGUzuXnBrvk5mj8IQsE3yjn/MWa4oAI3Gnmxr+YbTFSwAxJQiB69o0YqnrOYwvkrMQ/HvQELwoivLvwzO+UjUz5VA3MPD9iglsTlObXKDs4HPzpsuHFaxyZJBWLE0LY8if85KvlmbqswA/ITIR71HOlwp8FMWsf/bOV7cB57nOK0",
	}
}
