<template>
	<view>
		<home :cur="PageCur" v-if="PageCur=='home'"></home>
		<shop v-if="PageCur=='shop'"></shop>
		<people v-if="PageCur=='people'"></people>
		<message v-if="PageCur=='message'"></message>
		<diary v-if="PageCur=='diary'" :userId="this.$store.getters.username"></diary>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view :class="PageCur=='home'?'action text-green':'action text-gray'" @click="NavChange" data-cur="home">
				<view class='cuIcon-homefill'></view>主页
			</view>
			<view :class="PageCur=='diary'?'action text-green':'action text-gray'" @click="NavChange" data-cur="diary">
				<view class='cuIcon-writefill'></view>发布
			</view>
			<view class="action text-gray add-action">
				<button class="cu-btn cuIcon-add bg-green shadow"></button>
				破圈推广
			</view>
			<view :class="PageCur=='message'?'action text-green':'action text-gray'" @click="NavChange" data-cur="message">
				<view class='cuIcon-messagefill'></view>消息
			</view>
			<view :class="PageCur=='people'?'action text-green':'action text-gray'" @click="NavChange"
				data-cur="people">
				<view class='cuIcon-peoplefill'></view>我的
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				PageCur: 'home',
				//commponent1Key: 0,
				//commponent2Key: 0,
			}
		},
		onLoad: function() {
			this.PageCur = 'home'
			//++this.commponent1Key
			//++this.commponent2Key
		},
		onPullDownRefresh: function() {
			console.log('onPullDownRefresh');
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom: function() {
			console.log('onReachBottom');
		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			}

		}
	}
</script>

<style>

</style>
