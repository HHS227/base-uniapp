<template>
  <view class="container">
    <scroll-view scroll-y class="content">
      <!-- 养蜂问题 -->
      <view class="question-item">
        <text class="question-title">1. 养蜂问题</text>
        <text class="question-content">
          这里是关于养蜂常见问题的详细解答内容...
        </text>
        <view class="divider"></view>
      </view>

      <!-- 使用注意事项 -->
      <view class="question-item">
        <text class="question-title">2. 使用注意事项</text>
        <text class="question-content">
          这里是使用智能养蜂系统的注意事项说明...
        </text>
        <view class="divider"></view>
      </view>

      <!-- 如何智能养蜂 -->
      <view class="question-item">
        <text class="question-title">3. 如何智能养蜂</text>
        <text class="question-content">
          这里是智能养蜂的操作指南和步骤说明...
        </text>
        <view class="divider"></view>
      </view>

      <!-- 什么时候发货 -->
      <view class="question-item">
        <text class="question-title">4. 什么时候发货</text>
        <text class="question-content">
          这里是关于蜜蜂产品发货时间和流程的说明...
        </text>
        <view class="divider"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
// 可以使用组合式API添加逻辑
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  
  .content {
    height: calc(100vh - 40rpx);
    
    .question-item {
      margin-bottom: 40rpx;
      padding: 20rpx;
      background: #fff;
      border-radius: 16rpx;
      
      .question-title {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        color: #000;
        margin-bottom: 20rpx;
      }
      
      .question-content {
        display: block;
        font-size: 28rpx;
        color: #999;  // 灰色字体
        line-height: 1.6;
        margin-bottom: 20rpx;
      }
      
      .divider {
        height: 1rpx;
        background: #eee;
      }
    }
  }
}
</style>