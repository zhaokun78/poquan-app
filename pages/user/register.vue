<template>
	<view>
		<web-view :src="webUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webUrl: this.$config.webUrl + '/user/register'
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
