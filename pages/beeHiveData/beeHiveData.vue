<template>
	<view class="container">
		<image src="/static/images/背景.png" mode="" class="bg-image"></image>
		<TransNavVue title="蜂场数据"></TransNavVue>
		<view class="data-panel">
			<image class="panel-bg" src="/static/images/data-bg.png" mode=""></image>
			<view class="data-content">
				<view class="data-item" v-for="(value, key) in dataList">
					<view class="title">
						<text class="title-text">{{ dataMap[key].text }}</text>
						<image :src="dataMap[key].icon" mode="aspectFill" class="data-icon"></image>
					</view>
					<view class="data-value">
						<text class="value">{{value}}</text>
						{{ dataMap[key].unit }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import TransNavVue from '../../components/TransNav.vue';

const dataMap = ref({
	countryCount: {
		text: '国家',
		icon: '/static/images/国家.png',
		unit: '/个'
	},
	adoptCount: {
		text: '领养量',
		icon: '/static/images/领养量.png',
		unit: '/万箱'
	},
	productionVolume: {
		text: '产量',
		icon: '/static/images/产量.png',
		unit: '/万斤'
	},
	quantity: {
		text: '数量',
		icon: '/static/images/蜜蜂.png',
		unit: '/万只'
	},
	attendanceRate: {
		text: '出勤',
		icon: '/static/images/蜜蜂.png',
		unit: '%'
	},
	userCount: {
		text: '用户量',
		icon: '/static/images/用户量.png',
		unit: '/万人'
	}
});
const dataList = ref({
	countryCount: 192,
	adoptCount: 1.89,
	productionVolume: 236.8,
	quantity: 265.1,
	attendanceRate: 86.6,
	userCount: 232.3
});
</script>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	height: 100vh;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;

	.bg-image {
		width: 100%;
		height: 548rpx;
		position: absolute;
		z-index: -1;
	}
	.data-panel {
		margin: auto;
		margin-top: 18rpx;
		width: 702rpx;
		height: 350rpx;
		position: relative;
		z-index: 1;
		.panel-bg {
			height: 100%;
			width: 100%;
			position: absolute;
			z-index: -1;
		}
		.data-content {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			.data-item {
				padding: 30rpx;
				border-bottom: 2rpx solid #f6f6f6;
				border-right: 2rpx solid #f6f6f6;
				height: 175rpx;
				&:nth-child(3n) {
					border-right: 0;
				}
				&:nth-child(n + 4) {
					border-bottom: 0;
				}
				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.title-text {
						font-weight: 500;
						font-size: 32rpx;
						color: #666666;
					}
					.data-icon {
						width: 58rpx;
						height: 58rpx;
					}
				}
				.data-value{
					margin-top: 16rpx;
					font-weight: 500;
					font-size: 20rpx;
					color: #999999;
					.value{
						font-weight: bold;
						font-size: 36rpx;
						color: #010022;
					}
				}
			}
		}
	}
}
</style>
