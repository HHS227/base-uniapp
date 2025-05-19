<template>
	<view class="container">
		<image src="/static/images/游戏背景.png" mode="" class="game-bg"></image>
		<view class="right-top-btn">
			<image src="/static/images/攻略.png" mode=""></image>
			<image src="/static/images/蜂场活动.png" mode=""></image>
			<image src="/static/images/兑换M币.png" mode=""></image>
		</view>
		<view class="broadcast-btn">
			<image src="/static/images/广播.png" mode=""></image>
			<text>收获广播</text>
		</view>
		<view class="broadcast-content">
			<introduction-v3 :items="noticeList" />
		</view>
		<view class="road-sign">
			<image src="/static/images/路标.png" mode="" class="road-sign-image"></image>
			<text class="road-sign-text">空地</text>
		</view>
		<view class="bee-hive">
			<image src="/static/images/蜂箱.png" class="bee-hive-image"></image>
		</view>
		<view class="get-task-btn">
			<image src="/static/images/任务.png" class="task-image"></image>
			<text class="task-text">获取任务</text>
		</view>
	</view>
</template>

<script setup>
import introductionV3 from '@/components/Introduction.vue';
const noticeList = [
  '通知1', '通知2', '通知3', '通知4'
]
</script>

<style lang="scss" scoped>
.container {
	position: relative;
	z-index: 1;
	height: 100vh;
	.game-bg {
		position: absolute;
		z-index: -1;
		width: 100%;
		height: 100%;
	}
	.broadcast-btn {
		position: absolute;
		left: 30rpx;
		top: 196rpx;
		width: 168rpx;
		height: 50rpx;
		border-radius: 30rpx;
		background: #fff;
		display: flex;
		align-items: center;
		image {
			width: 50rpx;
			height: 50rpx;
		}
		text {
			color: rgba(155, 113, 32, 1);
			font-size: 24rpx;
		}
	}
	.broadcast-content{
		position: absolute;
		left: 30rpx;
		top: 270rpx;
		width: 356rpx;
		height: 188rpx;
		background-color: rgba(0,106,184,0.19);
		border-radius: 18rpx;
		}
	.right-top-btn {
		position: absolute;
		right: 30rpx;
		top: 220rpx;
		image {
			margin-top: 24rpx;
			width: 112rpx;
			height: 110rpx;
		}
	}
	.road-sign{
		position: absolute;
		left: 76rpx;
		top: 890rpx;
		width: 136rpx;
		height: 152rpx;
		.road-sign-image{
			position: absolute;
			height: 100%;
			width: 100%;
		}
		.road-sign-text{
			position: absolute;
			top: 32rpx;
			left: 30rpx;
			color: #fff;
			font-size: 26rpx;
		}
	}
	.bee-hive{
		position: absolute;
		left: 232rpx;
		top: 848rpx;
		width: 286rpx;
		height: 322rpx;
		.bee-hive-image{
			width: 286rpx;
			height: 322rpx;
		}
	}
	.get-task-btn{
		position: absolute;
		left: 592rpx;
		top: 1146rpx;
		width: 128rpx;
		height: 128rpx;
		border-radius: 128rpx;
		background-color: rgba(124,67,2,1);
		border: 8rpx solid rgba(255,189,0,1);
		.task-image{
			position: absolute;
			top: 22rpx;
			left: 20rpx;
			width: 74rpx;
			height: 86rpx;
		}
		.task-text{
			position: absolute;
			top: 88rpx;
			width: 110rpx;
			height: 40rpx;
			line-height: 40rpx;
			color: rgba(255,255,255,1);
			font-size: 28rpx;
			text-align: left;
			text-shadow: 0rpx 0rpx 12rpx 0rpx rgba(239,80,48,1);
		}
	}
}
</style>
