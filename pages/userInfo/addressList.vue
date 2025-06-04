<template>
   <view>
    <TransNavVue title="收获地址" />
  <view class="container">
    <scroll-view scroll-y class="list">
      <view class="item" v-for="item in addressList" :key="item.id">
        <view class="info">
          <view>
            <text class="name">{{item.consigneeName}}</text>
            <text class="phone">{{item.phoneNumber}}</text>
          </view>
          <view>
            <image 
              style="width:25rpx ; height: 25rpx;"  
              src="/static/images/myPage/edit.png" 
             
              @click="editAddress(item)"></image>
          </view>
        </view>
        <view class="address">
          <text>{{item.province}} </text>
          <text>{{item.city}} </text>
          <text>{{item.region}} </text>
          {{item.addressDetail}}
        </view>
        <view class="default-box">
          <view class="default-content" @click="setDefaultAddress(item.id)">
            <image 
              v-if="item.isDefault"
              style="width:25rpx; height:25rpx;"  
              src="/static/images/myPage/changeActive.png"
            ></image>
            <image 
              v-else
              style="width:25rpx; height:25rpx;"  
              src="/static/images/myPage/change.png"
            ></image>
            <text>设为默认地址</text>
          </view>
          <view @click.stop="deleteAddress(item.id)">删除</view>
        </view>
      </view>
    </scroll-view>
    
    <view class="footer">
      <button class="add-btn" @click="addAddress">新增收货地址</button>
    </view>
  </view>
   </view>
</template>

<script setup>
import { ref, onMounted, } from 'vue'
import { request } from '@/utils/request'
import { onShow } from '@dcloudio/uni-app';
import TransNavVue from '../../components/TransNav.vue'

const addressList = ref([])
const refreshing = ref(false)

// 获取地址列表
const getAddressList = async () => {
  if (refreshing.value) return
  refreshing.value = true
  
  try {
    const res = await request({
      url: '/app-api/weixin/shipping-address/list',
      showLoading: true
    })
    
    if (res.code === 0 || res.code === 200) {
      addressList.value = res.data || []
    } else {
      throw new Error(res.msg || '获取地址列表失败')
    }
  } catch (err) {
    console.error('获取地址列表失败:', err)
    uni.showToast({
      title: err.message || '获取地址列表失败',
      icon: 'none'
    })
  } finally {
    refreshing.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  getAddressList()
})

onShow(() => {
  // 每次页面显示时刷新数据
  getAddressList()
})

// 新增地址
const addAddress = () => {
  uni.navigateTo({ 
    url: '/pages/userInfo/addressEdit'
  })
}

// 编辑地址
const editAddress = (item) => {
  uni.navigateTo({
    url: '/pages/userInfo/addressEdit',
    success: (res) => {
      res.eventChannel.emit('acceptAddressData', {
        address: item
      })
     
    }
  })
}

// 设置默认地址
const setDefaultAddress = async (id) => {
  try {
    const res = await request({
      url: `/app-api/weixin/shipping-address/defaultShippingAddress?id=${id}`,
      method: 'PUT',
      showLoading: true
    })
    
    if (res.code === 0 || res.code === 200) {
      // 更新本地数据
      addressList.value.forEach(item => {
        item.isDefault = item.id === id
      })
      
      uni.showToast({
        title: '设置默认地址成功',
        icon: 'success'
      })
    } else {
      throw new Error(res.msg || '设置失败')
    }
  } catch (err) {
    console.error('设置默认地址失败:', err)
    uni.showToast({
      title: err.message || '设置失败',
      icon: 'none'
    })
  }
}

// 删除地址
const deleteAddress = async (id) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const result = await request({
            url: `/app-api/weixin/shipping-address/delete?id=${id}`,
            method: 'DELETE',
            showLoading: true
          })
          
          if (result.code === 0 ) {
            // 从列表中移除已删除的地址
            addressList.value = addressList.value.filter(item => item.id !== id)
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            })
          } else {
            throw new Error(result.msg || '删除失败')
          }
        } catch (err) {
          console.error('删除地址失败:', err)
          uni.showToast({
            title: err.message || '删除失败',
            icon: 'none'
          })
        }
      }
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
        align-items: center;
      
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
		margin-top: 30rpx;
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
        color: #000;
        text {
          margin-right: 10rpx;  // 添加省市区之间的间距
        }
      
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