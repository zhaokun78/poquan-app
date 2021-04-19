<template name="home">
	<view>
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
			<view class="cu-capsule round">
				<view class="cu-tag bg-blue ">
					<text class="cuIcon-likefill"></text>
				</view>
				<view class="cu-tag line-blue">
					{{this.$store.getters.promotionSpotBalance}}
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation scroll-left="0">
			<view :class="curSecondLevelTab==0? 'cu-item text-green cur':'cu-item'" data-id="0"
				@click="secondLevelTabSelect">
				需求圈
			</view>
			<view :class="curSecondLevelTab==1? 'cu-item text-green cur':'cu-item'" data-id="1"
				@click="secondLevelTabSelect">
				供应圈
			</view>
			<view :class="curSecondLevelTab==2? 'cu-item text-green cur':'cu-item'" data-id="2"
				@click="secondLevelTabSelect">
				动态圈
			</view>
			<view :class="curSecondLevelTab==3? 'cu-item text-green cur':'cu-item'" data-id="3"
				@click="secondLevelTabSelect">
				商圈
			</view>
			<view :class="curSecondLevelTab==4? 'cu-item text-green cur':'cu-item'" data-id="4"
				@click="secondLevelTabSelect">
				直播圈
			</view>
		</scroll-view>
		<view class="cu-card dynamic">
			<block v-if="curSecondLevelTab==0">
				<view class="cu-item shadow solid-top" v-for="(item, index) in posts" :key="item.id">
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round"
								style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"
								@click="gotoPage('/pages/diary/diaryindex?userId=' + item.createBy)">
							</view>
							<view class="content flex-sub">
								<view @click="gotoPage('/pages/diary/diaryindex?userId=' + item.createBy)">
									{{item.createBy}}
								</view>
								<view class="text-gray text-sm flex justify-between">
									{{item.createTime}}
								</view>
							</view>
						</view>
					</view>
					<view class="text-content" @click="gotoPage('/pages/diary/diaryview?id=' + item.id)">
						{{item.title}}
					</view>
					<view class="text-gray text-sm text-right padding">
						<text class="cuIcon-attentionfill margin-lr-xs"></text> 10
						<text class="cuIcon-appreciatefill margin-lr-xs"></text> 20
						<text class="cuIcon-messagefill margin-lr-xs"></text> 30
					</view>
				</view>
			</block>
			<block v-if="curSecondLevelTab==1">
				<view class="cu-item shadow solid-top" v-for="(item, index) in supplies" :key="item.id">
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round"
								style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"
								@click="gotoPage('/pages/diary/diaryindex?userId=' + item.createBy)">
							</view>
							<view class="content flex-sub">
								<view @click="gotoPage('/pages/diary/diaryindex?userId=' + item.createBy)">
									{{item.createBy}}
								</view>
								<view class="text-gray text-sm flex justify-between">
									{{item.createTime}}
								</view>
							</view>
						</view>
					</view>
					<view class="text-content" @click="gotoPage('/pages/diary/supply/supplydetail?id=' + item.id)">
						{{item.title}}
					</view>
					<view class="text-gray text-sm text-right padding">
						<text class="cuIcon-attentionfill margin-lr-xs"></text> 10
						<text class="cuIcon-appreciatefill margin-lr-xs"></text> 20
						<text class="cuIcon-messagefill margin-lr-xs"></text> 30
					</view>
				</view>
			</block>
			<view class="cu-bar btn-group">
			</view>
		</view>
	</view>
</template>

<script>
	function loadData(that) {
		let url;
		if (that.curSecondLevelTab == 0) {
			url = '/showme/showmePost/list';
		} else if (that.curSecondLevelTab == 1) {
			url = '/showme/showmeSupply/list';
		}

		url = url + '?pageNo=' + that.pageNo + '&pageSize=' + that.pageSize + '&column=createTime&order=desc';
		that.$http.get(url).then(ret => {
			if (ret.data.success) {
				that.pages = ret.data.result.pages;

				if (that.curSecondLevelTab == 0) {
					that.posts = ret.data.result.records;
				} else if (that.curSecondLevelTab == 1) {
					that.supplies = ret.data.result.records;
				}
			}
		})
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
				curSecondLevelTab: 0, //当前二级导航
				pages: 0, //分页总页数
				pageNo: 1, //分页当前页数
				pageSize: 50, //分页每页条数
				websock: '',
				heartCheck: null,
				lockReconnect: false,
				msgCount: 0,
				supplies: [], //供应列表
				posts: [] //日记列表
			}
		},
		beforeCreate: function(e) {
			console.log('home-beforeCreate')
			this.curSecondLevelTab = 0;
			this.pageNo = 1;
			this.pageSize = 50;
			this.supplies = [];
			loadData(this);
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
			gotoPage(url) {
				console.log('gotoPage:' + url)
				uni.navigateTo({
					url: url
				})
			},
			secondLevelTabSelect(e) {
				this.curSecondLevelTab = e.currentTarget.dataset.id;
				this.pageNo = 1;
				loadData(this);
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
</style>
