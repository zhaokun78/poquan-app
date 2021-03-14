<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">日记查看</block>
		</cu-custom>
		<diary-view :postId='id'></diary-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: null
			};
		},
		onLoad: function(option) {
			this.id = option.id;
		},
		methods: {}
	}
</script>

<style>
</style>
