<template>
  <view>
   <TransNavVue title="溯源管理" />
 <view class="container">
   <scroll-view scroll-y class="list">
     <view class="item" v-for="item in traceabilityList" :key="item.id">
       <view class="info">
        <view class="info-left">
          <image style="width:180rpx;height:180rpx" src="/static/images/apiculture.png"></image>
          <view class="info-detail">  
            <text class="name">{{item.name}}</text>
            <text class="status" :class="getStatusClass(item.status)">{{item.status}}</text>
            <text class="price">¥880</text>
          </view>
        </view>
        <view class="editbtn" :class="{
          'orange-btn': item.status === '未通过',
          'black-btn': item.status === '通过审核',
          'empty-btn': item.status === '审核中'
        }">
          <image
            v-if="item.status !== '审核中'"
            style="width:25rpx; height:25rpx;"
            src="/static/images/myPage/edit.png"
            @click="editTraceability(item)"></image>
          <view v-if="item.status === '未通过'">修改</view>
          <view v-if="item.status === '通过审核'">领取</view>
          <view v-if="item.status === '审核中'">&nbsp;</view>
        </view>
       </view>
     </view>
   </scroll-view>
   
   <view class="footer">
     <button class="add-btn" @click="addTraceability">新增商品</button>
   </view>
 </view>
  </view>
</template>

<script setup>
import { ref, onMounted, } from 'vue'
import { request } from '@/utils/request'
import { onShow } from '@dcloudio/uni-app';
import TransNavVue from '../../components/TransNav.vue'

const traceabilityList = ref([
  {name:'商品1',status:'未通过'},{name:'商品2',status:'审核中'},{name:'商品3',status:'通过审核'},{name:'商品4',status:'审核中'},{name:'商品5',status:'审核中'}
])
const refreshing = ref(false)

// 获取地址列表
const getTraceabilityList = async () => {

 
 try {
   const res = await request({
     url: '/app-api/weixin/shipping-address/list',
     showLoading: true
   })
   
   if (res.code === 0 ) {
    traceabilityList.value = res.data || [];
   } else {
     throw new Error(res.msg || '溯源商品列表失败')
   }
 } catch (err) {
   console.error('溯源商品列表失败:', err)
   uni.showToast({
     title: err.message || '溯源商品列表失败',
     icon: 'none'
   })
 } finally {
   refreshing.value = false
 }
}

// 生命周期钩子
onMounted(() => {
//  getTraceabilityList()
})

onShow(() => {
 // 每次页面显示时刷新数据
//  getTraceabilityList()
})

// 新增商品
const addTraceability= () => {
  uni.navigateTo({
    url: '/pages/traceabilityManagement/addProduct'
  })
}

// 编辑商品
const editTraceability = (item) => {
 uni.navigateTo({
   url: '/pages/userInfo/addressEdit',
   success: (res) => {
     res.eventChannel.emit('acceptAddressData', {
       address: item
     })
    
   }
 })
}




const getStatusClass = (status) => {
  return {
    'status-pending': status === '审核中',
    'status-rejected': status === '未通过',
    'status-approved': status === '通过审核'
  };
};
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
     margin: 20rpx;
     position: relative;
     
     
     .info {
      height: 231rpx;
       display: flex;
       justify-content: space-between;
       align-items: center;
       .info-left {
        display: flex;
        padding: 20rpx;
       .info-detail {
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name{
          font-size: 32rpx;
          font-weight: bold;
          color: #000;
        }
        .status {
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  
  &-pending {
    background-color: rgba(253, 208, 0, 0.12);
    color: #fd9c00;
  }
  
  &-rejected {
    background-color: rgba(253, 76, 0, 0.12);
    color: #eb5c20;
  }
  
  &-approved {
    background-color: rgba(235, 235, 235, 0.8);
    color: #666666;
  }
}
       
         .price {
          font-size: 40rpx;
          color: #fa4b46;
          font-weight: bold;
        }
       }
      
      
   
     }
     .editbtn {
        width: 100rpx;
        height: 100%; // 改为100%以匹配父容器高度
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 0 10rpx 10rpx 0;
        
        &.orange-btn {
          background-color: #ff6f0e;
          color: #fff;
        }
        
        &.black-btn {
          background-color: #000;
          color: #fff;
        }
        
        &.empty-btn {
          background-color: transparent;
        }
      }
   }
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
}


</style>