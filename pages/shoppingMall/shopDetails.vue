<template>
	<view class="container">
		<TransNavVue title="商品详情"></TransNavVue>
		<view class="details-top">
			<view class="swiper-content">
				<swiper class="swiper" circular indicator-active-color="#ffffff" indicator-dots="true" autoplay="true" interval="2000" duration="500">
					<swiper-item class="swiper-item" v-for="item in 4">
						<image src="/static/images/轮播图(1).png" class="swiper-image" mode=""></image>
					</swiper-item>
				</swiper>
				
			</view>
			<view class="swiper-title">
				<view><text class="money">￥32,9</text> <text class="discounts">优惠券</text><text class="sale">满50-20</text> </view>
				<view class="kg">净重500克</view>
			</view>
		</view>
		<view class="details-center">
			<view class="details-title"> 图文详情</view>
			<view class="details-img">
				<image src="/static/images/轮播图(1).png"  class="details-image" mode=""></image>
				<image src="/static/images/轮播图(1).png"  class="details-image" mode=""></image>
			
			</view>
		</view>
		
		<view class="details-bottom">
					<button  class="settle-btn" @click="buyBtn">立即购买</button>
		</view>
	
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TransNavVue from '../../components/TransNav.vue';
import { request } from '@/utils/request'

const buyBtn=()=>{
	console.log('跳转到购物车')
	uni.navigateTo({
	    url:'/pages/shoppingCart/shoppingCart'
	})
}



onMounted(() => {
  
})
</script>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	height: 100vh;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	.swiper-content {
		height: 380rpx;
		width: 100%;
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
			
		.swiper-title{
			height: 150rpx;
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			padding: 50rpx  20rpx;
			.money{
				color:orange
			}
			.discounts{
				display: inline-block;
				width: 100rpx;
				background-color: red;
				color: #fff;
				margin: 0px 10rpx;
			}
			.sale{
				color: orange;
				font-weight: 600;
				
				
			}
			.kg{
				font-size: 14px;
				color: #cccccc;
				
			}
		}
	.details-center{
		margin-top: 10rpx;
		background-color:#fff;
		width: 100%;
		height: 600rpx;
		.details-title{
			height: 100rpx;
			line-height: 100rpx;
			color:#000;
			text-align: center;
		}
		.details-img{
			height: 500rpx;
			width: 100%;
			overflow: auto;
			.details-image{
				width: 100%;
			}
		}
	}
	.details-bottom{
		position: fixed;
		bottom: 0px;
		width: 100%;
		background-color: #fff;
		height: 60px;
		.settle-btn {
			margin-top: 10rpx;
			width: 580rpx;
			height: 76rpx;
			background: #ff6f0e;
			border-radius: 50rpx 50rpx 50rpx 50rpx;
			font-weight: 500;
			font-size: 32rpx;
			color: #ffffff;
			line-height: 76rpx;
		}
	}
}
</style>
