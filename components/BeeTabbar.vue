<template>
	<view class="tabbar-layout">
		<view class="tabbar">
			<view class="tab-item" :class="{ active: activeTab === 'index' }" @click="switchTab('/pages/homePage/homePage')">
				<image :src="activeTab == 'index' ? '../static/images/底部导航栏@2x(2).png' : '../static/images/底部导航栏@2x(3).png'" class="icon" />
				<text>首页</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'shoppingMall' }" @click="switchTab('/pages/shoppingMall/shoppingMall')">
				<image :src="activeTab == 'shoppingMall' ? '../static/images/底部导航栏@2x(4).png' : '../static/images/底部导航栏@2x(5).png'" class="icon" />
				<text>商场</text>
			</view>
			<view class="tab-item center-button" @click="scanCodeClick">
				<image src="/static/images/养蜂.png" class="icon-large" />
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'monitorPage' }" @click="switchTab('/pages/honeySource/honeySource')">
				<image :src="activeTab == 'monitorPage' ? '../static/images/底部导航栏@2x(6).png' : '../static/images/底部导航栏@2x(7).png'" class="icon" />
				<text>蜜源</text>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'myPage' }" @click="switchTab('/pages/myPage/myPage')">
				<image :src="activeTab == 'myPage' ? '../static/images/底部导航栏@2x.png' : '../static/images/底部导航栏@2x(1).png'" class="icon" />
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
	uni.switchTab({
		url: url
	});
};
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
			text {
				font-size: 22rpx;
				color: #a1a1a1;
			}

			&.active {
				.icon,
				text {
					color: #07c160; // 激活状态的颜色
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
