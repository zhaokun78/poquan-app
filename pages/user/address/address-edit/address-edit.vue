<template>
	<view class="content">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">
				<text v-if="addressData.id">编辑地址</text>
				<text v-else>新增地址</text>
			</block>
		</cu-custom>
		<view class="address-item ">
			<text class="address-item-title">姓名</text>
			<input class="address-item-input" type="text" v-model="addressData.name" placeholder="收货人姓名" />
		</view>
		<view class="address-item ">
			<text class="address-item-title">电话</text>
			<input class="address-item-input" type="number" v-model="addressData.phone" placeholder="收货人手机号" />
		</view>
		<view class="address-item " @click="showCityPicker">
			<text class="address-item-title">地区</text>
			<text class="address-item-input">
				{{addressData.label}}
			</text>
		</view>
		<view class="address-item ">
			<text class="address-item-title">详细地址</text>
			<input class="address-item-input" type="text" v-model="addressData.address" placeholder="街道门牌、楼层房间号等信息" />
		</view>
		<view class="address-item ">
			<text class="address-item-title">邮政编码</text>
			<input class="address-item-input" type="text" v-model="addressData.zipcode" placeholder="邮政编码" />
		</view>

		<view class="address-item default-item">
			<text class="address-item-title">设为默认</text>
			<switch :checked="addressData.isDefault==1" color='#d81e06' @change="switchChange" />
		</view>
		<button class="address-add-btn" @click="confirm">保存</button>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
			@onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				addressData: {
					id: undefined,
					name: '',
					phone: '',
					label: '选择省/市/区',
					address: '',
					zipcode: '',
					isDefault: 0
				},
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#d81e06',
			}
		},
		async onLoad(option) {
			if (option.id) {
				let ret = await this.$http.get('/showme/showmeAddress/queryById?id=' + option.id);
				if (ret.data.success) {
					this.addressData.id = ret.data.result.id;
					this.addressData.name = ret.data.result.name;
					this.addressData.phone = ret.data.result.phone;
					this.addressData.province = ret.data.result.province;
					this.addressData.city = ret.data.result.city;
					this.addressData.district = ret.data.result.district;
					this.addressData.label =
						this.addressData.province + '-' +
						this.addressData.city + '-' +
						this.addressData.district;
					this.addressData.address = ret.data.result.address;
					this.addressData.zipcode = ret.data.result.zipcode;
					this.addressData.isDefault = ret.data.result.isDefault;
				}
			}			
		},
		methods: {
			switchChange(e) {
				this.addressData.isDefault = e.detail.value ? 1 : 0;
			},

			//提交
			async confirm() {
				let data = this.addressData;
				if (!data.name) {
					this.$tip.error('请填写收货人姓名');
					return;
				}
				if (!/(^1[0-9]{10}$)/.test(data.phone)) {
					this.$tip.error('请输入正确的手机号');
					return;
				}
				if (!data.label) {
					this.$tip.error('请选择地区信息');
					return;
				}
				if (!data.address) {
					this.$tip.error('请输入详细地址');
					return;
				}

				let area = data.label.split('-');
				//保存
				if (data.id) {
					let ret = await this.$http.put('/showme/showmeAddress/edit', {
						id: data.id,
						name: data.name,
						phone: data.phone,
						province: area[0],
						city: area[1],
						district: area[2],
						address: data.address,
						zipcode: data.zipcode,
						isDefault: data.isDefault
					});
					if (ret.data.success) {
						uni.showModal({
							title: '成功',
							content: '编辑地址成功！',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '../address-list/address-list'
									})
								}
							}
						});
					} else {
						this.$tip.error(ret.data.message);
					}
				}
				//新增
				else {
					let ret = await this.$http.post('/showme/showmeAddress/add', {
						name: data.name,
						phone: data.phone,
						province: area[0],
						city: area[1],
						district: area[2],
						address: data.address,
						zipcode: data.zipcode,
						isDefault: data.isDefault
					});
					if (ret.data.success) {
						uni.showModal({
							title: '成功',
							content: '新增地址成功！',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '../address-list/address-list'
									})
								}
							}
						});
					} else {
						this.$tip.error(ret.data.message);
					}
				}
			},
			// 三级联动选择
			showCityPicker() {
				this.$refs.mpvueCityPicker.show()
				console.log('showpicker')
			},
			onConfirm(e) {
				this.addressData.label = e.label
			},
			onCancel() {

			}
		},
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F8F8F8;
	}

	.address-item {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 100upx;
		background: #fff;
		border-bottom: 1upx solid #F8F8F8;

		.address-item-title {
			flex-shrink: 0;
			width: 200upx;
			font-size: 32upx;
			color: black;
		}

		.address-item-input {
			flex: 1;
			font-size: 32upx;
			color: black;
		}


	}

	.default-item {
		.address-item-title {
			flex: 1;
		}

		switch {
			transform: scale(.7);
		}
	}

	.address-add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: 32upx;
		color: #fff;
		background-color: $theme-color;
		border-radius: 10upx;
	}
</style>
