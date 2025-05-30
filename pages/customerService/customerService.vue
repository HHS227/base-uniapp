<template>
    <view class="container">
      <view class="content">
        <view class="qr-code-section">
          <image 
            :src="qrCodeUrl"
            mode="aspectFit" 
            class="qr-code"
            @longpress="handleLongPress">
          </image>
          <text class="hint-text">长按识别添加客服</text>
        </view>
  
        <view class="notice-section">
          <view class="notice-title">注意事项</view>
          <view class="notice-content">
            <text>1. 客服工作时间：9:00-18:00</text>
            <text>2. 添加时请备注您的用户ID</text>
            <text>3. 紧急问题请直接拨打客服电话</text>
            <text>4. 请勿向客服透露您的密码</text>
          </view>
        </view>
      </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { request } from '@/utils/request';

const qrCodeUrl = ref('/static/images/logo.png'); // 默认图片

// 获取客服二维码
const getCustomerQrCode = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/customer/get/customer',
      showLoading: true
    });
    
    if (res.code === 0 ) {
      qrCodeUrl.value = res.data || '/static/images/logo.png';
    }
  } catch (err) {
    console.error('获取客服二维码失败:', err);
  }
};

onMounted(() => {
  getCustomerQrCode();
});

const handleLongPress = () => {
  uni.previewImage({
    current: qrCodeUrl.value,
    urls: [qrCodeUrl.value],
    success: () => {
      showToast({
        title: '请选择"识别图中二维码"',
        icon: 'none'
      })
    },
    fail: (err) => {
      console.error('长按识别失败:', err)
      showToast({
        title: '识别失败，请重试',
        icon: 'none'
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 40rpx 30rpx;
  
  .qr-code-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 50rpx 40rpx;
    border-radius: 20rpx;
    margin-bottom: 40rpx;
    
    .qr-code {
      width: 360rpx;
      height: 360rpx;
      border-radius: 12rpx;
      box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
    }
    
    .hint-text {
      margin-top: 24rpx;
      font-size: 28rpx;
      color: #666;
    }
  }

  .notice-section {
    background-color: #fff;
    padding: 40rpx 32rpx;
    border-radius: 20rpx;
    
    .notice-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 30rpx;
    }
    
    .notice-content {
      font-size: 26rpx;
      color: #666;
      line-height: 40rpx;
      
      text {
        display: block;
        position: relative;
        padding-left: 24rpx;
        margin-bottom: 10rpx;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 16rpx;
          width: 8rpx;
          height: 8rpx;
          background-color: #007aff;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>