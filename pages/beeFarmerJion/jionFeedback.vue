<template>
	<view class="container">
		<image src="/static/images/beeFarmerImages/Group 1000008586.png" class="feedback-image" mode=""></image>
		<view class="text-content">
			<text class="title">提交成功</text>
			<text class="info">请等待工作人员审核</text>
		</view>
		<view class="info-content">
			<image src="/static/images/beeFarmerImages/Group 1000008596.png" class="info-image" mode=""></image>
			审核时间大约1-3个工作日
		</view>
		<button class="back-btn">返回首页</button>
	</view>
</template>

<script setup></script>

<style lang="scss" scoped>
.container {
	.feedback-image {
		margin: auto;
		margin-top: 96rpx;
		width: 198rpx;
		height: 192rpx;
	}
	.text-content {
		margin-top: 34rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.title {
			font-weight: 500;
			font-size: 36rpx;
			color: #262626;
		}
		.info {
			margin-top: 8rpx;
			font-size: 26rpx;
			color: #999999;
		}
	}
	.info-content {
		margin: auto;
		margin-top: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 480rpx;
		height: 92rpx;
		background: #f6f6f6;
		border-radius: 78rpx;
		font-size: 24rpx;
		color: #555555;
		.info-image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 16rpx;
		}
	}
	.back-btn{
		margin-top: 88rpx;
		background: #fff;
		width: 622rpx;
		height: 96rpx;
		border-radius: 60rpx;
		border: 3rpx solid #B8B8B8;
	}
}
</style>
