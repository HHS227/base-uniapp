<template>
	<view class="container">
		<scroll-view scroll-y="true" class="scroll-content">
			<view class="message-item">
				<view class="item-left">
					<image src="/static/images/message-icon.png" mode=""></image>
					<view class="item-info">
						<view class="item-title">系统升级</view>
						<view class="item-time">2025.01.01 15:30:20</view>
					</view>
				</view>
				<view class="item-right unread">未读</view>
				<view class="item-right read">未读</view>
			</view>
		</scroll-view>
		<view class="safe-view"></view>
	</view>
</template>

<script setup></script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f6f6f6;
	.scroll-content {
		margin-top: 24rpx;
		flex: 1;
		height: 720rpx;
		.message-item {
			width: 702rpx;
			height: 200rpx;
			background: #ffffff;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			margin: auto;
			margin-bottom: 16rpx;
			display: flex;
			justify-content: space-between;
			padding: 24rpx;
			.item-left {
				display: flex;
				image {
					width: 152rpx;
					height: 152rpx;
				}
				.item-info {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 24rpx;
					.item-title {
						font-weight: bold;
						font-size: 30rpx;
						color: #1e1e1e;
						line-height: 46rpx;
					}
					.item-time {
						font-weight: 400;
						font-size: 26rpx;
						color: #999999;
						line-height: 40rpx;
					}
				}
			}
			.item-right {
				font-weight: 500;
				font-size: 28rpx;
			}
			.unread {
				color: #ff6f0e;
			}
			.read {
				color: #999999;
			}
		}
	}
}
</style>
