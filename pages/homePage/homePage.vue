<template>
	<BeeTabbarVue></BeeTabbarVue>
	<view class="container">
		<image src="/static/images/背景.png" mode="aspectFill" class="bg-image"></image>
		<view :style="{ height: getStatusBarHeight() + 'px' }"></view>
		<view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
			<image src="/static/images/logo.png" class="logo-image" mode="aspectFill"></image>
		</view>
		<scroll-view scroll-y="true" class="scroll-view">
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
						<image src="/static/images/查看更多-btn.png" mode="" class="title-btn" @click="gotoHiveData"></image>
					</view>
				</view>
				<view class="data-list">
					<view class="data-item">
						<image src="/static/images/数据背景.png" mode="" class="data-bg"></image>
						<view class="data-item-title">国家</view>
						<view class="data-item-text">
							192
							<text>/个</text>
						</view>
					</view>
					<view class="data-item">
						<image src="/static/images/数据背景.png" mode="" class="data-bg"></image>
						<view class="data-item-title">产量</view>
						<view class="data-item-text">
							192
							<text>/万斤</text>
						</view>
					</view>
					<view class="data-item">
						<image src="/static/images/数据背景.png" mode="" class="data-bg"></image>
						<view class="data-item-title">领养量</view>
						<view class="data-item-text">
							192
							<text>/万箱</text>
						</view>
					</view>
					<view class="data-item">
						<image src="/static/images/数据背景.png" mode="" class="data-bg"></image>
						<view class="data-item-title">蜜蜂数量</view>
						<view class="data-item-text">
							192
							<text>/万斤</text>
						</view>
					</view>
				</view>
			</view>
			<view class="scan-content">
				<image src="/static/images/扫码1.png" mode="" class="scan-image"></image>
			</view>
			<view class="my-bee-title">
				<view>我的蜂箱</view>
				<image src="/static/images/我的蜂箱logo.png" mode="" class="title-image"></image>
			</view>
			<view class="my-bee-card">
				<image src="/static/images/Subtract@2x.png" mode="" class="card-bg"></image>
				<view class="card-content">
					<view class="card-top">
						<view>
							<image src="/static/images/蜂箱logo.png" mode="" class="my-bee-icon"></image>
						</view>
						<view class="top-info">
							<view class="card-title">四川天府极蜜部落单行标题展四川天府极蜜部落单行标题展</view>
							<view class="group-purchase">
								<AvatarStackVue :avatars="avatarList" :size="40"></AvatarStackVue>
								<view class="gruop-info">还差6人</view>
							</view>
							<view class="progress-info">
								<view class="progress-content">
									<view class="progress-val" :style="{ width: `${percent}%` }"></view>
								</view>
								{{ percent + '%' }}
							</view>
						</view>
					</view>
					<view class="card-bottom">
						<view class="bottom-left">
							领养类型：
							<text class="bottom-text">拼团</text>
						</view>
						<view class="bottom-right">
							领养时间：
							<text class="bottom-text">11:00 - 12:00</text>
						</view>
					</view>
				</view>
			</view>
			<view class="no-bee">
				<image src="/static/images/无数据.png" mode=""></image>
				<text>当前暂无蜂箱信息</text>
			</view>
		</scroll-view>
		<view class="tabbar-bottom"></view>
	</view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '../../utils/system';
import AvatarStackVue from '../../components/AvatarStack.vue';
import BeeTabbarVue from '../../components/BeeTabbar.vue';
import { ref } from 'vue';

const percent = ref(45);
const avatarList = ref(['/static/images/蜂箱logo.png', '/static/images/蜂箱logo.png']);

const gotoHiveData = () => {
	uni.navigateTo({
		url: '/pages/beeHiveData/beeHiveData'
	});
};
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
	.scroll-view {
		flex: 1;
		height: 300rpx;
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
		}
		.scan-content {
			width: 698rpx;
			height: 110rpx;
			margin: auto;
			margin-top: 30rpx;
			.scan-image {
				width: 698rpx;
				height: 110rpx;
			}
		}
		.my-bee-title {
			position: relative;
			display: flex;
			view {
				margin-top: 24rpx;
				margin-left: 54rpx;
				font-weight: bold;
				font-size: 38rpx;
				color: #010022;
			}
			.title-image {
				width: 109rpx;
				height: 37rpx;
				position: absolute;
				left: 149rpx;
				top: 38rpx;
				z-index: -1;
			}
		}
		.my-bee-card {
			width: 702rpx;
			height: 290rpx;
			margin: auto;
			margin-top: 24rpx;
			position: relative;
			.card-content {
				height: 100%;
				width: 100%;
				padding: 24rpx 24rpx 23rpx;
				.card-top {
					width: 100%;
					height: 188rpx;
					border-bottom: 2rpx solid #ebebeb;
					display: flex;
					.top-info {
						margin-left: 24rpx;
						.card-title {
							width: 446rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						.group-purchase {
							height: 40rpx;
							margin-top: 14rpx;
							display: flex;
							align-items: center;
							.gruop-info {
								margin-left: 16rpx;
								font-weight: 400;
								font-size: 26rpx;
								color: #999999;
								line-height: 35rpx;
							}
						}
						.progress-info {
							margin-top: 24rpx;
							height: 28rpx;
							font-weight: 500;
							font-size: 20rpx;
							color: #2d2d2d;
							display: flex;
							align-items: center;
							.progress-content {
								width: 390rpx;
								background: #f7f7f7;
								height: 28rpx;
								border-radius: 28rpx;
								margin-right: 10rpx;
								.progress-val {
									background: linear-gradient(90deg, #ffa66a 0%, #ff6f0e 100%);
									height: 28rpx;
									border-radius: 28rpx;
								}
							}
						}
					}
					.my-bee-icon {
						width: 160rpx;
						height: 160rpx;
					}
				}
				.card-bottom {
					display: flex;
					justify-content: space-between;
					margin-top: 18rpx;
					font-weight: 400;
					font-size: 26rpx;
					color: #999999;
					.bottom-text {
						font-weight: 400;
						font-size: 26rpx;
						color: #666666;
					}
				}
			}
			.card-bg {
				position: absolute;
				z-index: -1;
				width: 702rpx;
				height: 290rpx;
			}
		}
		.no-bee {
			width: 702rpx;
			height: 186rpx;
			background: #ffffff;
			box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.03);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			margin: auto;
			margin-top: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			image {
				height: 130rpx;
				width: 130rpx;
			}
			text {
				font-weight: 400;
				font-size: 24rpx;
				color: #b5b5b5;
			}
		}
	}
}
</style>
