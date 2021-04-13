<template name="home">
	<view>
		<!--
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="搜索你感兴趣的内容" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur round">搜索</button>
			</view>
		</view>
		-->
		<scroll-view scroll-x class="bg-white nav text-center">
			<view class="cu-item">
				位置
			</view>
			<view class="cu-item">
				关注
			</view>
			<view class="cu-item text-green cur">
				推荐
			</view>
			<!--
			<view class="cu-item">
				行业
			</view>
			-->
			<view class="cu-capsule round">
				<view class="cu-tag bg-blue ">
					<text class="cuIcon-likefill"></text>
				</view>
				<view class="cu-tag line-blue">
					{{this.$store.getters.promotionSpotBalance}}
				</view>
			</view>
		</scroll-view>

		<swiper :current="1" :circular="true" @change="swiperChange" style="height:5000px;">
			<swiper-item>
				<diary-view v-if="post_0!=undefined" :post='post_0'></diary-view>
			</swiper-item>
			<swiper-item>
				<diary-view v-if="post_1!=undefined" :post='post_1'></diary-view>
			</swiper-item>
			<swiper-item>
				<diary-view v-if="post_2!=undefined" :post='post_2'></diary-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	/**
	 * 加载推荐文章
	 */
	async function loadRecommendPost(that) {
		let ret = await that.$http.get('/showme/showmePost/list?pageNo=' + that.pageNo + '&pageSize=' + that.pageSize);
		if (ret.data.success) {
			return ret.data.result;
		}
	}

	export default {
		name: 'home',
		props: {
			cur: String,
		},
		watch: {
			cur: {
				immediate: true,
				handler() {
					console.log('watch', this.cur)
					this.initMenu()
				},
			},
		},
		data() {
			return {
				pages: 0, //日记分页总页数（目前每页加载一条，因此总页数也就相当于总条数）
				pageNo: 1, //日记分页当前页数
				pageSize: 1, //日记分页每页条数
				currentSwiperIndex: 1, //当前所在滑块的 index
				websock: '',
				heartCheck: null,
				lockReconnect: false,
				msgCount: 0,
				post_0: undefined,
				post_1: undefined,
				post_2: undefined,
			}
		},
		beforeCreate: async function(e) {
			console.log('home-beforeCreate')
			this.pageNo = 1;
			this.pageSize = 1;
			let res = await loadRecommendPost(this);
			this.pages = res.pages;
			this.post_1 = res.records[0];
		},
		created: function() {
			console.log('home-created')
		},
		beforeMount: function() {
			console.log('home-beforeMount')
		},
		mounted: function() {
			console.log('home-mounted')
		},
		beforeUpdate: function() {
			console.log('home-beforeUpdate')
		},
		updated: function() {
			console.log('home-updated')
		},
		methods: {
			swiperChange: function(e) {
				if (this.currentSwiperIndex === 1 && e.detail.current === 2) {
					console.log('右滑', this.currentSwiperIndex, '--->', e.detail.current)
					this.turnRight(e.detail.current);
				} else if (this.currentSwiperIndex === 2 && e.detail.current === 0) {
					console.log('右滑', this.currentSwiperIndex, '--->', e.detail.current)
					this.turnRight(e.detail.current);
				} else if (this.currentSwiperIndex === 0 && e.detail.current === 1) {
					console.log('右滑', this.currentSwiperIndex, '--->', e.detail.current)
					this.turnRight(e.detail.current);
				} else if (this.currentSwiperIndex === 1 && e.detail.current === 0) {
					console.log('左滑', this.currentSwiperIndex, '--->', e.detail.current)
				} else if (this.currentSwiperIndex === 0 && e.detail.current === 2) {
					console.log('左滑', this.currentSwiperIndex, '--->', e.detail.current)
				} else if (this.currentSwiperIndex === 2 && e.detail.current === 1) {
					console.log('左滑', this.currentSwiperIndex, '--->', e.detail.current)
				}
				this.currentSwiperIndex = e.detail.current;
			},
			//左滑处理
			turnLeft() {

			},
			//右滑处理
			async turnRight(current) {
				if (this.pageNo == this.pages) {
					this.pageNo = 1;
				} else {
					this.pageNo++;
				}
				let res = await loadRecommendPost(this);
				if (current == 0) {
					this.post_0 = res.records[0];
				} else if (current == 1) {
					this.post_1 = res.records[0];
				} else if (current == 2) {
					this.post_2 = res.records[0];
				}
			},
			initMenu() {
				console.log("-----------home------------")
				this.initWebSocket();
				this.loadCount(0);
			},
			initWebSocket: function() {
				// WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
				var userId = this.$store.getters.userid;
				var url = this.$config.apiUrl.replace("https://", "wss://").replace("http://", "ws://") +
					"/websocket/" + userId;
				console.log('websocket url>>' + url);
				this.websock = new WebSocket(url);
				this.websock.onopen = this.websocketOnopen;
				this.websock.onerror = this.websocketOnerror;
				this.websock.onmessage = this.websocketOnmessage;
				this.websock.onclose = this.websocketOnclose;
			},
			websocketOnopen: function() {
				console.log("WebSocket连接成功");
				//心跳检测重置
				//this.heartCheck.reset().start();
			},
			websocketOnerror: function() {
				console.log("WebSocket连接发生错误");
				this.reconnect();
			},
			websocketOnmessage: function(e) {
				console.log("-----接收消息-------", e.data);
				var data = eval("(" + e.data + ")"); //解析对象
				if (data.cmd == "topic") {
					//系统通知
					this.loadCount('1')
				} else if (data.cmd == "user") {
					//用户消息
					this.loadCount('2')
				}

				//心跳检测重置
				//this.heartCheck.reset().start();
			},
			websocketOnclose: function(e) {
				console.log("connection closed (" + e.code + ")");
				this.reconnect();
			},
			websocketSend(text) { // 数据发送
				try {
					this.websock.send(text);
				} catch (err) {
					console.log("send failed (" + err.code + ")");
				}
			},
			reconnect() {
				var that = this;
				if (that.lockReconnect) return;
				that.lockReconnect = true;
				//没连接上会一直重连，设置延迟避免请求过多
				setTimeout(function() {
					console.info("尝试重连...");
					that.initWebSocket();
					that.lockReconnect = false;
				}, 5000);
			},
			loadCount(flag) {
				console.log("loadCount::flag", flag)
				let url = '/sys/annountCement/listByUser';
				this.$http.get(url).then(res => {
					console.log("res::", res)
					if (res.data.success) {
						let msg1Count = res.data.result.anntMsgTotal;
						let msg2Count = res.data.result.sysMsgTotal;
						this.msgCount = msg1Count + msg2Count
						console.log("this.msgCount", this.msgCount)
					}
				})
			}
		}
	}
</script>

<style>
	.scroll-Y {
		height: 300rpx;
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.scroll-view-item {
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}

	.scroll-view-item_H {
		display: inline-block;
		width: 100%;
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}

	.line2-icon {
		width: 60px;
		height: 60px;
	}

	page {
		padding-top: 100rpx;
	}

	.indexes {
		position: relative;
	}

	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20rpx 20rpx 20rpx 60rpx;
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 40rpx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
		border-radius: 10rpx;
	}

	.indexBar-item {
		flex: 1;
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #888;
	}

	movable-view.indexBar-item {
		width: 40rpx;
		height: 40rpx;
		z-index: 9;
		position: relative;
	}

	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10rpx;
		height: 20rpx;
		width: 4rpx;
		background-color: #f37b1d;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80rpx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
		margin: auto;
		color: #fff;
		line-height: 100rpx;
		text-align: center;
		font-size: 48rpx;
	}
</style>
