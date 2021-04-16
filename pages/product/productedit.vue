<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">发布商品</view>
			<view v-if="!isBusy" slot="right" @tap="save">发布</view>
		</cu-custom>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">名称</view>
				<input v-model="name" placeholder="输入商品名称">
			</view>
			<view class="cu-form-group">
				<view class="title">价格</view>
				<input v-model="price" placeholder="输入商品价格">
			</view>
			<view class="cu-form-group">
				<view class="title">封面图片</view>
				<view class="grid col-4 grid-square flex-sub">
					<view v-if="cover!=''" class="bg-img" @tap="ViewImage">
						<image :src="imgList[0]" mode="aspectFill"></image>
						<view class="cu-tag bg-red radius" @tap.stop="DelImg">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view v-if="cover==''" class="solids" @tap="ChooseImage">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<uni-collapse>
				<uni-collapse-item title="商品描述" open>
					<rich-text-editor id="content" :content.sync="content" :placeholder="tip"></rich-text-editor>
				</uni-collapse-item>
			</uni-collapse>
		</form>
	</view>
</template>

<script>
	//发布商品
	//经纬度可为空
	async function newProduct(that, longitude, latitude) {
		let ret = await that.$http.post('/showme/showmeProduct/add', {
			name: that.name,
			price: that.price,
			cover: that.cover,
			content: that.content,
			state: 0,
			longitude: longitude,
			latitude: latitude
		})

		if (ret.data.success) {
			uni.hideLoading();
			uni.showModal({
				title: '成功',
				content: '发布商品成功！',
				showCancel: false,
				success: function(res) {
					if (res.confirm) {
						that.isBusy = false;
						uni.navigateBack({
							delta: 1
						});
					}
				}
			});
		} else {
			that.isBusy = false;
			uni.hideLoading();
			that.$tip.error('发布商品失败：' + ret.data.message);
		}
	}

	export default {
		data() {
			return {
				name: '', //商品名称
				price: '', //商品价格
				cover: '', //商品封面图片
				imgList: [],
				content: undefined, //商品描述
				isBusy: false, //为 true 代表正在发送请求
				tip: '', //从后台系统配置中获取到的输入提示
			}
		},
		methods: {
			async save() {
				//检测必填项
				if (this.name.trim() == '') {
					this.$tip.error('请填写商品名称！');
					return;
				}

				if (this.price.trim() == '') {
					this.$tip.error('请填写商品价格！');
					return;
				}

				if (this.cover.trim() == '') {
					this.$tip.error('请上传商品封面图片！');
					return;
				}

				if (this.content == undefined) {
					this.$tip.error('请填写商品描述！')
					return;
				}

				this.isBusy = true;
				uni.showLoading({
					title: '处理中...'
				})

				let that = this

				//获取位置
				uni.getLocation({
					type: 'gcj02',
					success: async function(res) {
						newProduct(that, res.longitude, res.latitude);
					},
					fail: function(e) {
						newProduct(that);
					}
				});
			},
			ChooseImage() {
				var that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: (res) => {
						that.$http.upload(that.$config.apiUrl + '/sys/common/upload', {
								filePath: res.tempFilePaths[0],
								name: 'file'
							})
							.then(r => {
								that.cover = r.data.message;
							})
							.catch(err => {
								that.$tip.error(err.data.message)
							});
						that.imgList = res.tempFilePaths
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList
				});
			},
			DelImg(e) {
				let that = this
				uni.showModal({
					title: '确认',
					content: '确定要删除封面图片吗？',
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							that.cover = ''
						}
					}
				})
			}
		},
		onLoad() {
			this.$http.get('/showme/showmeParameter/list?name=商品描述提示').then(res => {
				if (res.data.success && res.data.result.records.length > 0) {
					this.tip = res.data.result.records[0].value;
				}
			})
		},
	}
</script>

<style>
</style>
