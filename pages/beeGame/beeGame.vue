<template>
	<view>
	  <TransNavVue title="极蜜养蜂" />
	  <view class="container">
		<image  src="/static/images/game/beeGame.png"  mode="aspectFill"  class="bg-image"></image>
	
		<view class="content">
			
		</view>
	  </view>
	</view>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import TransNavVue from '../../components/TransNav.vue';
  </script>
  
  <style lang="scss" scoped>
  .container {
	height: 100vh;
	width: 100%;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden; 
  }
  
  .bg-image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -1; // 让图片在最底层
  }
  
  .content {
	position: relative;
	z-index: 1; // 内容在图片上方
	padding: 20rpx; // 根据需要调整内边距
	height: 100%;
  }
  .beeFarm{
	position: absolute;
	bottom: 40%;
	left: 40%;
	z-index: 99;
	height: 200rpx;
	width: 200rpx;
  }
  </style>