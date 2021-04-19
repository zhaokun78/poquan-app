<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">个人主页</view>
		</cu-custom>
		<diary v-if="userId" :userId='userId'></diary>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId: undefined //外界传递进来的用户Id
			}
		},
		onLoad(option) {
			this.userId = option.userId;
		},
		methods: {

		}
	}
</script>

<style>

</style>
