<template>
	<view>
		<BeeTabbarVue active-tab="mine"></BeeTabbarVue>
	<view class="container">
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
		<scroll-view scroll-y="true" class="scroll-content">
			<view class="goods-info">
				<image src="/static/images/homePage/shoppingBg.png" mode=""></image>
				<view class="info-left">
					<view class="info-content">
						<view class="goods-price">
							￥
							<text>218</text>
						</view>
						<view class="goods-weight">净重500g</view>
					</view>
					<view class="goods-name">商品名称</view>
				</view>
				<view class="user-avatars">
					<AvatarStackVue :avatars="avatarList" :size="48"></AvatarStackVue>
				</view>
			</view>
			<view class="progress-panel">
				<view class="progress-title">
					<text class="title-text">进度报告</text>
					<text class="progress-text">50%交付进度</text>
				</view>
				<view class="progress-content">
					<view class="steps-container">
						<view class="step-item" v-for="(step, index) in steps" :key="index">
							<view class="step-ccontent">
								<image :src="step.completed ? step.curl : step.curl" class="step-icon"></image>
								<text :class="['step-text', { 'completed-text': step.completed }]">{{ step.text }}</text>
							</view>
							<image v-if="index < steps.length - 1" src="/static/images/homePage/next.png" class="arrow-icon"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="hive-state">
				<view class="hive-title">蜂箱状态</view>
				<view class="state-info">
					<view class="info-item">
						<view class="info-val">
							80
							<text class="unit">/%</text>
						</view>
						<view class="info-name">蜜蜂出勤</view>
					</view>
					<view class="info-item">
						<view class="info-val">
							80
							<text class="unit">/万斤</text>
						</view>
						<view class="info-name">蜂蜜产量</view>
					</view>
					<view class="info-item">
						<view class="info-val">
							80
							<text class="unit">/万箱</text>
						</view>
						<view class="info-name">蜂箱领养</view>
					</view>
					<view class="info-item">
						<view class="info-val">
							80
							<text class="unit">/万斤</text>
						</view>
						<view class="info-name">蜜蜂数量</view>
					</view>
				</view>
			</view>
			<view class="message-content">
				<view class="message-item" v-for="(item,index) in 4" :key="index">
					<text class="message-type">任务描述</text>
					2025-01-02 14:20:25 完成打扫
				</view>
			</view>
		</scroll-view>
		<view class="tabbar-bottom"></view>
	</view>
	</view>
</template>

<script setup>
import BeeTabbarVue from '../../components/BeeTabbar.vue';
import AvatarStackVue from '../../components/AvatarStack.vue';
import { ref } from 'vue';

const avatarList = ref(['/static/images/homePage/BeehiveLogo.png', '/static/images/homePage/BeehiveLogo.png']);
const steps = ref([
	{ text: '开始', completed: true, url: '/static/images/homePage/accomplish.png', curl: '/static/images/homePage/accomplishs.png' },
	{ text: '采蜜', completed: true, url: '/static/images/homePage/bee.png', curl: '/static/images/homePage/bees.png' },
	{ text: '分装', completed: false, url: '/static/images/homePage/classify.png', curl: '/static/images/homePage/classifys.png' },
	{ text: '完成', completed: false, url: '/static/images/homePage/accomplish.png', curl: '/static/images/homePage/accomplishs.png' },
	{ text: '交付', completed: false, url: '/static/images/homePage/delivery.png', curl: '/static/images/homePage/deliverys.png' }
]);
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #efefef;
	.swiper-content {
		height: 480rpx;
		width: 100%;
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
	.scroll-content {
		flex: 1;
		height: 100rpx;
		padding-top: 24rpx;
		border-radius: 32rpx 32rpx 0rpx 0rpx;
		.goods-info {
			height: 204rpx;
			width: 702rpx;
			position: relative;
			display: flex;
			justify-content: space-between;
			margin: auto;
			z-index: 1;
			image {
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: -1;
			}
			.info-left {
				display: flex;
				flex-direction: column;
				.info-content {
					margin-top: 20rpx;
					margin-left: 30rpx;
					height: 84rpx;
					display: flex;

					.goods-price {
						font-weight: 500;
						font-size: 32rpx;
						color: #ec652c;
						text {
							font-weight: bold;
							font-size: 56rpx;
							color: #eb5c20;
						}
					}
					.goods-weight {
						margin-left: 20rpx;
						margin-top: 34rpx;
						font-weight: 400;
						font-size: 28rpx;
						color: #999999;
					}
				}
				.goods-name {
					font-weight: bold;
					font-size: 36rpx;
					color: #1e1e1e;
					margin-left: 30rpx;
					margin-top: 10rpx;
				}
			}
			.user-avatars {
				margin-top: 40rpx;
				margin-right: 30rpx;
			}
		}
		.progress-panel {
			margin: auto;
			margin-top: 24rpx;
			width: 702rpx;
			height: 246rpx;
			background: #ffffff;
			box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.03);
			border-radius: 24rpx;
			.progress-content {
				padding: 20rpx 30rpx;
				.steps-container {
					display: flex;
					justify-content: space-between;
					.step-item {
						display: flex;
						.step-ccontent {
							display: flex;
							flex-direction: column;
							width: 72rpx;
							height: 116rpx;
							.step-icon {
								width: 72rpx;
								height: 72rpx;
							}
							.step-text {
								margin-top: 8rpx;
								text-align: center;
								font-size: 24rpx;
								color: #999999;
								line-height: 36rpx;
								&.completed-text {
									color: #101010;
								}
							}
						}
						.arrow-icon {
							margin: 0 20rpx;
							margin-top: 28rpx;
							width: 27rpx;
							height: 23rpx;
						}
					}
				}
			}
			.progress-title {
				padding: 0 30rpx;
				display: flex;
				justify-content: space-between;
				.title-text {
					margin-top: 26rpx;
					font-weight: 500;
					font-size: 32rpx;
					color: #1e1e1e;
					line-height: 46rpx;
				}
				.progress-text {
					margin-top: 38rpx;
					font-weight: 400;
					font-size: 26rpx;
					color: #999999;
					line-height: 40rpx;
				}
			}
		}
		.hive-state {
			padding: 26rpx 30rpx;
			margin: auto;
			margin-top: 24rpx;
			width: 702rpx;
			height: 210rpx;
			background: #ffffff;
			box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.03);
			border-radius: 16rpx;
			.hive-title {
				font-weight: 500;
				font-size: 32rpx;
				color: #1e1e1e;
				line-height: 46rpx;
			}
			.state-info {
				margin-top: 22rpx;
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				.info-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					.info-val {
						font-weight: bold;
						font-size: 32rpx;
						color: #000000;
						line-height: 48rpx;
						.unit {
							font-weight: 400;
							font-size: 20rpx;
							color: #999999;
						}
					}
					.info-name {
						font-size: 24rpx;
						color: #999999;
						line-height: 36rpx;
					}
				}
			}
		}
		.message-content {
			margin: auto;
			margin-top: 24rpx;
			padding: 32rpx 28rpx;
			width: 717rpx;
			height: 280rpx;
			background: #ffffff;
			box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.03);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			.message-item {
				margin-bottom: 20rpx;
				display: flex;
				align-items: center;
				font-size: 26rpx;
				color: #262626;
				line-height: 40rpx;
				.message-type {
					font-size: 26rpx;
					color: #999999;
					margin-right: 32rpx;
				}
			}
		}
	}
}
</style>
