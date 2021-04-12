<template>
	<view>
		<scroll-view scroll-y class="page">
			<cu-custom bgColor="bg-gradual-pink" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">订单管理</block>
			</cu-custom>

			<view class="cu-list menu">
				<navigator url="/pages/order/order_list?type=sell" class="cu-item arrow animation-slide-bottom"
					:style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="text-grey">我是卖家</text>
					</view>
				</navigator>
				<navigator url="/pages/order/order_list?type=buy" class="cu-item arrow animation-slide-bottom"
					:style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="text-grey">我是买家</text>
					</view>
				</navigator>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad() {},
		methods: {}
	}
</script>

<style>
</style>
