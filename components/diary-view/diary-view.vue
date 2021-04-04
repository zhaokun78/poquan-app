<template>
	<view class="cu-card dynamic">
		<view class="cu-item shadow">
			<view class="text-black text-bold text-left text-sl">{{post.title}}</view>
			<view class="text-gray text-left text-sm">{{post.industryCategory}}</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					<view class="cu-avatar round lg"
						style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);">
					</view>
					<view class="content flex-sub">
						<view class="text-gray text-sm flex justify-between">
							{{post.createBy}}
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
			<!-- 个人经历 -->
			<view class="solids-bottom padding-xs flex">
				<view class="flex-sub">
					<view class="solid-bottom text-lg padding">
						<view class="text-black text-bold text-center">1、个人经历</view>
					</view>
					<view class="article-content">
						<rich-text :nodes="pyGerenjingli"></rich-text>
					</view>
				</view>
			</view>
			<!-- 个人经验 -->
			<view class="solids-bottom padding-xs flex">
				<view class="flex-sub">
					<view class="solid-bottom text-lg padding">
						<view class="text-black text-bold text-center">2、个人经验</view>
					</view>
					<view class="article-content">
						<rich-text :nodes="pyGerenjingyan"></rich-text>
					</view>
				</view>
			</view>
			<!-- 日记段落内容 -->
			<view class="solids-bottom padding-xs flex" v-for="(item,index) in postParagraphs" :key="item.id">
				<view class="flex-sub">
					<view class="solid-bottom text-lg padding">
						<view class="text-black text-bold text-center">{{index+3}}、{{item.paragraphId_dictText}}</view>
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
	async function queryPostPraise(that) {
		let res = await that.$http.get('/showme/showmePost/countShowmePostPraiseByMainId?postId=' + that.id);
		if (res.data.success) {
			that.praiseCount = res.data.result.praiseCount;
			that.curUserPraised = res.data.result.curUserPraised
		}
	}

	//查询日记收藏数
	async function queryPostCollect(that) {
		let res = await that.$http.get('/showme/showmePost/countShowmePostCollectByMainId?postId=' + that.id);
		if (res.data.success) {
			that.collectCount = res.data.result.collectCount;
			that.curUserCollected = res.data.result.curUserCollected;
		}
	}

	//查询评论列表
	async function loadComments(that) {
		let res = await that.$http.get('/showme/showmePost/listShowmeCommentByPostId?postId=' + that.id +
			'&column=createTime&order=desc');
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
	}

	import util from '@/common/util/util'
	import htmlParser from '@/common/html-parser'
	export default {
		name: "diary-view",
		data() {
			return {
				id: undefined, //日记 Id
				paragraphs: [], //日记段落配置
				post: {}, //日记
				pyGerenjingli: '', //个人经历
				pyGerenjingyan: '', //个人经验
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
		props: ['postId'],
		watch: {
			postId(n, o) { //n为新值,o为旧值;
				console.log(n, o);
				this.id = n;
				this.reloadPost();
			}
		},
		beforeCreate: function() {
			//console.log('beforeCreate')
		},
		created: async function() {
			//console.log('created')
		},
		beforeMount: function() {
			//console.log('beforeMount')
		},
		mounted: function() {
			//console.log('mounted')
			this.id = this.postId
			this.reloadPost()
		},
		beforeUpdate: function() {
			//console.log('beforeUpdate')
		},
		updated: function() {
			//console.log('updated')
		},
		methods: {
			/**
			 * 重新加载日记
			 */
			async reloadPost() {
				let that = this
				that.paragraphs = [];
				that.post = {};
				that.postParagraphs = [];
				that.htmlNodes = [];
				that.hadFollow = false;
				that.commentList = [];
				that.praiseCount = 0;
				that.curUserPraised = false;
				that.collectCount = 0;
				that.curUserCollected = false;

				//1、查询段落配置
				let res = await that.$http.get('/showme/showmeParagraph/list?pageNo=1&pageSize=50');
				//console.log(res)
				if (res.data.success) {
					that.paragraphs = res.data.result.records;

					//2、查询日记
					res = await that.$http.get('/showme/showmePost/queryById?id=' + that.id);
					//console.log(res)
					if (res.data.success) {
						that.post = res.data.result;

						//查询个人经历和个人经验
						res = await this.$http.get('/showme/showmeUserext/queryByUserName?username=' + that.post
							.createBy)
						if (res.data.success) {
							that.pyGerenjingli = htmlParser(util.formatRichTextImgWidth(res.data.result
								.pyGerenjingli));
							that.pyGerenjingyan = htmlParser(util.formatRichTextImgWidth(res.data.result
								.pyGerenjingyan));
						}

						//3、查询日记段落
						res = await that.$http.get('/showme/showmePost/listShowmePostParagraphByMainId?postId=' + that
							.id);
						//console.log(res)
						if (res.data.success) {
							//4、根据生效的段落配置筛选日记段落	
							for (let i = 0; i < that.paragraphs.length; i++) {
								if (that.paragraphs[i].enable == 1) {
									let p = res.data.result.records.find((r) => r.paragraphId == that.paragraphs[i].id)
									if (p != undefined) {
										that.postParagraphs.push(p);
										that.htmlNodes.push(htmlParser(util.formatRichTextImgWidth(p.content)))
									}
								}
							}
						}
					}
				}

				//查询是否关注作者
				this.hadFollow = await util.queryHadFollowSomeOne(this.$http, this.post.createBy);

				//查询评论列表
				loadComments(this);

				//查询日记点赞数
				queryPostPraise(this);

				//查询日记收藏数
				queryPostCollect(this);
			},

			/**
			 * 发表评论
			 */
			async sendComment(e) {
				let ret = await this.$http.post('/showme/showmePost/addShowmeComment', {
					postId: this.id,
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
					queryHadFollowSomeOne(this);
				}
			},

			/**
			 * 点击点赞/取消点赞按钮
			 */
			async clickPraise() {
				let ret = await this.$http.put('/showme/showmePost/praiseOrCancel?postId=' + this.id);
				if (ret.data.success) {
					queryPostPraise(this);
				}
			},

			/**
			 * 点击收藏/取消收藏按钮
			 */
			async clickCollect() {
				let ret = await this.$http.put('/showme/showmePost/collectOrCancel?postId=' + this.id);
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
