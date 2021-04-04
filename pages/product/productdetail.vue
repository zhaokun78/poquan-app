<template>
	<view class="cu-card dynamic">
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">商品详情</block>
			<view slot="right" @tap="share">分享</view>
		</cu-custom>
		<view class="cu-item shadow">
			<image :src="product.cover" mode="aspectFit" style="width:100% !important;"></image>
			<text class="text-red text-left text-xxl">￥</text>
			<text class="text-red text-left text-sl">{{product.price}}</text>
			<view class="text-black text-bold text-left text-xl">{{product.name}}</view>
			<!-- 商品描述 -->
			<view class="solids-bottom padding-xs flex">
				<view class="flex-sub">
					<view class="solid-bottom text-lg padding">
						<view class="text-black text-bold text-center">商品描述</view>
					</view>
					<view class="article-content">
						<rich-text :nodes="product.content"></rich-text>
					</view>
				</view>
			</view>
			<!-- 使用心得 -->
			<view class="solids-bottom padding-xs flex">
				<view class="flex-sub">
					<view class="solid-bottom text-lg padding">
						<view class="text-black text-bold text-center">使用心得</view>
					</view>
					<view class="article-content">
						<rich-text :nodes="product.useIdeas"></rich-text>
					</view>
				</view>
			</view>
		</view>
		<good-action></good-action>
	</view>
</template>

<script>
	import util from '@/common/util/util'
	import htmlParser from '@/common/html-parser'
	import goodAction from '@/components/goods/good-action.vue'
	export default {
		components: {
			goodAction,
		},
		data() {
			return {
				product: {},
			};
		},
		onLoad: async function(option) {
			let ret = await this.$http.get('/showme/showmeProduct/queryById?id=' + option.id);
			console.log(ret)
			if (ret.data.success) {
				this.product = ret.data.result
				this.product.cover = this.$config.staticDomainURL + '/' + this.product.cover;
				this.product.content = htmlParser(util.formatRichTextImgWidth(this.product.content));
				this.product.useIdeas = htmlParser(util.formatRichTextImgWidth(this.product.useIdeas));
			}
		},
		methods: {

		}
	}
</script>

<style>
</style>
