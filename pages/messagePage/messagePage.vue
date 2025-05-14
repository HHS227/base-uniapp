<template>
	<view class="container">
		<scroll-view scroll-y="true" class="scroll-content">
			<view class="message-item">
				<view class="item-left">
					
				</view>
				<view class="item-right">
					
				</view>
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
	background: #F6F6F6;
	.scroll-content {
		margin-top: 24rpx;
		flex: 1;
		height: 720rpx;
		.message-item {
			width: 702rpx;
			height: 200rpx;
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			margin: auto;
			margin-bottom: 16rpx;
		}
	}
}
</style>
