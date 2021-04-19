<template name="diary">
	<view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>{{userId}} 的个人主页
			</view>
		</view>
		<view class="bg-white text-left text-sm">这里是放个人简介的地方</view>
		<view class="padding flex text-center text-grey bg-white shadow-warp">
			<view class="flex flex-sub flex-direction solid-right">
				<view class="text-xl text-orange">{{praised}}</view>
				<view class="margin-top-sm">
					<text class="cuIcon-appreciatefill"></text> 获赞
				</view>
			</view>
			<view class="flex flex-sub flex-direction solid-right">
				<view class="text-xl text-blue">{{collected}}</view>
				<view class="margin-top-sm">
					<text class="cuIcon-favorfill"></text> 被收藏
				</view>
			</view>
			<view class="flex flex-sub flex-direction">
				<view class="text-xl text-green">{{fans}}</view>
				<view class="margin-top-sm">
					<text class="cuIcon-friendfill"></text> 粉丝
				</view>
			</view>
		</view>
		<block v-if="isMe">
			<view class="cu-bar btn-group">
				<button class="cu-btn bg-blue shadow-blur round" @click="newSupply">
					<text class="cuIcon-service"></text>
					发布供应
				</button>
				<button class="cu-btn bg-gradual-green shadow-blur round" @click="newDiary">
					<text class="cuIcon-write"></text>
					发布需求
				</button>
			</view>
			<view class="cu-bar btn-group">
				<button class="cu-btn bg-cyan shadow-blur round" @click="newDaily">
					<text class="cuIcon-activity"></text>
					发布日常
				</button>
				<button class="cu-btn bg-gradual-purple shadow-blur round" @click="newProduct">
					<text class="cuIcon-goods"></text>
					发布商品
				</button>
			</view>
		</block>
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation scroll-left="0">
			<view :class="curTab==0? 'cu-item text-green cur':'cu-item'" data-id="0" @click="tabSelect">
				<text v-if="isMe">我的供应</text>
				<text v-else>TA 的供应</text>
			</view>
			<view :class="curTab==1? 'cu-item text-green cur':'cu-item'" data-id="1" @click="tabSelect">
				<text v-if="isMe">我的需求</text>
				<text v-else>TA 的需求</text>
			</view>
			<view :class="curTab==3? 'cu-item text-green cur':'cu-item'" data-id="3" @click="tabSelect">
				<text v-if="isMe">我的商品</text>
				<text v-else>TA 的商品</text>
			</view>
			<view :class="curTab==2? 'cu-item text-green cur':'cu-item'" data-id="2" @click="tabSelect">
				<text v-if="isMe">我的日常</text>
				<text v-else>TA 的日常</text>
			</view>
		</scroll-view>		
		<view class="cu-list menu sm-border">
			<block v-if="curTab==0">
				<navigator v-for="(item, index) in supplies" :key="item.id" class="cu-item arrow"
					:url="'/pages/diary/supply/supplydetail?id=' + item.id">
					<view class="content">
						<text class="cuIcon-circlefill text-grey">
						</text>
						<text class="text-grey">
							{{item.title}}
						</text>
						<view class="content flex-sub">
							<view class="text-gray text-sm flex justify-between">
								{{item.createTime}}
							</view>
						</view>
					</view>
				</navigator>
			</block>
			<block v-if="curTab==1">
				<navigator v-for="(item, index) in posts" :key="item.id" class="cu-item arrow"
					:url="'/pages/diary/diaryview?id=' + item.id">
					<view class="content">
						<text class="cuIcon-circlefill text-grey">
						</text>
						<text class="text-grey">
							{{item.title}}
						</text>
						<view class="content flex-sub">
							<view class="text-gray text-sm flex justify-between">
								{{item.createTime}}
							</view>
						</view>
					</view>
				</navigator>
			</block>
			<block v-if="curTab==3">
				<navigator v-for="(item, index) in products" :key="item.id" class="cu-item arrow"
					:url="'/pages/product/productdetail?id=' + item.id">
					<view class="content">
						<text class="cuIcon-circlefill text-grey">
						</text>
						<text class="text-grey">
							{{item.name}}
						</text>
						<view class="content flex-sub">
							<view class="text-gray text-sm flex justify-between">
								{{item.createTime}}
							</view>
						</view>
					</view>
				</navigator>
			</block>
			<block v-if="curTab==2">
				<navigator v-for="(item, index) in dailies" :key="item.id" class="cu-item arrow"
					:url="'/pages/diary/daily/dailydetail?id=' + item.id">
					<view class="content">
						<text class="cuIcon-circlefill text-grey">
						</text>
						<text class="text-grey">
							{{item.title}}
						</text>
						<view class="content flex-sub">
							<view class="text-gray text-sm flex justify-between">
								{{item.createTime}}
							</view>
						</view>
					</view>
				</navigator>
			</block>
		</view>
		<view class="cu-bar btn-group">
		</view>
	</view>
</template>

<script>
	/**
	 * 加载本人的各种数据
	 * @param {Object} that
	 */
	function loadData(that) {
		let url;
		if (that.curTab == 0) {
			url = '/showme/showmeSupply/list';
			if (that.pageNo == 1) {
				that.supplies = [];
			}
		} else if (that.curTab == 1) {
			url = '/showme/showmePost/list';
			if (that.pageNo == 1) {
				that.posts = [];
			}
		} else if (that.curTab == 2) {
			url = '/showme/showmeDaily/list';
			if (that.pageNo == 1) {
				that.dailies = [];
			}
		} else if (that.curTab == 3) {
			url = '/showme/showmeProduct/list';
			if (that.pageNo == 1) {
				that.products = [];
			}
		}

		that.$http.get(url, {
			params: {
				createBy: that.userId,
				pageNo: that.pageNo,
				pageSize: 50,
				column: 'createTime',
				order: 'desc'
			}
		}).then(res => {
			if (res.data.success && res.data.result.total > 0) {
				if (that.pageNo > res.data.result.pages) {
					uni.showModal({
						title: '询问',
						content: '加载完毕，是否重新加载？',
						success: function(res) {
							if (res.confirm) {
								that.pageNo = 1;

								if (that.curTab == 0) {
									that.supplies = [];
									that.loadData(that);
								} else if (that.curTab == 1) {
									that.posts = [];
									that.loadData(that);
								} else if (that.curTab == 2) {
									that.dailies = [];
									that.loadData(that);
								} else if (that.curTab == 3) {
									that.products = [];
									that.loadData(that);
								}
							}
						}
					});
				} else {
					that.pageNo++;

					if (that.curTab == 0) {
						that.supplies = that.supplies.concat(res.data.result.records)
					} else if (that.curTab == 1) {
						that.posts = that.posts.concat(res.data.result.records)
					} else if (that.curTab == 2) {
						that.dailies = that.dailies.concat(res.data.result.records)
					} else if (that.curTab == 3) {
						that.products = that.products.concat(res.data.result.records)
					}
				}
			}
		});
	}

	export default {
		props: ['userId'],
		watch: {
			userId(n, o) { //n为新值,o为旧值;
				console.log(n, o);
			}
		},
		data() {
			return {
				curTab: 0, //当前选中标签
				pageNo: 1, //当前分页（只要切换标签就从第一页开始）
				supplies: [], //供应
				posts: [], //需求日记
				dailies: [], //日常
				products: [], //商品
				praised: 0, //获赞数
				collected: 0, //被收藏数				
				fans: 0, //粉丝数
				isMe: false, //表示 userId 属性是否是当前登录用户本人
			}
		},
		mounted() {
			this.curTab = 0;
			this.pageNo = 1;
			loadData(this);

			//标识传递进来的 userId 属性是否是当前登录用户本人
			this.isMe = this.userId == this.$store.getters.username ? true : false;

			//获赞
			this.$http.get('/showme/showmePost/countPostPraiseByPostCreateBy?postCreateBy=' + this.userId).then(
				res => {
					if (res.data.success) {
						this.praised = res.data.result;
					}
				});

			//被收藏
			this.$http.get('/showme/showmePost/countPostCollectByByPostCreateBy?postCreateBy=' + this.userId).then(res => {
				if (res.data.success) {
					this.collected = res.data.result;
				}
			});

			//粉丝
			this.$http.get('/showme/showmeFollow/countByUserId?userId=' + this.userId).then(res => {
				if (res.data.success) {
					this.fans = res.data.result;
				}
			});
		},
		methods: {
			tabSelect(e) {
				this.curTab = e.currentTarget.dataset.id;
				this.pageNo = 1;
				loadData(this);
			},

			/**
			 * 发布供应
			 */
			newSupply() {
				uni.navigateTo({
					url: '/pages/diary/supply/supplyedit'
				});
			},

			/**
			 * 发布日记
			 */
			newDiary() {
				uni.navigateTo({
					url: '/pages/diary/diaryedit'
				});
			},

			/**
			 * 发布日常
			 */
			newDaily() {
				uni.navigateTo({
					url: '/pages/diary/daily/dailyedit'
				});
			},

			/**
			 * 发布商品
			 */
			newProduct() {
				uni.navigateTo({
					url: '/pages/product/productedit'
				});
			},
		}
	}
</script>

<style>
	.UCenter-bg {
		background-image: url(https://image.weilanwl.com/color2.0/index.jpg);
		background-size: cover;
		height: 350rpx;
		display: flex;
		justify-content: center;
		padding-top: 40rpx;
		overflow: hidden;
		position: relative;
		flex-direction: column;
		align-items: center;
		color: #fff;
		font-weight: 300;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.UCenter-bg text {
		opacity: 0.8;
	}

	.UCenter-bg image {
		width: 200rpx;
		height: 200rpx;
	}

	.UCenter-bg .gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		width: 750rpx;
		height: 300rpx;
	}
</style>
