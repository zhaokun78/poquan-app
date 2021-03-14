<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">编辑个人经历</block>
		</cu-custom>
		<form>
			<view class="cu-form-group">
				<textarea maxlength="-1" auto-height=true v-model="myFormData.pyGerenjingli"></textarea>
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
					pyGerenjingli: ''
				},
			};
		},
		onLoad: function(option) {
			this.$http.get('/showme/showmeUserext/queryByUserName?username=' + this.$store.getters.username).then(res => {
				console.log("res::", res)
				if (res.data.success) {
					let result = res.data.result;
					this.myFormData.id = result.id;
					this.myFormData.pyGerenjingli = result.pyGerenjingli;
				}
			});
		},
		methods: {
			onEditorReady() {
				// #ifdef MP-BAIDU
				this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editorId');
				// #endif

				// #ifdef APP-PLUS || H5 ||MP-WEIXIN
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
				// #endif
			},
			undo() {
				this.editorCtx.undo()
			},
			onSubmit() {
				if (!this.myFormData.pyGerenjingli || this.myFormData.pyGerenjingli.length == 0) {
					this.$tip.alert('请输入个人经历');
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
</style>
