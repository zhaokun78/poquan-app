<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">发表日记</view>
			<view v-if="!isBusy" slot="right" @tap="save">发表</view>
		</cu-custom>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">标题</view>
				<input v-model="title" placeholder="输入日记标题">
			</view>
			<view class="cu-form-group">
				<view class="title">分类</view>
				<picker v-if="diaryCategoryList.length>0" @change="PickerChange" :range="diaryCategoryList"
					range-key="name" :value="diaryCategoryIndex">
					<view class="picker">
						{{diaryCategoryList[diaryCategoryIndex].name}}
					</view>
				</picker>
			</view>
			<uni-collapse accordion="true">
				<uni-collapse-item v-for="(item, index) in postParagraph" :key="item.id" :title="item.name">
					<rich-text-editor :id="item.id" :content.sync="item.content"></rich-text-editor>
				</uni-collapse-item>
			</uni-collapse>
		</form>
	</view>
</template>

<script>
	//发表新日记
	//经纬度可为空
	async function newDiary(that, longitude, latitude) {
		//新增日记
		let ret = await that.$http.post('/showme/showmePost/add', {
			title: that.title,
			industryCategory: that.diaryCategoryList[that.diaryCategoryIndex].name,
			state: 0,
			longitude: longitude,
			latitude: latitude
		})

		if (ret.data.success) {
			//新增日记段落
			for (let i = 0; i < that.postParagraph.length; i++) {
				let r = await that.$http.post(
					'/showme/showmePost/addShowmePostParagraph', {
						postId: ret.data.result,
						paragraphId: that.postParagraph[i].id,
						content: that.postParagraph[i].content
					})
				if (!r.data.success) {
					that.isBusy = false;
					uni.hideLoading();
					that.$tip.error('发表日记失败：' + r.data.message);
					return;
				}
			}

			uni.hideLoading();
			uni.showModal({
				title: '成功',
				content: '发表日记成功！',
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
			that.$tip.error('发表日记失败：' + ret.data.message);
		}
	}

	export default {
		data() {
			return {
				title: '', //日记标题
				diaryCategoryList: [], //日记分类数组
				diaryCategoryIndex: 0, //当前选择的日记分类索引
				postParagraph: [], //日记段落内容 HTML
				isBusy: false //为 true 代表正在发送请求
			}
		},
		methods: {
			async save() {
				//检测必填项
				if (this.title.trim() == '') {
					this.$tip.error('请填写标题！');
					return;
				}

				for (let i = 0; i < this.postParagraph.length; i++) {
					if (this.postParagraph[i].content == undefined) {
						this.$tip.error('请填写' + this.postParagraph[i].name + '！')
						return;
					}
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
						newDiary(that, res.longitude, res.latitude);
					},
					fail: function(e) {
						newDiary(that);
					}
				});
			},
			PickerChange(e) {
				this.diaryCategoryIndex = e.detail.value;
			}
		},
		async onLoad() {
			let res = await this.$http.get('/showme/showmeParagraph/list?pageNo=1&pageSize=50');
			if (res.data.success) {
				this.postParagraph = res.data.result.records;
			}
			res = await this.$http.get('/showme/showmeDiaryCategory/list?pageNo=1&pageSize=50');
			if (res.data.success) {
				this.diaryCategoryList = res.data.result.records;
			}
		},
	}
</script>

<style>
</style>
