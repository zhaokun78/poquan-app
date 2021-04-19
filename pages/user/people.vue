<template>
	<view>
		<scroll-view scroll-y class="page">
			<!-- 头部logo-->
			<view class="UCenter-bg">
				<view class="cu-avatar xl round margin-left" :style="{ backgroundImage:'url(' + avatar + ')' }">
				</view>
				<view class="text-xl animation-slide-left" :style="[{animationDelay: '0.2s'}]">
					{{realname}}
				</view>
				<image src="/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
			</view>
			<view class="padding flex text-center text-grey bg-white shadow-warp">
				<view class="flex flex-sub flex-direction solid-right">
					<view class="text-xl text-orange">{{myPraise}}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-appreciate text-blue"></text>我点赞的
					</view>
				</view>
				<view class="flex flex-sub flex-direction solid-right">
					<view class="text-xl text-orange">{{myCollect}}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-favor text-blue"></text>我收藏的
					</view>
				</view>
				<view class="flex flex-sub flex-direction">
					<view class="text-xl text-orange">{{myFollow}}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-friendfamous text-blue"></text>我关注的
					</view>
				</view>
			</view>
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
				<view class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="cuIcon-explore text-green"></text>
						<text class="text-grey">精准推广说明</text>
					</view>
				</view>
				<navigator url="/pages/user/promo_code" class="cu-item arrow animation-slide-bottom"
					:style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="cuIcon-qrcode text-black"></text>
						<text class="text-grey">我的推广码</text>
					</view>
				</navigator>
				<navigator url="/pages/order/order" class="cu-item arrow animation-slide-bottom"
					:style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="cuIcon-goods text-cyan"></text>
						<text class="text-grey">订单管理</text>
					</view>
				</navigator>
				<navigator url="/pages/user/userdetail" class="cu-item arrow animation-slide-bottom"
					:style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="cuIcon-peoplelist text-yellow"></text>
						<text class="text-grey">个人资料</text>
					</view>
				</navigator>
				<view class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.3s'}]">
					<view class="content">
						<text class="cuIcon-rank text-brown"></text>
						<text class="text-grey">推广数据</text>
					</view>
				</view>
				<view class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.5s'}]">
					<view class="content">
						<text class="cuIcon-group text-blue"></text>
						<text class="text-grey">圈层关系</text>
					</view>
				</view>
				<view class="cu-item arrow animation-slide-bottom" :style="[{animationDelay: '0.7s'}]">
					<navigator class="content" url="/pages/user/userexit" hover-class="none">
						<text class="cuIcon-exit text-black"></text>
						<text class="text-grey">退出</text>
					</navigator>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
	import api from '@/api/api'
	export default {
		name: "people",
		data() {
			return {
				avatar: '', //头像
				username: '', //用户名
				realname: '', //昵称
				userUrl: '/sys/user/queryById', //查询用户URL
				myPraise: 0, //我的点赞数
				myCollect: 0, //我的收藏数
				myFollow: 0, //我的关注数
			};
		},
		beforeCreate() {
			let that = this;

			//我点赞的
			this.$http.get('/showme/showmePost/countPostPraiseByCreateBy')
				.then(res => {
					if (res.data.success) {
						that.myPraise = res.data.result;
					}
				});

			//我收藏的
			this.$http.get('/showme/showmePost/countPostCollectByCreateBy')
				.then(res => {
					if (res.data.success) {
						that.myCollect = res.data.result;
					}
				});

			//我关注的
			this.$http.get('/showme/showmeFollow/countByCreateBy')
				.then(res => {
					if (res.data.success) {
						that.myFollow = res.data.result;
					}
				});
		},
		watch: {
			cur: {
				immediate: true,
				handler() {
					console.log('watch', this.cur)
					this.load()
				},
			},
		},
		methods: {
			remove() {
				uni.removeStorageSync('Access-Token');
				uni.navigateTo({
					url: '/pages/common/exit'
				});
			},
			load() {
				this.$http.get(this.userUrl, {
					params: {
						id: this.$store.getters.userid
					}
				}).then(res => {
					if (res.data.success) {
						let perArr = res.data.result
						let avatar = (perArr.avatar && perArr.avatar.length > 0) ? api.getFileAccessHttpUrl(perArr
								.avatar) :
							'/static/avatar_boy.png'
						this.avatar = avatar
						this.realname = perArr.realname
						this.username = perArr.username
						this.post = perArr.post
						this.depart = perArr.departIds
					}
				}).catch(err => {
					console.log(err);
				});

			}
		}
	}
</script>

<style>
	.UCenter-bg {
		background-image: url(https://image.weilanwl.com/color2.0/index.jpg);
		background-size: cover;
		height: 400rpx;
		display: flex;
		justify-content: center;
		padding-top: 40rpx;
		overflow: hidden;
		position: relative;
		flex-direction: column;
		align-items: center;
		color: #fff;
		font-weight: 300;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.UCenter-bg text {
		opacity: 0.8;
	}

	.UCenter-bg image {
		width: 200rpx;
		height: 200rpx;
	}

	.UCenter-bg .gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		width: 750rpx;
		height: 300rpx;
	}
</style>
