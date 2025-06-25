<template>
	<view class="container">
		<!-- 顶部占位 -->
		<view>
			<view :style="{ height: getStatusBarHeight() + 'px' }"></view>
			<view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
			</view>
		</view>
		<!-- 内容 -->
		<scroll-view scroll-y="true" class="scroll-view">
		</scroll-view>
		<!-- 底部导航栏 -->
		<BeeTabbarVue></BeeTabbarVue>
	</view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from "../../utils/system";
import BeeTabbarVue from '../../components/BeeTabbar.vue';

import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '@/utils/request'

onShow(() => {
})



</script>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	padding-bottom: 35rpx;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	height: 100vh;


	.scroll-view {
		flex: 1;
		overflow-y: auto;
		padding-bottom: 120rpx;
		/* 防止内容被底部导航栏遮挡 */
	}
}
</style>
