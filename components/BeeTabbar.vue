<template>
	<view class="tabbar-layout">
		<view class="tabbar">
			<view class="tab-item" :class="{ active: activeTab === 'index' }" @click="switchTab('/pages/homePage/homePage')">
				<image :src="activeTab == 'index' ? '../static/images/homeActive.png' : '../static/images/home.png'" class="icon" />
				<text>首页</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'shoppingMall' }" @click="switchTab('/pages/shoppingMall/shoppingMall')">
				<image :src="activeTab == 'shoppingMall' ? '../static/images/shoppingActive.png' : '../static/images/shopping.png'" class="icon" />
				<text>商城</text>
			</view>
			<view class="tab-item center-button" @click="scanCodeClick">
				<image src="/static/images/gameLogo.png" class="icon-large" />
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'monitorPage' }" @click="switchTab('/pages/honeySource/honeySource')">
				<image :src="activeTab == 'monitorPage' ? '../static/images/honeySourceActive.png' : '../static/images/honeySource.png'" class="icon" />
				<text>蜜源</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'myPage' }" @click="switchTab('/pages/myPage/myPage')">
				<image :src="activeTab == 'myPage' ? '../static/images/mineActive.png' : '../static/images/mine.png'" class="icon" />
				<text>我的</text>
			</view>
		</view>
		<view class="safe-view"></view>
	</view>
</template>
<script setup>
import { ref } from 'vue';

defineProps({
	activeTab: {
		type: String,
		default: 'index'
	}
});
// const activeTab = ref('/pages/index/index');
const scanCodeClick = () => {
	uni.navigateTo({
		url: '/pages/beeGame/beeGame'
	});
};
const switchTab = (url) => {
  uni.switchTab({ url })
}
</script>
<style lang="scss">
.tabbar-layout {
	position: fixed;
	z-index: 1001;
	bottom: 0;
	width: 100%;
	background: white;
	box-shadow: 0 -2rpx 10rpx #e2dfe2;
	.tabbar {
		border-radius: 20rpx 20rpx 0 0;
		height: 100rpx;
		display: flex;
		justify-content: space-around;
		.tab-item {
			width: 120rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.icon {
				width: 48rpx;
				height: 48rpx;
				margin-bottom: 10rpx;
			}
			.icon-large {
				width: 104rpx;
				height: 104rpx;
			}
			.tab-text {  // 修改前可能是直接用的 text 选择器
				font-size: 22rpx;
				color: #a1a1a1;
			}

			&.active {
				.icon,
				.tab-text {  // 修改前可能是直接用的 text 选择器
					color: #07c160;
				}
			}
		}

		.center-button {
			background-color: #fff;
			position: relative;
			bottom: 32rpx;
			height: 140rpx;
			width: 140rpx;
			border-radius: 140rpx;
			overflow: hidden;
		}
	}
}
</style>
