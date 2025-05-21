<template>
	<view class="container">
		<TransNavVue title="认养一箱蜂"></TransNavVue>
		<view class="collect-box">
			<view class="collect-img"></view>
			<view class="collect-info">
				<view class="info-title">
					产品描述的标题
					<view class="info-format">规格<text class="info-weight">500克</text></view>
				</view>
				<view class="pddBtn">￥299拼团</view>
			</view>
		</view>
		<view class="collect-box">
			<view class="collect-img"></view>
			<view class="collect-info">
				<view class="info-title">
					产品描述的标题
					<view class="info-format">规格<text class="info-weight">500克</text></view>
				</view>
				<view class="pddBtn">￥599购买</view>
			</view>
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
	.collect-box{
		margin: 20rpx 30rpx;
		height: 500rpx;
		background-color: #fff;
		border-radius: 10rpx;
		
		
	}
	.collect-img{
		height: 350rpx;
		background-color: #ddd;
		border-radius: 10rpx;
	}
	.collect-info{
		margin: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.info-title{
		font-weight: 500;
		color: #333333;
		.info-weight{
			font-size: 24rpx;
			color: #333333;
			margin-left: 20rpx;
		}
		.info-format{
			margin-top: 20rpx;
			color: #999999;
			font-size: 24rpx;
		}
	}
	
	.pddBtn{
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #FF6F0E;
		text-align: center;
		color: #fff;
		border-radius: 30rpx;
	}
	}
</style>
