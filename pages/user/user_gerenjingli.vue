<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">编辑我的经历</block>
		</cu-custom>
		<form>
			<uni-collapse>
				<uni-collapse-item title="封面" open>
					<rich-text-editor v-if="myFormData.pyGerenjingliFengmian!=''" id="pyGerenjingliFengmian"
						:content.sync="myFormData.pyGerenjingliFengmian" :placeholder="coverTip">
					</rich-text-editor>
				</uni-collapse-item>
				<uni-collapse-item title="内容" open>
					<rich-text-editor v-if="myFormData.pyGerenjingli!=''" id="pyGerenjingli"
						:content.sync="myFormData.pyGerenjingli" :placeholder="contentTip"></rich-text-editor>
				</uni-collapse-item>
			</uni-collapse>

			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue lg" @click="onSubmit">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				coverTip: '',
				contentTip: '',
				myFormData: {
					id: '',
					pyGerenjingliFengmian: '',
					pyGerenjingli: '',
				},
			};
		},
		onLoad: function(option) {
			this.$http.get('/showme/showmeParameter/list?name=我的经历封面提示').then(res => {
				if (res.data.success && res.data.result.records.length > 0) {
					this.coverTip = res.data.result.records[0].value;
				}
			})

			this.$http.get('/showme/showmeParameter/list?name=我的经历内容提示').then(res => {
				if (res.data.success && res.data.result.records.length > 0) {
					this.contentTip = res.data.result.records[0].value;
				}
			})

			this.$http.get('/showme/showmeUserext/queryByUserName?username=' + this.$store.getters.username).then(
				res => {
					if (res.data.success) {
						let result = res.data.result;
						this.myFormData.id = result.id;
						this.myFormData.pyGerenjingliFengmian = result.pyGerenjingliFengmian;
						this.myFormData.pyGerenjingli = result.pyGerenjingli;
					}
				});
		},
		methods: {
			onSubmit() {
				if (!this.myFormData.pyGerenjingliFengmian || this.myFormData.pyGerenjingliFengmian.trim().length == 0) {
					this.$tip.alert('请输入封面！');
					return false
				}
				if (!this.myFormData.pyGerenjingli || this.myFormData.pyGerenjingli.trim().length == 0) {
					this.$tip.alert('请输入内容！');
					return false
				}
				this.$tip.loading();
				this.$http.put('/showme/showmeUserext/edit', this.myFormData).then(res => {
					console.log(res)
					this.$tip.loaded();
					if (res.data.success) {
						this.$tip.toast('提交成功')
						uni.navigateBack({
							delta: 1
						})
					}
				}).catch(() => {
					this.$tip.loaded();
					this.$tip.error('提交失败')
				});
			}
		}
	}
</script>

<style>
</style>
