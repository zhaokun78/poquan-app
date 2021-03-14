<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">发表日记</view>
			<view slot="right" @tap="save">发表</view>
		</cu-custom>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">标题</view>
				<input v-model="title" placeholder="输入日记标题">
			</view>
			<view class="cu-form-group">
				<view class="title">行业分类</view>
				<input v-model="industryCategory" placeholder="输入行业分类">
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
	export default {
		data() {
			return {
				title: '', //日记标题
				industryCategory: '', //行业分类
				postParagraph: [] //日记段落内容 HTML
			}
		},
		methods: {
			save() {
				//检测必填项
				if (this.title.trim() == '') {
					this.$tip.error('请填写标题！');
					return;
				}

				if (this.industryCategory.trim() == '') {
					this.$tip.error('请填写行业分类！');
					return;
				}

				for (let i = 0; i < this.postParagraph.length; i++) {
					if (this.postParagraph[i].content == undefined) {
						this.$tip.error('请填写' + this.postParagraph[i].name + '！')
						return;
					}
				}

				//获取位置
				let that = this
				uni.getLocation({
					type: 'gcj02',
					success: async function(res) {
						//新增日记
						let ret = await that.$http.post('/showme/showmePost/add', {
							title: that.title,
							type: 0,
							industryCategory: that.industryCategory,
							state: 0,
							longitude: res.longitude,
							latitude: res.latitude
						})

						if (ret.data.success) {
							//新增日记段落
							for (let i = 0; i < that.postParagraph.length; i++) {
								let r = await that.$http.post('/showme/showmePost/addShowmePostParagraph', {
									postId: ret.data.result,
									paragraphId: that.postParagraph[i].id,
									content: that.postParagraph[i].content
								})
								if (!r.data.success) {
									that.$tip.error('保存日记失败：' + r.data.message);
								}
							}
						}
					},
					fail: function(e) {
						that.$tip.error('获取位置失败！');
					}
				});
			}
		},
		async onLoad() {
			let res = await this.$http.get('/showme/showmeParagraph/list?pageNo=1&pageSize=50');
			if (res.data.success) {
				this.postParagraph = res.data.result.records;
			}
		},
	}
</script>

<style>
</style>
