<template>
    <view class="container">
		<image src="/static/images/游戏背景.png" mode="" class="game-bg"></image>
		<view class="right-top-btn">
			<image src="/static/images/群组 2 jQlrI3N@1x.png" mode=""></image>
		</view>
		<view class="broadcast-btn">
		</view>
    </view>
</template>

<script setup>

</script>

<style lang="scss" scoped>
	.container{
		position: relative;
		z-index: 1;
		height: 100vh;
		.game-bg{
			position: absolute;
			z-index: -1;
			width: 100%;
			height: 100%;
		}
		.right-top-btn{
			position: absolute;
			right:  30rpx;
			top: 220rpx;
			image{
				width: 112rpx;
				height: 110rpx;
			}
		}
	}
</style>
