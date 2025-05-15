<template>
	<view class="customLayout">
		<view class="navBar">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ height: getStatusBarHeight() + 'px' }"></view>
			<view class="titleBar" :style="{ height: getTitleBarHeight() + 'px' }">
				<image :src="isWhite ? '/static/images/back(w).png' : '/static/images/back(b).png'" mode="aspectFit" class="back-btn" @click="goback"></image>
				<view class="title" :class="{ white: isWhite }">{{ title }}</view>
				<view class="holder"></view>
			</view>
		</view>
		<view class="fill" :style="{ height: getNarBarHeight() + 'px' }"></view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { getStatusBarHeight, getTitleBarHeight, getNarBarHeight } from '@/utils/system.js';

const goback = () => {
	let pages = getCurrentPages();
	if (pages[pages.length - 2]) {
		const prevPage = pages[pages.length - 2];
		// 判断上一页是否是tabbar页面
		console.log(prevPage.route);
		if (prevPage.route.includes('homePage') || prevPage.route.includes('mine') || prevPage.route.includes('shoppingMall') || prevPage.route.includes('honeySource')) {
			uni.switchTab({
				url: '/' + prevPage.route
			});
		} else {
			uni.navigateBack({
				delta: 1
			});
		}
	} else {
		console.log('无上一页');
		uni.switchTab({
			url: '/pages/homePage/homePage'
		});
	}
};
defineProps({
	isWhite: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		default: '我的页面'
	}
});
</script>

<style lang="scss" scoped>
.customLayout {
	.navBar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;

		.titleBar {
			display: flex;
			padding: 0 40rpx;
			align-items: center;
			justify-content: space-between;
			.back-btn {
				height: 34rpx;
				width: 34rpx;
			}
			.title {
				font-family: PingFangSC, PingFang SC;
				font-weight: 500;
				font-size: 34rpx;
				color: #0d0d0d;
			}
			.white {
				color: #fff;
			}
			.holder {
				width: 34rpx;
			}
		}
	}

	.fill {
	}
}
</style>
