<template>
   <view>
    <TransNavVue title="设备管理"></TransNavVue>
  <view class="container">
    <view class="header">
      <text class="title">总设备:{{devices.length}}台</text>
    </view>
    <scroll-view scroll-y="true" class="device-list">
      <view v-if="devices.length === 0" class="empty-container">
       
        <text class="empty-text">暂无设备数据</text>
      </view>
      <view 
        v-else
        v-for="(device, index) in devices" 
        :key="index" 
        class="device-item"
        @click="traffic(device)"
      >
        <view class="device-header">
          <text class="device-name">{{ device.facilityName }}</text>
          <button class="unbind-btn" @click.stop="handleUnbind(device.id)">解绑</button>
        </view>
        
        <view class="device-status">
          <text class="info-tag">普通信息</text>
          <text class="online-tag">在线</text>
          <text class="device-model">{{ device.facilityType }}</text>
        </view>
        
        <view class="divider"></view>
        
        <view class="device-detail">
          <image class="device-image" src="/static/images/apiculture.png" mode="aspectFit"></image>
          <view class="device-info">
            <text class="info-text">型号：{{ device.no }}</text>
            <text class="info-text">绑定日期：{{ device.bindingTime }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
  <view class="footer">
     <button class="add-btn" @click="addDivce">新增设备</button>
   </view>
   </view>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import TransNavVue from '../../components/TransNav.vue'
import { request } from '../../utils/request.js'
import { onShow } from '@dcloudio/uni-app';


const devices = ref([])
const beeFarmId=ref({})

// 解绑
const handleUnbind = async (id) => {
  try {
    uni.showModal({
      title: '提示',
      content: '确定要解绑该设备吗？',
      success: async (res) => {
        if (res.confirm) {
          const res = await request({
            url: `/app-api/front/bee-farm/unBanding/facility?id=${id}`,
            showLoading: true,
            method: 'POST',
          })
          
          if (res.code === 0) {
            uni.showToast({
              title: '解绑成功',
              icon: 'success',
              duration: 2000,
            })
            // 更新设备列表
            devices.value = devices.value.filter(device => device.id !== id)
          } else {
            throw new Error(res.msg || '解绑失败')
          }
        }
      }
    })
  } catch (err) {
    console.error('解绑失败:', err)
    uni.showToast({
      title: err.message || '解绑失败',
      icon: 'none',
      duration: 2000,
    })
  }
}

const addDivce = () => {
  uni.navigateTo({
    url: `/pages/deviceManagement/addDeviceManagement?id=${beeFarmId.value.id}`
  })
}

const traffic = (item) => {
  uni.navigateTo({
    url: `/pages/trafficRecharge/trafficRecharge?id=${item.id}`
  })
}

// 获取设备信息
const getDeviceInfo = async () => {
  try {
    const res = await request({
      url: `/app-api/front/bee-farm/get/facilityList?beeFarmId=${beeFarmId.value.id}`,
      showLoading: true, 
     
    })
    if (res.code === 0 ) {
      devices.value = res.data || []; 
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取消息失败:', err)
   
  }
}

onShow(() => {
  const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	beeFarmId.value = currentPage.$page.options || currentPage.options
	  if (beeFarmId.value.id) {
      getDeviceInfo()
	  } else {
	    console.error(' 蜂场id 缺失')
	  }
})

</script>

<style lang="scss" scoped>

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
        justify-content: space-between;
        align-items: center;
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
  
 
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
 
}
.footer {
   
   position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
     padding: 20rpx;
     background: #fff;
   
   .add-btn {
     background: #ff6f0e;
     color: #fff;
     height: 80rpx;
     line-height: 80rpx;
     border-radius: 40rpx;
     font-size: 32rpx;
   }
 }
</style>