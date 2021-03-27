<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">编辑个人经验</block>
		</cu-custom>
		<form>
			<view class="cu-form-group">
				<rich-text-editor v-if="myFormData.pyGerenjingyan!=''" id="pyGerenjingyan"
					:content.sync="myFormData.pyGerenjingyan"></rich-text-editor>
			</view>
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
					pyGerenjingyan: ''
				},
			};
		},
		onLoad: function(option) {
			this.$http.get('/showme/showmeUserext/queryByUserName?username=' + this.$store.getters.username).then(
				res => {
					console.log("res::", res)
					if (res.data.success) {
						let result = res.data.result;
						this.myFormData.id = result.id;
						this.myFormData.pyGerenjingyan = result.pyGerenjingyan;
					}
				});
		},
		methods: {
			onSubmit() {
				if (!this.myFormData.pyGerenjingyan || this.myFormData.pyGerenjingyan.length == 0) {
					this.$tip.alert('请输入个人经验');
					return false
				}
				this.$tip.loading();
				this.$http.put('/showme/showmeUserext/edit', this.myFormData).then(res => {
					console.log(res)
					this.$tip.loaded();
					if (res.data.success) {
						this.$tip.toast('提交成功')
						this.$Router.replace({
							name: 'userdetail'
						})
						/* uni.navigateTo({
							url: '/pages/user/userdetail'
						}) */
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
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
