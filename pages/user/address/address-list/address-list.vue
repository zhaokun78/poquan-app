<template>
	<view class="content">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">地址列表</block>
		</cu-custom>
		<view class="address-list" v-for="(item, index) in addressList" :key="item.id">
			<view class="address-list-info" @click="editAddress(item.id)">
				<view class="address-list-line1">
					<text v-if="item.isDefault==1" class="tag">默认</text>
					<text class="address-list-name">{{item.name}}</text>
					<text class="address-list-mobile">{{item.phone}}</text>
				</view>
				<view class="address-list-line2">
					<text class="address-list-detail">
						{{item.province}}{{item.city}}{{item.district}}{{item.address}}
					</text>
				</view>
			</view>
		</view>

		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: []
			}
		},
		async onLoad(option) {
			let ret = await this.$http.get('/showme/showmeAddress/list?createBy=' +
				this.$store.getters.username +
				'&pageNo=1&pageSize=10')
			if (ret.data.success) {
				this.addressList = ret.data.result.records;
			}
		},
		methods: {
			addAddress() {
				uni.navigateTo({
					url: '../address-edit/address-edit'
				})
			},
			editAddress(id) {
				uni.navigateTo({
					url: '../address-edit/address-edit?id=' + id
				})
			}
		}
	}
</script>

<style lang='scss'>
	.content {
		position: relative;
	}

	.address-list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		;
		background: #fff;
		position: relative;
	}

	.address-list-info {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-list-line1 {
		display: flex;
		align-items: center;

		.tag {
			font-size: 24upx;
			color: $theme-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid $theme-color;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address-list-name,
		.address-list-mobile {
			font-size: 30upx;
			color: black;
			margin-right: 30upx;
		}
	}

	.address-list-line2 {
		font-size: 28upx;
		color: gray;
		margin-top: 16upx;

		.address-list-detail {
			margin-right: 30upx;
		}
	}

	.add-btn {
		position: fixed;
		bottom: 16upx;
		z-index: 95;
		margin: 0 30upx;
		width: 690upx;
		height: 80upx;
		line-height: 80upx;
		font-size: 32upx;
		text-align: center;
		color: #fff;
		background-color: $theme-color;
		border-radius: 10upx;
	}
</style>
