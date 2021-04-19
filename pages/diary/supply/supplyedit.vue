<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">发布供应</view>
			<view v-if="!isBusy" slot="right" @tap="save">发布</view>
		</cu-custom>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">标题</view>
				<input v-model="title" placeholder="输入供应标题">
			</view>
			<uni-collapse>
				<uni-collapse-item title="供应内容" open>
					<rich-text-editor id="supply" :content.sync="content" :placeholder="tip"></rich-text-editor>
				</uni-collapse-item>
			</uni-collapse>
		</form>
	</view>
</template>

<script>
	//发表新供应
	//经纬度可为空
	async function newSupply(that, longitude, latitude) {
		let ret = await that.$http.post('/showme/showmeSupply/add', {
			title: that.title,
			content: that.content,
			state: 0,
			longitude: longitude,
			latitude: latitude,
		})

		if (ret.data.success) {
			uni.hideLoading();
			uni.showModal({
				title: '成功',
				content: '发布供应成功！',
				showCancel: false,
				success: function(res) {
					if (res.confirm) {
						that.isBusy = false;
						uni.navigateBack({
							delta: 1
						})
					}
				}
			});
		} else {
			that.isBusy = false;
			uni.hideLoading();
			that.$tip.error('发布供应失败：' + ret.data.message);
		}
	}

	export default {
		data() {
			return {
				title: '', //供应标题
				content: undefined, //内容 HTML
				isBusy: false, //为 true 代表正在发送请求
				tip: '', //提示信息
			}
		},
		onLoad() {
			//加载提示
			this.$http.get('/showme/showmeParameter/list?name=供应内容提示').then(res => {
				if (res.data.success && res.data.result.records.length > 0) {
					this.tip = res.data.result.records[0].value;
				}
			})
		},
		methods: {
			async save() {
				//检测必填项
				if (this.title.trim() == '') {
					this.$tip.error('请填写标题！');
					return;
				}

				if (this.content == undefined) {
					this.$tip.error('请填写内容！')
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
						newSupply(that, res.longitude, res.latitude);
					},
					fail: function(e) {
						newSupply(that);
					}
				});
			},
		},
	}
</script>

<style>
</style>
