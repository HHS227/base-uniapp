<template>
	<view>
		<uni-popup ref="popup" type="center">
		<view class="popup-content">
			<view class="popup-title">{{ currentMessage.title }}</view>
			<view class="popup-time">{{ currentMessage.time }}</view>
			<view class="popup-body">{{ currentMessage.content }}</view>
			<button class="popup-btn" @click="closePopup">确定</button>
		</view>
	</uni-popup>
	<view class="container">
		<scroll-view scroll-y="true" class="scroll-content">
			<view class="message-item" @click="showMessageDetail">
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
	</view>
	
</template>

<script setup>
import { ref } from 'vue';

const popup = ref(null);
const currentMessage = ref({
	title: '系统升级',
	time: '2025.01.01 15:30:20',
	content: '这里是消息的详细内容这里是消息的详细内容这里是消息的详细内容这里是消息的详细内容...'
});

const showMessageDetail = () => {
	console.log('11');
	popup.value.open();
};

const closePopup = () => {
	popup.value.close();
};
</script>

<style lang="scss" scoped>
.popup-content {
	width: 600rpx;
	background: #fff;
	border-radius: 24rpx;
	padding: 40rpx;

	.popup-title {
		font-weight: bold;
		font-size: 40rpx;
		color: #0a0b0f;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.popup-time {
		font-weight: 400;
		font-size: 22rpx;
		color: #999999;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.popup-body {
		font-weight: 400;
		font-size: 27rpx;
		color: #323232;
		line-height: 1.6;
		margin-bottom: 40rpx;
	}

	.popup-btn {
		width: 100%;
		height: 80rpx;
		background: #ff6f0e;
		color: #fff;
		border-radius: 40rpx;
		font-size: 30rpx;
	}
}
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
