<template>
	<view class="cu-card dynamic">
		<view class="cu-item shadow">
			<view class="text-black text-bold text-left text-xl">{{post.title}}</view>
			<view class="text-gray text-left text-sm">{{post.industryCategory}}</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					<view class="cu-avatar round" :style="{ backgroundImage:'url(' + post.avatar + ')' }"
						@click="gotoPage('/pages/diary/diaryindex?userId=' + post.createBy)">
					</view>
					<view class="content flex-sub">
						<view class="text-gray text-sm flex justify-between">
							<view @click="gotoPage('/pages/diary/diaryindex?userId=' + post.createBy)">
								{{post.createBy}}
							</view>
							<view class="text-gray text-sm">
								<button class="cu-btn round sm bg-white"><text class="cuIcon-share"></text>分享</button>
								<template v-if="hadFollow">
									<button class="cu-btn round bg-grey" @click="clickFollow"><text
											class="cuIcon-check"></text>已关注</button>
								</template>
								<template v-else>
									<button class="cu-btn round bg-green" @click="clickFollow"><text
											class="cuIcon-add"></text>关注</button>
								</template>
							</view>
						</view>
						<view class="text-gray text-sm">
							{{post.createTime}}
						</view>
					</view>
				</view>
			</view>
			<!-- 日记段落内容 -->
			<view class="solids-bottom padding-xs flex" v-for="(item,index) in postParagraphs" :key="item.id">
				<view class="flex-sub">
					<view class="solid-bottom text-lg padding">
						<view class="text-black text-bold text-center">{{item.paragraphName}}</view>
					</view>
					<view class="article-content">
						<rich-text :nodes="htmlNodes[index]"></rich-text>
					</view>
				</view>
			</view>
			<!--
				评论组件
				@param: commentList展示的评论列表数据
				@method: clickPraise 点赞评论
				@method: clickDelete 删除评论
			-->
			<five-commentlist :commentList="commentList" @clickPraise="clickPraiseSig" @clickDelete="clickDeleteSig">
			</five-commentlist>
			<view class="text-gray text-sm text-right padding">
				<view class="cu-bar bg-white search">
					<view class="search-form round">
						<text class="cuIcon-comment"></text>
						<input type="text" confirm-type="send" @confirm="sendComment"></input>
					</view>
					<text class="cuIcon-messagefill margin-lr-xs"></text> {{commentList.length}}
					<text class="cuIcon-appreciatefill margin-lr-xs" :class="curUserPraised?'text-red':''"
						@click="clickPraise"></text>
					{{praiseCount}}
					<text class="cuIcon-favorfill margin-lr-xs" :class="curUserCollected?'text-red':''"
						@click="clickCollect"></text>
					{{collectCount}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//查询日记点赞数
	function queryPostPraise(that) {
		that.$http.get('/showme/showmePost/countShowmePostPraiseByMainId?postId=' + that.post.id).then(res => {
			if (res.data.success) {
				that.praiseCount = res.data.result.praiseCount;
				that.curUserPraised = res.data.result.curUserPraised
			}
		});
	}

	//查询日记收藏数
	function queryPostCollect(that) {
		that.$http.get('/showme/showmePost/countShowmePostCollectByMainId?postId=' + that.post.id).then(res => {
			if (res.data.success) {
				that.collectCount = res.data.result.collectCount;
				that.curUserCollected = res.data.result.curUserCollected;
			}
		})
	}

	//查询评论列表
	function loadComments(that) {
		that.$http.get('/showme/showmePost/listShowmeCommentByPostId?postId=' + that.post.id +
			'&column=createTime&order=desc').then(res => {
			if (res.data.success) {
				that.commentList = [];
				for (let i = 0; i < res.data.result.length; i++) {
					that.commentList.push({
						"COMMENT_TIME": res.data.result[i].createTime,
						"FIRSTNICKNAME": res.data.result[i].createBy,
						"IS_PRAISE": res.data.result[i].myPraiseCount > 0 ? true : false,
						"TAG": res.data.result[i].createBy == that.post.createBy ? '作者' : '',
						"COMMENT": res.data.result[i].content,
						"PRAISE_NUM": res.data.result[i].praiseCount,
						"CANDELETE": 1,
						"HEADIMGURL": "http://pic1.zhimg.com/50/v2-e88c0426c1ccc429dbedea3d01e5fac2_hd.jpg",
						"PARENTID": res.data.result[i].id,
						"SECONDNICKNAME": null
					})
				}
			}
		})
	}

	import api from '@/api/api'
	import util from '@/common/util/util'
	import htmlParser from '@/common/html-parser'
	export default {
		name: "diary-view",
		data() {
			return {
				paragraphs: [], //日记段落配置
				postParagraphs: [], //需求日记段落内容,
				htmlNodes: [], //日记段落内容 html 节点数组
				hadFollow: false, //是否关注作者
				commentList: [], //评论列表
				praiseCount: 0, //日记点赞数量
				curUserPraised: false, //当前登录用户是否点赞
				collectCount: 0, //日记收藏数量
				curUserCollected: false, //当前登录用户是否收藏
			};
		},
		props: ['post'], //日记对象，由外界传入
		watch: {
			post(n, o) { //n为新值,o为旧值;
				console.log(n, o);
				this.post = n;
				this.reloadPost();
			}
		},
		beforeCreate: function() {
			//console.log('beforeCreate')
		},
		created: function() {
			//console.log('created')
		},
		beforeMount: function() {
			//console.log('beforeMount')
		},
		mounted: function() {
			this.reloadPost()
		},
		beforeUpdate: function() {
			//console.log('beforeUpdate')
		},
		updated: function() {
			//console.log('updated')
		},
		methods: {
			gotoPage(url) {
				console.log('gotoPage:' + url)
				uni.navigateTo({
					url: url
				})
			},
			/**
			 * 重新加载日记
			 */
			async reloadPost() {
				let that = this
				that.paragraphs = [];
				that.postParagraphs = [];
				that.htmlNodes = [];
				that.hadFollow = false;
				that.commentList = [];
				that.praiseCount = 0;
				that.curUserPraised = false;
				that.collectCount = 0;
				that.curUserCollected = false;

				//加载日记作者头像
				that.$http.get('/sys/user/queryByUsername', {
					params: {
						username: that.post.createBy
					}
				}).then(res => {
					if (res.data.success) {
						let perArr = res.data.result
						let avatar = (perArr.avatar && perArr.avatar.length > 0) ?
							api.getFileAccessHttpUrl(perArr.avatar) : '/static/avatar_boy.png'
						that.post.avatar = avatar
					}
				});

				//1、查询段落配置
				let res = await that.$http.get('/showme/showmeParagraph/list?pageNo=1&pageSize=50');
				if (res.data.success) {
					that.paragraphs = res.data.result.records;

					//2、查询日记段落
					that.$http.get('/showme/showmePost/listShowmePostParagraphByMainId?postId=' + that.post.id).then(
						res => {
							if (res.data.success) {
								//4、根据生效的段落配置筛选日记段落	
								for (let i = 0; i < that.paragraphs.length; i++) {
									if (that.paragraphs[i].enable == 1) {
										let p = res.data.result.records.find((r) => r.paragraphId == that
											.paragraphs[i].id)
										if (p != undefined) {
											p.paragraphName = that.paragraphs[i].name;
											that.postParagraphs.push(p);
											that.htmlNodes.push(htmlParser(util.formatRichTextImgWidth(p
												.content)))
										}
									}
								}
							}
						})

					//查询评论列表
					loadComments(this);

					//查询日记点赞数
					queryPostPraise(this);

					//查询日记收藏数
					queryPostCollect(this);

					//查询是否关注作者
					this.hadFollow = await util.queryHadFollowSomeOne(this.$http, this.post.createBy);
				}
			},

			/**
			 * 发表评论
			 */
			async sendComment(e) {
				let ret = await this.$http.post('/showme/showmePost/addShowmeComment', {
					postId: this.post.id,
					content: e.detail.value
				})
				uni.hideKeyboard();
				if (ret.data.success) {
					loadComments(this);
				}
			},

			/**
			 * 点击关注/取消关注按钮
			 */
			async clickFollow() {
				let ret = await this.$http.put('/showme/showmeFollow/attentionOrCancel?userId=' + this.post.createBy);
				if (ret.data.success) {
					this.hadFollow = await util.queryHadFollowSomeOne(this.$http, this.post.createBy);
				}
			},

			/**
			 * 点击点赞/取消点赞按钮
			 */
			async clickPraise() {
				let ret = await this.$http.put('/showme/showmePost/praiseOrCancel?postId=' + this.post.id);
				if (ret.data.success) {
					queryPostPraise(this);
				}
			},

			/**
			 * 点击收藏/取消收藏按钮
			 */
			async clickCollect() {
				let ret = await this.$http.put('/showme/showmePost/collectOrCancel?postId=' + this.post.id);
				if (ret.data.success) {
					queryPostCollect(this);
				}
			},

			/**
			 * 评论：点赞or取消点赞
			 */
			async clickPraiseSig(e) {
				let ret = await this.$http.put('/showme/showmeCommentPraise/praiseOrCancel?commentId=' + e.PARENTID);
				if (ret.data.success) {
					loadComments(this);
				}
			},

			/**
			 * 删除评论
			 */
			clickDeleteSig(e) {
				let that = this
				uni.showModal({
					title: '确认',
					content: '真的要删除评论吗？',
					showCancel: true,
					success: async function(res) {
						if (res.confirm) {
							let ret = await that.$http.delete('/showme/showmePost/deleteShowmeComment?id=' + e
								.PARENTID);
							if (ret.data.success) {
								loadComments(that);
							}
						}
					}
				});
			},
		}
	}
</script>

<style>
	.article-content {
		padding: 0 30rpx;
		overflow: hidden;
		font-size: 30rpx;
		margin-bottom: 30rpx;
	}
</style>
