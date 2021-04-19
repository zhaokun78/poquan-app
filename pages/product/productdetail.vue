<template>
	<view class="cu-card dynamic">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">商品详情</block>
			<view slot="right" @tap="share">分享</view>
		</cu-custom>
		<view class="cu-item shadow">
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					<navigator class="cu-avatar round" :style="{ backgroundImage:'url(' + avatar + ')' }"
						:url="'/pages/diary/diaryindex?userId=' + product.createBy">
					</navigator>
					<view class="content flex-sub">
						<navigator :url="'/pages/diary/diaryindex?userId=' + product.createBy">
							{{product.createBy}}
						</navigator>						
						<view class="text-gray text-sm">
							{{product.createTime}}
						</view>
					</view>
				</view>
			</view>
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
		</view>
		<view class="malldetail-buy">
			<text class="malldetail-now-buy" @click="pay">立即购买</text>
		</view>
	</view>
</template>

<script>
	import api from '@/api/api'
	import util from '@/common/util/util'
	import htmlParser from '@/common/html-parser'

	export default {
		components: {
			//goodAction,
		},
		data() {
			return {
				product: {},
				avatar: undefined,
			};
		},
		onLoad: async function(option) {
			let ret = await this.$http.get('/showme/showmeProduct/queryById?id=' + option.id);
			console.log(ret)
			if (ret.data.success) {
				this.product = ret.data.result
				this.product.cover = this.$config.staticDomainURL + '/' + this.product.cover;
				this.product.content = htmlParser(util.formatRichTextImgWidth(this.product.content));

				//加载作者头像
				ret = await this.$http.get('/sys/user/queryByUsername', {
					params: {
						username: this.product.createBy
					}
				});
				if (ret.data.success) {
					let perArr = ret.data.result
					let avatar = (perArr.avatar && perArr.avatar.length > 0) ?
						api.getFileAccessHttpUrl(perArr.avatar) : '/static/avatar_boy.png'
					this.avatar = avatar;
				}
			}
		},
		methods: {
			async pay() {
				//创建订单
				let res = await this.$http.post('/showme/showmeOrder/add', {
					product: this.product.id
				})

				let orderId = undefined;
				if (res.data.success) {
					orderId = res.data.result;
				} else {
					uni.showModal({
						title: '提示',
						content: '创建订单失败！',
						showCancel: false,
						success: r => {
							return;
						},
					})
				}

				if (orderId === undefined) {
					return;
				}
				res = await uniCloud.callFunction({
					name: 'pay',
					data: {
						provider: 'alipay',
						outTradeNo: orderId
					}
				});

				uni.showModal({
					title: 'cloud function return',
					content: JSON.stringify(res),
					showCancel: false,
					success: r => {
						if (r.confirm) {
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
					},
				});
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
