<template>
    <view class="container">
        <view>
			<view :style="{ height: getStatusBarHeight() + 'px' }"></view>
			<view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
			</view>
		</view>
      <view class="floating-btn" >
        <image src="/static/images/cart.png" mode="aspectFit" class="cart-icon"></image>
        <view class="btn-text">购物车</view>
      </view>

      <scroll-view scroll-y="true" class="scroll-view" enable-flex>
      
      </scroll-view>
      <BeeTabbarVue active-tab="shoppingMall"></BeeTabbarVue>
    </view>
    
 
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from "../../utils/system";
import BeeTabbarVue from '../../components/BeeTabbar.vue';

import { ref } from 'vue'
import { request } from '@/utils/request'
import { onShow } from '@dcloudio/uni-app'


onShow(() => {
 

})

</script>

<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  padding-bottom: 35rpx;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	height: 100vh;  

	

  .floating-btn {
    z-index: 999;
    position: fixed;
    right: 0;
    bottom: 384rpx;
    width: 89rpx;
    height: 107rpx;
    background: #FFFFFF;
    box-shadow: 0rpx 2rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 20rpx 0rpx 0rpx 20rpx;
    border: 1rpx solid #EEEEEE;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .cart-icon {
      width: 45rpx;
      height: 41rpx;
    }
    .btn-text {
      margin-top: 8rpx;
      font-size: 22rpx;
      color: #202120;
      line-height: 20rpx;
    }
  }

  .scroll-view {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 120rpx; /* 防止内容被底部导航栏遮挡 */
  }
}
</style>