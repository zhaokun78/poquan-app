<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">供应查看</block>
		</cu-custom>
		<view class="cu-card dynamic">
			<view class="cu-item shadow">
				<view class="text-black text-bold text-left text-xl">{{supply.title}}</view>
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round" :style="{ backgroundImage:'url(' + avatar + ')' }"
							@click="gotoPage('/pages/diary/diaryindex?userId=' + supply.createBy)">
						</view>
						<view class="content flex-sub">
							<view class="text-gray text-sm flex justify-between">
								<view @click="gotoPage('/pages/diary/diaryindex?userId=' + supply.createBy)">
									{{supply.createBy}}
								</view>
								<view class="text-gray text-sm">
									<button class="cu-btn round sm bg-white"><text
											class="cuIcon-share"></text>分享</button>
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
								{{supply.createTime}}
							</view>
						</view>
					</view>
				</view>
				<view class="solids-bottom padding-xs flex">
					<view class="flex-sub">
						<view class="solid-bottom text-lg padding">
							<view class="text-black text-bold text-center"></view>
						</view>
						<view class="article-content">
							<rich-text :nodes="supply.content"></rich-text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/api/api'
	import util from '@/common/util/util'
	import htmlParser from '@/common/html-parser'

	export default {
		components: {},
		data() {
			return {
				supply: {},
				avatar: undefined,
				hadFollow: false, //是否关注作者			
			};
		},
		onLoad: async function(option) {
			let that = this;
			let ret = await that.$http.get('/showme/showmeSupply/queryById?id=' + option.id);
			if (ret.data.success) {
				that.supply = ret.data.result
				that.supply.content = htmlParser(util.formatRichTextImgWidth(that.supply.content));

				//加载作者头像
				that.$http.get('/sys/user/queryByUsername', {
					params: {
						username: that.supply.createBy
					}
				}).then(ret => {
					if (ret.data.success) {
						let perArr = ret.data.result
						let avatar = (perArr.avatar && perArr.avatar.length > 0) ?
							api.getFileAccessHttpUrl(perArr.avatar) : '/static/avatar_boy.png'
						that.avatar = avatar;
					}
				})

				//查询是否关注作者
				that.hadFollow = await util.queryHadFollowSomeOne(that.$http, that.supply.createBy);
			}
		},
		methods: {
			gotoPage(url) {
				console.log('gotoPage:' + url)
				uni.navigateTo({
					url: url
				})
			},
			/**
			 * 点击关注/取消关注按钮
			 */
			async clickFollow() {
				let ret = await this.$http.put('/showme/showmeFollow/attentionOrCancel?userId=' + this.supply
					.createBy);
				if (ret.data.success) {
					this.hadFollow = await util.queryHadFollowSomeOne(this.$http, this.supply.createBy);
				}
			},
		}
	}
</script>

<style>
</style>
