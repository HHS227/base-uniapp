<template>
  <view class="container">
    <TransNavVue title="设备管理"></TransNavVue>
    <view class="header">
      <text class="title">总设备:{{devices.length}}台</text>
    </view>
    
    <scroll-view scroll-y="true" class="device-list">
      <view v-if="devices.length === 0" class="empty-container">
        <image src="/static/images/empty.png" class="empty-image"></image>
        <text class="empty-text">暂无设备数据</text>
      </view>
      <view 
        v-else
        v-for="(device, index) in devices" 
        :key="index" 
        class="device-item"
      >
        <view class="device-header">
          <text class="device-name">{{ device.name }}</text>
          <button class="unbind-btn" @click="handleUnbind(device.id)">解绑</button>
        </view>
        
        <view class="device-status">
          <text class="info-tag">普通信息</text>
          <text class="online-tag">在线</text>
          <text class="device-model">{{ device.model }}</text>
        </view>
        
        <view class="divider"></view>
        
        <view class="device-detail">
          <image class="device-image" :src="device.image" mode="aspectFit"></image>
          <view class="device-info">
            <text class="info-text">型号：{{ device.model }}</text>
            <text class="info-text">绑定日期：{{ device.bindDate }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import TransNavVue from '../../components/TransNav.vue'

const devices = ref([
  {
    id: 1,
    name: '智能蜂箱001',
    model: 'X-1000',
    status: 'online',
    image: '/static/images/养蜂.png',
    bindDate: '2023-10-15'
  },
  {
    id: 2,
    name: '智能蜂箱002',
    model: 'X-2000',
    status: 'online',
    image: '/static/images/养蜂.png',
    bindDate: '2023-10-10'
  }
])

const handleUnbind = (id) => {
  uni.showModal({
    title: '提示',
    content: '确定要解绑该设备吗？',
    success: (res) => {
      if (res.confirm) {
        // 调用解绑API
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  
  .back-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
  }
  
  .nav-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
}
.container {
  padding: 30rpx;
  background-color: #f7f7f7;
  min-height: 100vh;
  
  .header {
    margin-bottom: 30rpx;
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .device-list {
    .device-item {
      background-color: #fff;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 30rpx;
      
      .device-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        
        .device-name {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
        }
        
        .unbind-btn {
          margin: 0;
          padding: 0 20rpx;
          height: 50rpx;
          line-height: 50rpx;
          background-color: #ff6f0e;
          color: #fff;
          font-size: 24rpx;
          border-radius: 25rpx;
        }
      }
      
      .device-status {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        .info-tag {
          position: relative;
          padding-left: 30rpx;
          margin-right: 10rpx;
          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 16rpx;
            height: 16rpx;
            background-color: #1890ff;
            border-radius: 50%;
          }
        }
        
        .online-tag {
          position: relative;
          padding-left: 30rpx;
          margin-right: 20rpx;
          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 16rpx;
            height: 16rpx;
            background-color: #52c41a;
            border-radius: 50%;
          }
        }
        
        .device-model {
          margin-left: auto;
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .divider {
        height: 1rpx;
        background-color: #eee;
        margin: 20rpx 0;
      }
      
      .device-detail {
        display: flex;
        
        .device-image {
          width: 120rpx;
          height: 120rpx;
          margin-right: 20rpx;
        }
        
        .device-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          .info-text {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }
  }
}
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  
  .empty-image {
    width: 300rpx;
    height: 300rpx;
    margin-bottom: 40rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>