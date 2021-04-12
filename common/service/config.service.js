let BASE_URL = ''

if (process.env.NODE_ENV == 'development') {
	BASE_URL = 'https://api.poquanhulian.com/jeecg-boot' // 开发环境
} else {
	BASE_URL = 'https://api.poquanhulian.com/jeecg-boot' // 生产环境
}
let staticDomainURL = BASE_URL + '/sys/common/static';

const configService = {
	apiUrl: BASE_URL,
	staticDomainURL: staticDomainURL,
	//webUrl:'http://localhost:3000'
	webUrl: 'https://admin.poquanhulian.com'
};

export default configService
