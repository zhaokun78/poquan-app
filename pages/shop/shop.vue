<template>
	<view>
		<list-mall :num='2' :list='products'></list-mall>
		<view class="cu-tabbar-height"></view>
	</view>
</template>

<script>
	import listMall from '@/components/index/list-mall.vue'
	//import mockData from '@/data/index.js'

	export default {
		components: {
			listMall
		},
		data() {
			return {
				products: []
			}
		},
		beforeCreate: function() {
			console.log('beforeCreate')
		},
		created: async function() {
			console.log('created')
			let ret = await this.$http.get('/showme/showmeProduct/list');
			console.log(ret)
			if (ret.data.success) {
				for (let i = 0; i < ret.data.result.records.length; i++) {
					this.products.push({
						id: ret.data.result.records[i].id,
						uri: this.$config.staticDomainURL + '/' + ret.data.result.records[i].cover,
						title: ret.data.result.records[i].name.length < 20 ? ret.data.result.records[i].name :
							ret.data.result.records[i].name.substring(0, 20) + '...',
						specialprice: '￥' + ret.data.result.records[i].price
					})
				}
			}
			//this.listmall = mockData.listmall1;
		},
		beforeMount: function() {
			console.log('beforeMount')
		},
		mounted: function() {
			console.log('mounted')
		},
		beforeUpdate: function() {
			console.log('beforeUpdate')
		},
		updated: function() {
			console.log('updated')
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 400upx;

		.swiper-image {
			height: 400upx;
			width: 690upx;
			margin: 0 30upx;
			border-radius: 15upx;
		}
	}
</style>
