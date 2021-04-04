let BASE_URL = ''


if (process.env.NODE_ENV == 'development') {
    BASE_URL = 'http://localhost:8080/jeecg-boot' // 开发环境
} else {
	BASE_URL = 'http://localhost:8080/jeecg-boot' // 生产环境
}
let staticDomainURL = BASE_URL+ '/sys/common/static';

const configService = {
	apiUrl: BASE_URL,
	staticDomainURL: staticDomainURL,
	webUrl:'http://localhost:3000'
};

export default configService