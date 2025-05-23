<template>
  <view class="container">
    
    <view class="content">
      <view class="item" >
        <text class="label">头像</text>
        <view class="right">
          <image :src="userInfo.avatar" class="avatar"></image>
         
        </view>
      </view>
      
      <view class="item" >
        <text class="label">电话</text>
        <view class="right">
          <text class="value">{{userInfo.phone}}</text>
         
        </view>
      </view>
      
      <view class="item" >
        <text class="label">性别</text>
        <view class="right">
          <text class="value">{{userInfo.gender}}</text>
         
        </view>
      </view>
      
      <view class="item" @click="handleAddress">
        <text class="label">地址管理</text>
        <view class="right">
          <image src="/static/images/myPapeImages/向右箭头.png" class="arrow"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import TransNavVue from '../../components/TransNav.vue'

const userInfo = ref({
  avatar: '/static/logo.png',
  phone: '138****8888',
  gender: '男'
})

const handleAvatar = () => {
  uni.chooseImage({
    success: (res) => {
      userInfo.value.avatar = res.tempFilePaths[0]
    }
  })
}

const handlePhone = () => {
  uni.navigateTo({ url: '/pages/userInfo/phoneEdit' })
}

const handleGender = () => {
  uni.showActionSheet({
    itemList: ['男', '女'],
    success: (res) => {
      userInfo.value.gender = res.tapIndex === 0 ? '男' : '女'
    }
  })
}

const handleAddress = () => {
  uni.navigateTo({ url: '/pages/userInfo/addressList' })
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #f7f7f7;
  
  .content {
    padding: 0 30rpx;
    
    .item {
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1rpx solid #eee;
      
      .label {
        font-size: 30rpx;
        color: #333;
      }
      
      .right {
        display: flex;
        align-items: center;
        
        .value {
          font-size: 28rpx;
          color: #999;
          margin-right: 20rpx;
        }
        
        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        
        .arrow {
          width: 30rpx;
          height: 30rpx;
        }
      }
    }
  }
}
</style>