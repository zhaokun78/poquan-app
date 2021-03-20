<template>
	<view>
		<web-view :src="webUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webUrl: this.$config.webUrl + '/user/alteration'
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
