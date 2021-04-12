<template>
	<view class="cu-card dynamic">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">商品详情</block>
			<view slot="right" @tap="share">分享</view>
		</cu-custom>
		<view class="cu-item shadow">
			<image :src="product.cover" mode="aspectFit" style="width:100% !important;"></image>
			<text class="text-red text-left text-xxl">￥</text>
			<text class="text-red text-left text-sl">{{product.price}}</text>
			<view class="text-black text-bold text-left text-xl">{{product.name}}</view>
			<!-- 商品描述 -->
			<view class="solids-bottom padding-xs flex">
				<view class="flex-sub">
					<view class="solid-bottom text-lg padding">
						<view class="text-black text-bold text-center">商品描述</view>
					</view>
					<view class="article-content">
						<rich-text :nodes="product.content"></rich-text>
					</view>
				</view>
			</view>
			<!-- 使用心得 -->
			<view class="solids-bottom padding-xs flex">
				<view class="flex-sub">
					<view class="solid-bottom text-lg padding">
						<view class="text-black text-bold text-center">使用心得</view>
					</view>
					<view class="article-content">
						<rich-text :nodes="product.useIdeas"></rich-text>
					</view>
				</view>
			</view>
		</view>
		<view class="malldetail-buy">
			<text class="malldetail-now-buy" @click="pay">立即购买</text>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util/util'
	import htmlParser from '@/common/html-parser'
	//import goodAction from '@/components/goods/good-action.vue'
	export default {
		components: {
			//goodAction,
		},
		data() {
			return {
				product: {},
			};
		},
		onLoad: async function(option) {
			let ret = await this.$http.get('/showme/showmeProduct/queryById?id=' + option.id);
			console.log(ret)
			if (ret.data.success) {
				this.product = ret.data.result
				this.product.cover = this.$config.staticDomainURL + '/' + this.product.cover;
				this.product.content = htmlParser(util.formatRichTextImgWidth(this.product.content));
				this.product.useIdeas = htmlParser(util.formatRichTextImgWidth(this.product.useIdeas));
			}
		},
		methods: {
			async pay() {
				this.$tip.toast('开发中...');
				return;
				
				let res = await uniCloud.callFunction({
					name: 'pay',
					data: {
						provider: 'alipay',
						outTradeNo: '1378923740491640830'
					}
				});

				uni.showModal({
					title: 'cloud function',
					content: JSON.stringify(res),
					showCancel: false
				});

				if (res.result.orderInfo) {
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: res.result.orderInfo,
						success() {
							this.$tip.success('支付成功');
						},
						fail() {
							this.$tip.success('支付失败');
						}
					})
				}
			}
		}
	}
</script>

<style>
	.malldetail-buy {
		position: fixed;
		bottom: 0upx;
		left: 0upx;
		right: 0upx;
		border-color: #cccccc;
		background-color: #ffffff;
		border-top-width: 0.5upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.malldetail-shopcart-img {
		width: 50upx;
		height: 50upx;
		margin: 0upx 50upx 0upx 33upx;
	}

	.malldetail-star-img {
		width: 50upx;
		height: 50upx;
		margin: 0upx 33.3upx 0upx 0upx;
	}

	.malldetail-shopcart-add {
		padding: 25upx 56upx;
		background-color: #ffb700;
		font-size: 31.3upx;
		color: #ffffff;
	}

	.malldetail-now-buy {
		padding: 25upx 68upx;
		background-color: #ff7500;
		font-size: 31.3upx;
		color: #ffffff;
	}
</style>
