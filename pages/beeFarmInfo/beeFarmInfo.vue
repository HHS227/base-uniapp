
<template>
    <view>
     <TransNavVue title="我的蜂场" />
   <view class="container">
    <scroll-view scroll-y class="scroll-view">
      <view class="farm-list">
        <view 
          v-for="(item, index) in beeFarmInfoList" 
          :key="index" 
          class="farm-item"
        >
          <image :src="item.imgUrl" class="farm-image"></image>
          <view class="info-content">
            <text class="address">{{ item.address }}</text>
            <text class="bee-type">{{ item.mainBeeType }}</text>
            <view class="action-buttons">
              <button class="product-btn" @click="gotoProducts">我的商品</button>
              <button class="device-btn" @click="gotoDevices">我的设备</button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
     
     <view class="footer">
       <button class="add-btn" @click="gotoAddFarm">新增蜂场</button>
     </view>
   </view>
    </view>
</template>

<script setup>
import { ref, onMounted, } from 'vue'
  import { request } from '@/utils/request'
  import { onShow } from '@dcloudio/uni-app';
  import TransNavVue from '../../components/TransNav.vue'

// 模拟数据
const beeFarmInfoList = ref([
  {
    image: '/static/images/apiculture.png',
    address: '北京市密云区蜜蜂养殖基地',
    type:'小蜜蜂'
  },
  {
    image: '/static/images/apiculture.png',
    address: '河北省承德市养蜂场',
    type:'中蜜蜂'
    
  }
])
onShow(() => {
  getBeeFarmInfo()
})

const gotoProducts = () => {
  // 跳转商品管理
  uni.navigateTo({
    url: '/pages/traceabilityManagement/traceabilityManagement'
  })
}

const gotoDevices = () => {
  // 跳转设备管理
  uni.navigateTo({
    url: '/pages/deviceManagement/deviceManagement'
  })
}

// 新增跳转方法
const gotoAddFarm = () => {
  uni.navigateTo({
    url: '/pages/beeFarmInfo/addFarm'
  })
}


const getBeeFarmInfo = async () => {
  try {
    const res = await request({
      url: '/app-api/front/bee-farm/get/beeFarmInfo',
      showLoading: true, 
		
    })
   
    if (res.code === 0 ) {
        beeFarmInfoList.value = res.data
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } 
  catch (err) {
    console.error('获取我的蜂场数据:', err)
   
  }
}
</script>



  
  <style lang="scss" scoped>
  .container {
   height: 100vh;
   background-color: #f7f7f7;
   display: flex;
   flex-direction: column;
   
   .scroll-view {
    flex: 1;
  
  
  
  .farm-list {
    .farm-item {
      display: flex;
      margin-bottom: 30rpx;
      padding: 20rpx;
      margin: 20rpx;
      background: #fff;
      border-radius: 16rpx;
      box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
      
      .farm-image {
        width: 200rpx;
        height: 200rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
      }
      
      .info-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .address {
          font-size: 28rpx;
          color: #333;
          line-height: 1.5;
          margin-bottom: 10rpx;
        }
        
        .bee-type {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 20rpx;
        }
        
        .action-buttons {
          display: flex;
          justify-content: space-between;
          
          button {
            flex: 1;
            height: 60rpx;
            line-height: 60rpx;
            font-size: 26rpx;
            border-radius: 30rpx;
            margin: 0;
          }
          
          .product-btn {
            background: #ff7f00;
            color: white;
            margin-right: 10rpx;
          }
          
          .device-btn {
            background: #fff;
            color: #ff7f00;
            border: 1rpx solid #ff7f00;
            margin-left: 10rpx;
          }
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