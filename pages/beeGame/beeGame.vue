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
			<NoticeVue :notices="['通知1', '通知2', '通知3', '通知4']" />
		</view>
	</view>
</template>

<script setup>
import NoticeVue from '@/components/Notice.vue';
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
}
</style>
