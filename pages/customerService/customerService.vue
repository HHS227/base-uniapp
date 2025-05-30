<template>
    <view class="container">
    
  
      <view class="content">
        <view class="qr-code-section">
          <!-- 长按识别二维码的图片 -->
          <image 
            src="/static/images/customer-service-qr.png" 
            mode="aspectFit" 
            class="qr-code"
            @longpress="handleLongPress"  >
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
  
  <!-- <script setup>
  import { onMounted } from 'vue'
  import { showToast } from '@dcloudio/uni-app'
  
  // 二维码图片地址（建议统一管理）
  const QR_CODE_URL = '/static/images/customer-service-qr.png'
  
  // 长按识别二维码处理函数
  const handleLongPress = () => {
    // 调用微信图片预览API并配置长按菜单
    wx.previewImage({
      current: QR_CODE_URL, // 当前显示图片
      urls: [QR_CODE_URL], // 图片列表（数组格式）
      longPressActions: {
        menuItems: [
          {
            name: '识别图中二维码', // 菜单名称
            icon: 'none', // 隐藏图标（可选：'download'/'copy'等）
          }
        ],
        success: (res) => {
          // 处理用户点击菜单事件
          if (res.menuItemIndex === 0) {
            handleQrRecognition() // 执行识别后的业务逻辑
          }
        },
        fail: (err) => {
          console.error('长按识别失败:', err)
          showToast({
            title: '识别失败，请重试',
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  }
  
  // 二维码识别后的业务逻辑（可根据实际需求扩展）
  const handleQrRecognition = () => {
    showToast({
      title: '正在识别客服二维码...',
      icon: 'loading',
      duration: 2000
    })
    // 示例：模拟识别成功后跳转客服聊天页面
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/customer-chat/index',
        success: () => {
          showToast({
            title: '已跳转至客服聊天',
            icon: 'none'
          })
        }
      })
    }, 1500)
  }
  </script>
   -->
  <style lang="scss" scoped>
  .container {
    height: 100vh;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
  }
  
  /* 顶部导航栏 */
  .nav-bar {
    height: 88rpx;
    line-height: 88rpx;
    background-color: #ffffff;
    border-bottom: 1rpx solid #f0f0f0;
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    
    .nav-title {
      font-size: 34rpx;
      font-weight: bold;
      color: #333;
      flex: 1;
      text-align: center;
    }
  }
  
  .content {
    flex: 1;
    padding: 40rpx 30rpx;
    box-sizing: border-box;
    
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
        letter-spacing: 0.5rpx;
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
          position: relative;
          padding-left: 24rpx;
          
          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 16rpx;
            height: 16rpx;
            background-color: #007aff;
            border-radius: 50%;
            margin-right: 12rpx;
          }
        }
      }
    }
  }
  </style>