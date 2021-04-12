<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">编辑个人经历经验</block>
		</cu-custom>
		<form>
			<view class="cu-form-group">
				<input placeholder="标题" name="input" v-model="myFormData.pyGerenjingliBiaoti"></input>
			</view>
			<uni-collapse accordion="true">
				<uni-collapse-item title="封面">
					<rich-text-editor v-if="myFormData.pyGerenjingliFengmian!=''" id="pyGerenjingliFengmian"
						:content.sync="myFormData.pyGerenjingliFengmian"></rich-text-editor>
				</uni-collapse-item>
			</uni-collapse>
			<uni-collapse accordion="true">
				<uni-collapse-item title="内容">
					<rich-text-editor v-if="myFormData.pyGerenjingli!=''" id="pyGerenjingli"
						:content.sync="myFormData.pyGerenjingli"></rich-text-editor>
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
				myFormData: {
					id: '',
					pyGerenjingliBiaoti: '',
					pyGerenjingliFengmian: '',
					pyGerenjingli: '',
				},
			};
		},
		onLoad: function(option) {
			this.$http.get('/showme/showmeUserext/queryByUserName?username=' + this.$store.getters.username).then(
				res => {
					if (res.data.success) {
						let result = res.data.result;
						this.myFormData.id = result.id;
						this.myFormData.pyGerenjingliBiaoti = result.pyGerenjingliBiaoti;
						this.myFormData.pyGerenjingliFengmian = result.pyGerenjingliFengmian;
						this.myFormData.pyGerenjingli = result.pyGerenjingli;
					}
				});
		},
		methods: {
			onSubmit() {
				if (!this.myFormData.pyGerenjingliBiaoti || this.myFormData.pyGerenjingliBiaoti.trim().length == 0) {
					this.$tip.alert('请输入标题！');
					return false
				}
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
