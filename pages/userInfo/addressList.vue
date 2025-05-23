<template>
  <view class="container">
   
    <scroll-view scroll-y class="list">
      <view class="item" v-for="(item, index) in addressList" :key="index" >
        <view class="info">
          <view>
			<text class="name">{{item.name}}</text>
			<text class="phone">{{item.phone}}</text>
		  </view>
		  <view >
			  <image style="width:25rpx ; height: 25rpx;"  
			  src="/static/images/myPapeImages/edit.png" class="edit" 
			   @click="editAddress(item)">
			  </image>
			  </view>
        </view>
        <view class="address">{{item.province}}{{item.city}}{{item.district}}{{item.detail}}</view>
		<view class="default-box">
          <view class="default-content" @click="setDefaultAddress(item.id)">
            <image 
              v-if="item.isDefault"
              style="width:25rpx; height:25rpx;"  
              src="/static/images/myPapeImages/changeActive.png"
            ></image>
            <image 
              v-else
              style="width:25rpx; height:25rpx;"  
              src="/static/images/myPapeImages/change.png"
            ></image>
            <text>设为默认地址</text>
          </view>
          <view>删除</view>
        </view>
        
      </view>
    </scroll-view>
    
    <view class="footer">
      <button class="add-btn" @click="addAddress">新增收货地址</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import TransNavVue from '../../components/TransNav.vue'

// 使用假数据
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

// 新增地址
const addAddress = () => {
  uni.navigateTo({ 
    url: '/pages/userInfo/addressEdit'
  })
}

// 编辑地址
const editAddress = (item) => {
  uni.navigateTo({
    url: `/pages/userInfo/addressEdit?id=${item.id}`,
    success: (res) => {
      res.eventChannel.emit('acceptAddressData', {
        address: item
      })
    }
  })
}

// 设置默认地址
const setDefaultAddress = (id) => {
  addressList.value.forEach(item => {
    item.isDefault = item.id === id
  })
}

// 检查是否有默认地址
const hasDefault = computed(() => {
  return addressList.value.some(item => item.isDefault)
})
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  
  .list {
    flex: 1;
  
    
    .item {
		
      background: #fff;
      border-radius: 10rpx;
      padding: 30rpx;
      margin: 20rpx;
      position: relative;
      
      .info {
        display: flex;
        // align-items: center;
		justify-content: space-between;
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
	
    
      }
	  .default-box{
		margin-top: 50rpx;
		padding-top:30rpx ;
		border-top:1px solid #E9E9E9;
		display:flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #6B6B6B;
		
		.default-content {
		  display: flex;
		  align-items: center;
		  
		  image {
		    margin-right: 10rpx;
		  }
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