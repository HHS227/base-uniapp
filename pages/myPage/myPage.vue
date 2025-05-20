<template>
	<BeeTabbarVue active-tab="myPage"></BeeTabbarVue>
	<view class="container">
		<view :style="{ height: getStatusBarHeight() + 'px' }"></view>
		<view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
			<image src="/static/images/logo.png" class="logo-image" mode="aspectFill"></image>
		</view>
		<scroll-view scroll-y="true" class="scroll-content">
			<view class="my-info-card">
				<view class="avatar-content">
					<view class="avatar-view">
						<image src="/static/logo.png" mode="" class="avatar-image"></image>
						<image src="/static/logo.png" mode="" class="sex-image"></image>
					</view>
					<view class="name-content">
						<text class="name-text">Jeefiy</text>
						<text class="id-text">ID:32224112</text>
					</view>
				</view>
				<view class="app-info">
					<view class="info-left">
						<text>蜜友汇</text>
						<text>WE-ID88-999-888</text>
					</view>
					<view class="btn"></view>
				</view>
			</view>
			<view class="commission-card">
				<view class="card-left">
					<text class="amount">￥1254.22</text>
					<text class="commission-texxt">推广佣金</text>
				</view>
				<button class="withdraw-button">去提现</button>
			</view>
		</scroll-view>
		<view class="tabbar-bottom"></view>
	</view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '../../utils/system';
import BeeTabbarVue from '../../components/BeeTabbar.vue';
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	.title-bar {
		.logo-image {
			width: 205rpx;
			height: 70rpx;
			margin-left: 40rpx;
		}
	}
	.scroll-content {
		flex: 1;
		height: 300rpx;
		margin-top: 20rpx;
		.my-info-card {
			width: 692rpx;
			height: 312rpx;
			margin: auto;
			background-color: #eeb6a3;
			border-radius: 20rpx;
			.avatar-content {
				padding-top: 24rpx;
				display: flex;
				.avatar-view {
					margin-left: 50rpx;
					width: 140rpx;
					height: 140rpx;
					border-radius: 140rpx;
					border: 2rpx solid #fff;
					position: relative;
					display: flex;
					.avatar-image {
						width: 136rpx;
						height: 136rpx;
						border-radius: 140rpx;
					}
					.sex-image {
						right: 2rpx;
						bottom: 2rpx;
						position: absolute;
						width: 32rpx;
						height: 32rpx;
						border-radius: 32rpx;
						border: 2rpx solid #fff;
					}
				}
				.name-content {
					margin-left: 24rpx;
					display: flex;
					flex-direction: column;
					.name-text {
						font-size: 40rpx;
						font-weight: bold;
					}
				}
			}
			.app-info {
				margin-top: 24rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 20rpx;
				.info-left {
					display: flex;
					flex-direction: column;
				}
				.btn {
					width: 56rpx;
					height: 56rpx;
					border-radius: 8rpx;
					background-color: #f6dad0;
				}
			}
		}
		.commission-card {
			margin: auto;
			margin-top: 24rpx;
			height: 144rpx;
			width: 692rpx;
			background: #474746;
			border-radius: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			.card-left{
				display: flex;
				flex-direction: column;
			}
			.withdraw-button{
				margin: 0;
				width: 160rpx;
				height: 60rpx;
				border-radius: 60rpx;
				line-height: 60rpx;
				font-size: 32rpx;
			}
		}
	}
}
</style>
