<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">
				<text v-if="type==='sell'">卖家订单列表</text>
				<text v-else>买家订单列表</text>
			</block>
		</cu-custom>
		<uni-segmented-control :current="current" :values="tabArray" @clickItem="tabClick" styleType="text"
			activeColor='#d81e06'></uni-segmented-control>
		<view class="content">
			<block v-if="type==='sell'">
				<view v-show="current === 0">
					<order-not-delivery :list='notDeliveryList'></order-not-delivery>
				</view>
				<view v-show="current === 1">
					<order-not-receive :list='notReceiveList'></order-not-receive>
				</view>
				<view v-show="current === 2">
					<order-done :list='tradeDoneList'></order-done>
				</view>
			</block>
			<block v-if="type==='buy'">
				<view v-show="current === 0">
					<order-not-pay :list='notPayList'></order-not-pay>
				</view>
				<view v-show="current === 1">
					<order-not-delivery :list='notDeliveryList'></order-not-delivery>
				</view>
				<view v-show="current === 2">
					<order-not-receive :list='notReceiveList'></order-not-receive>
				</view>
				<view v-show="current === 3">
					<order-done :list='tradeDoneList'></order-done>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from '@/components/order/uni-segmented-control.vue'
	import orderNotPay from '@/components/order/order-not-pay.vue'
	import orderNotDelivery from '@/components/order/order-not-delivery.vue'
	import orderNotReceive from '@/components/order/order-not-receive.vue'
	import orderDone from '@/components/order/order-done.vue'
	import mockData from '@/data/order.js'

	export default {
		components: {
			uniSegmentedControl,
			orderNotPay,
			orderNotDelivery,
			orderNotReceive,
			orderDone
		},
		data() {
			return {
				type: undefined, //卖家订单 or 买家订单
				current: 0,
				tabArray: [],
				notPayList: [],
				notDeliveryList: [],
				notReceiveList: [],
				tradeDoneList: []
			};
		},
		methods: {
			tabClick(index) {
				if (this.current != index) {
					this.current = index;
					this.loadOrder();
				}
			},
			loadOrder() {
				let order_status;
				if (this.type === 'sell') {
					//待发货
					if (this.current === 0) {
						order_status = 'waitDelivery';
					}
					//待收货
					else if (this.current === 1) {
						order_status = 'waitAccept';
					}
					//已完成
					else if (this.current === 2) {
						order_status = 'completed';
					}

					this.$http.get('/showme/showmeOrder/getSellerOrders?order_status=' + order_status)
						.then(res => {
							if (res.data.success) {
								for (let i = 0; i < res.data.result.length; i++) {
									//标记为卖家订单
									res.data.result[i].who = 'seller';
									//商品封面图片链接处理
									res.data.result[i].productCover =
										this.$config.staticDomainURL + '/' + res.data.result[i].productCover;
								}

								//待发货
								if (this.current === 0) {
									this.notDeliveryList = res.data.result;
								}
								//待收货
								else if (this.current === 1) {
									this.notReceiveList = res.data.result;
								}
								//已完成
								else if (this.current === 2) {
									this.tradeDoneList = res.data.result;
								}
							}
						});
				} else if (this.type === 'buy') {
					//待付款
					if (this.current === 0) {
						order_status = 'waitPay';
					}
					//待发货
					else if (this.current === 1) {
						order_status = 'waitDelivery';
					}
					//待收货
					else if (this.current === 2) {
						order_status = 'waitAccept';
					}
					//已完成
					else if (this.current === 3) {
						order_status = 'completed';
					}

					this.$http.get('/showme/showmeOrder/getBuyerOrders?order_status=' + order_status)
						.then(res => {
							if (res.data.success) {
								for (let i = 0; i < res.data.result.length; i++) {
									//标记为买家订单
									res.data.result[i].who = 'buyer';
									//商品封面图片链接处理
									res.data.result[i].productCover =
										this.$config.staticDomainURL + '/' + res.data.result[i].productCover;
								}

								//待付款
								if (this.current === 0) {
									this.notPayList = res.data.result;
								}
								//待发货
								else if (this.current === 1) {
									this.notDeliveryList = res.data.result;
								}
								//待收货
								else if (this.current === 2) {
									this.notReceiveList = res.data.result;
								}
								//已完成
								else if (this.current === 3) {
									this.tradeDoneList = res.data.result;
								}
							}
						});
				}
			}
		},
		onLoad(options) {
			this.type = options.type;
			if (this.type === 'sell') {
				this.tabArray = ['待发货', '待收货', '已完成'];
			} else if (this.type === 'buy') {
				this.tabArray = ['待付款', '待发货', '待收货', '已完成'];
			}

			this.loadOrder();

			//this.notPayList = mockData.notPayList;
			//this.notDeliveryList = mockData.notDeliveryList;
			//this.notReceiveList = mockData.notReceiveList;
			//this.tradeDoneList = mockData.tradeDoneList;
		},

	}
</script>

<style lang="scss">

</style>
