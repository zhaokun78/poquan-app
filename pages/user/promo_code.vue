<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的推广码</block>
			<view slot="right" @tap="share">分享</view>
		</cu-custom>
		<view style="margin: 40upx;">
			<ayQrcode ref="qrcode" :modal="modal_qr" :url="url" @hideQrcode="hideQrcode" :height="300" :width="300" />
		</view>
	</view>
</template>

<script>
	import ayQrcode from "@/components/ay-qrcode/ay-qrcode.vue"
	export default {
		components: {
			ayQrcode,
		},
		data() {
			return {
				//二维码相关参数
				modal_qr: false,
				url: 'http://192.168.68.119:3000/user/register?suggested_user=' + this.$store.getters.userid,
			}
		},
		onLoad() {
			let that = this;
			that.showQrcode(); //一加载生成二维码
		},
		methods: {
			// 展示二维码
			showQrcode() {
				let _this = this;
				this.modal_qr = true;
				// uni.showLoading()
				setTimeout(function() {
					// uni.hideLoading()
					_this.$refs.qrcode.crtQrCode()
				}, 50)
			},

			//传入组件的方法
			hideQrcode() {
				this.modal_qr = false;
			},

			//分享推广码
			share() {
				uni.shareWithSystem({
					type: 'image',
					imageUrl: this.url,
					success() {
						// 分享完成，请注意此时不一定是成功分享
					},
					fail() {
						// 分享失败
					}
				})
			}
		}
	}
</script>

<style>

</style>
