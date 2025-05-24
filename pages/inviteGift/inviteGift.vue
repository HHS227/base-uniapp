<template>
  <view class="container">
    <TransNavVue title="邀请有礼"></TransNavVue>
    <view class="empty-content">
      <!-- <image src="/static/images/common/empty.png" class="empty-image"></image> -->
      <text class="empty-text">暂无具体活动</text>
    </view>
  </view>
</template>

<script setup>
import TransNavVue from '../../components/TransNav.vue'
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #f7f7f7;
  
  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    
    .empty-image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 30rpx;
    }
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}
</style>