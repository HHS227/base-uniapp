<template>
  <view class="container">
   
    <scroll-view scroll-y class="list">
      <view class="item" v-for="(item, index) in addressList" :key="index" >
        <view class="info">
          <text class="name">{{item.name}}</text>
          <text class="phone">{{item.phone}}</text>
        </view>
        <view class="address">{{item.province}}{{item.city}}{{item.district}}{{item.detail}}</view>
        <!-- <image src="/static/images/myPapeImages/编辑.png" class="edit"  @click="editAddress(item)""></image> -->
      </view>
    </scroll-view>
    
    <view class="footer">
      <button class="add-btn" @click="addAddress">新增收货地址</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import TransNavVue from '../../components/TransNav.vue'

const addressList = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园路1号',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '北京市',
    city: '朝阳区',
    district: '',
    detail: '建国路88号',
    isDefault: false
  }
])

const addAddress = () => {
  uni.navigateTo({ url: '/pages/userInfo/addressEdit' })
}

const editAddress = (item) => {
  uni.navigateTo({ 
    url: `/pages/userInfo/addressEdit?id=${item.id}`
  })
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  
  .list {
    flex: 1;
    padding: 20rpx;
    
    .item {
      background: #fff;
      border-radius: 10rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;
      position: relative;
      
      .info {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        .name {
          font-size: 32rpx;
          font-weight: bold;
        }
        
        .phone {
          font-size: 28rpx;
          color: #666;
          margin-left: 30rpx;
        }
        
        .default {
          font-size: 24rpx;
          color: #fff;
          background: #ff6f0e;
          padding: 4rpx 10rpx;
          border-radius: 6rpx;
          margin-left: 20rpx;
        }
      }
      
      .address {
        font-size: 28rpx;
        color: #666;
      }
      
      .edit {
        position: absolute;
        right: 30rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  
  .footer {
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
}
</style>