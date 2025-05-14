<template>
	<view class="container">
		<image src="/static/images/背景.png" mode="aspectFill" class="bg-image"></image>
		<view :style="{ height: getStatusBarHeight() + 'px' }"></view>
		<view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
			<image src="/static/images/logo.png" class="logo-image" mode="aspectFill"></image>
		</view>
		<view class="swiper-content">
			<swiper class="swiper" circular indicator-active-color="#ffffff" indicator-dots="true" autoplay="true" interval="2000" duration="500">
				<swiper-item class="swiper-item">
					<image src="/static/images/轮播图(1).png" class="swiper-image" mode=""></image>
				</swiper-item>
				<swiper-item class="swiper-item">
					<image src="/static/images/轮播图(1).png" class="swiper-image" mode=""></image>
				</swiper-item>
				<swiper-item class="swiper-item">
					<image src="/static/images/轮播图(1).png" class="swiper-image" mode=""></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="bee-farm-data">
			<image src="/static/images/数据面板背景.png" class="bee-farm-image" mode="aspectFill"></image>
			<view class="data-title">
				<view class="title-right">
					<view>蜂场数据</view>
					<image src="/static/images/蜂场数据logo.png" mode="" class="title-image"></image>
				</view>
				<view class="title-left">
					<image src="/static/images/查看更多-btn.png" mode="" class="title-btn"></image>
				</view>
			</view>
			<view class="data-list">
				<view class="data-item">
					<image src="/static/images/Rectangle 34626840@2x.png" mode="" class="data-bg"></image>
					<image src="/static/images/正六边形.png" mode="" class="six-imge"></image>
					<view class="data-item-title">国家</view>
					<view class="data-item-text">
						192
						<text>/个</text>
					</view>
				</view>
				<view class="data-item">
					<image src="/static/images/Rectangle 34626840@2x.png" mode="" class="data-bg"></image>
					<image src="/static/images/正六边形.png" mode="" class="six-imge"></image>
					<view class="data-item-title">产量</view>
					<view class="data-item-text">
						192
						<text>/万斤</text>
					</view>
				</view>
				<view class="data-item">
					<image src="/static/images/Rectangle 34626840@2x.png" mode="" class="data-bg"></image>
					<image src="/static/images/正六边形.png" mode="" class="six-imge"></image>
					<view class="data-item-title">领养量</view>
					<view class="data-item-text">
						192
						<text>/万箱</text>
					</view>
				</view>
				<view class="data-item">
					<image src="/static/images/Rectangle 34626840@2x.png" mode="" class="data-bg"></image>
					<image src="/static/images/正六边形.png" mode="" class="six-imge"></image>
					<view class="data-item-title">蜜蜂数量</view>
					<view class="data-item-text">
						192
						<text>/万斤</text>
					</view>
				</view>
			</view>
			<view class="scan-content">
				<image src="/static/images/扫码1.png" mode="" class="scan-image"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '../../utils/system';
</script>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	height: 100vh;
	position: relative;
	z-index: 1;
	.bg-image {
		width: 100%;
		height: 374rpx;
		position: absolute;
		z-index: -1;
	}
	.title-bar {
		.logo-image {
			width: 205rpx;
			height: 70rpx;
			margin-left: 40rpx;
		}
	}
	.swiper-content {
		height: 340rpx;
		width: 704rpx;
		border-radius: 24rpx;
		overflow: hidden;
		margin: auto;
		margin-top: 5rpx;
		.swiper {
			width: 100%;
			height: 100%;
			.swiper-image {
				height: 100%;
				width: 100%;
			}
		}
	}
	.bee-farm-data {
		height: 464rpx;
		width: 702rpx;
		margin: auto;
		margin-top: 30rpx;
		position: relative;
		.bee-farm-image {
			height: 100%;
			width: 100%;
			position: absolute;
			z-index: -1;
		}
		.data-title {
			display: flex;
			justify-content: space-between;
			height: 76rpx;
			.title-right {
				position: relative;
				display: flex;
				view {
					margin-top: 21rpx;
					margin-left: 30rpx;
					font-weight: bold;
					font-size: 38rpx;
					color: #010022;
				}
				.title-image {
					width: 109rpx;
					height: 37rpx;
					position: absolute;
					left: 124rpx;
					top: 34rpx;
					z-index: -1;
				}
			}
			.title-btn {
				margin-top: 30rpx;
				margin-right: 30rpx;
				width: 125rpx;
				height: 46rpx;
			}
		}
	}
	.data-list {
		margin-top: 30rpx;
		display: flex;
		padding: 0 30rpx;
		flex-wrap: wrap;
		justify-content: space-between;
		.data-item {
			display: flex;
			flex-direction: column;
			width: 310rpx;
			height: 157rpx;
			position: relative;
			margin-bottom: 20rpx;
			.data-bg {
				position: absolute;
				width: 310rpx;
				height: 157rpx;
				z-index: -1;
			}
			.six-imge {
				position: absolute;
				width: 98rpx;
				height: 89rpx;
				top: 5rpx;
				left: 191rpx;
			}
			.data-item-title {
				margin-top: 24rpx;
				margin-left: 24rpx;
				font-weight: 500;
				font-size: 32rpx;
				color: #666666;
			}
			.data-item-text {
				margin-top: 20rpx;
				margin-left: 24rpx;
				font-weight: bold;
				font-size: 38rpx;
				color: #010022;
				text {
					font-weight: 500;
					font-size: 22rpx;
					color: #999999;
				}
			}
		}
	}
	.scan-content {
		width: 698rpx;
		height: 110rpx;
		.scan-image {
			width: 698rpx;
			height: 110rpx;
		}
	}
}
</style>
