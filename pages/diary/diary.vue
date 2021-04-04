<template name="diary">
	<view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>我的日记
			</view>
		</view>
		<scroll-view scroll-y class="scrollPage">
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
			<view class="cu-bar btn-group">
				<button class="cu-btn bg-blue shadow-blur round" @click="newDiary">
					<text class="cuIcon-write"></text>
					发表日记
				</button>
				<button class="cu-btn bg-gradual-purple shadow-blur round" @click="newProduct">
					<text class="cuIcon-goods"></text>
					发布商品
				</button>
			</view>
			<view class="cu-list menu sm-border">
				<navigator v-for="(item, index) in posts" :key="item.id" class="cu-item arrow"
					:url="'/pages/diary/diaryview?id='+item.id">
					<view class="content">
						<text class="cuIcon-circlefill text-grey"></text>
						<text
							class="text-grey">{{item.title.length>10 ?item.title.substring(0,10)+'...':item.title}}&nbsp;&nbsp;{{item.createTime}}</text>
					</view>
				</navigator>
			</view>
			<view class="cu-bar btn-group">
				<button class="cu-btn bg-green shadow-blur" @click="loadMore">
					<text class="cuIcon-more"></text>
					加载更多
				</button>
			</view>
			<view class="cu-bar btn-group">
			</view>
		</scroll-view>
	</view>
</template>

<script>
	function loadPost(that) {
		that.$http.get('/showme/showmePost/list', {
			params: {
				createBy: that.$store.getters.username,
				pageNo: that.pageNo,
				pageSize: 5,
				column: 'createTime',
				order: 'desc'
			}
		}).then(res => {
			if (res.data.success) {
				if (that.pageNo > res.data.result.pages) {
					uni.showModal({
						title: '询问',
						content: '到头了，是否重新加载？',
						success: function(res) {
							if (res.confirm) {
								that.pageNo = 1;
								that.posts = [];
								loadPost(that);
							}
						}
					});
				} else {
					that.pageNo++;
					that.posts = that.posts.concat(res.data.result.records)
				}
			}
		});
	}

	export default {
		data() {
			return {
				pageNo: 1,
				posts: [],
				praised: 0, //获赞数
				collected: 0, //被收藏数
				fans: 0 //粉丝数
			}
		},
		beforeCreate() {
			loadPost(this);

			//获赞
			this.$http.get('/showme/showmePost/countPostPraiseByPostCreateBy?postCreateBy=' +
				this.$store.getters.username).then(res => {
				if (res.data.success) {
					this.praised = res.data.result;
				}
			});

			this.$http.get('/showme/showmePost/countPostCollectByByPostCreateBy?postCreateBy=' +
				this.$store.getters.username).then(res => {
				if (res.data.success) {
					this.collected = res.data.result;
				}
			});

			this.$http.get('/showme/showmeFollow/countByUserId?userId=' +
				this.$store.getters.username).then(res => {
				if (res.data.success) {
					this.fans = res.data.result;
				}
			});
		},
		methods: {
			/**
			 * 发表新日记
			 */
			newDiary() {
				uni.navigateTo({
					url: '/pages/diary/diaryedit'
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

			/**
			 * 加载更多日记
			 */
			loadMore: function() {
				loadPost(this);
			}
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
