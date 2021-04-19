<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">需求查看</block>
		</cu-custom>
		<diary-view v-if="post!=null" :post='post'></diary-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				post: null
			};
		},
		onLoad: function(option) {
			this.$http.get('/showme/showmePost/queryById?id=' + option.id).then(res => {
				if (res.data.success) {
					this.post = res.data.result;
				}
			})
		},
		methods: {}
	}
</script>

<style>
</style>
