
<template>
    <view> 
     <view>
			<view :style="{ height: getStatusBarHeight() + 'px' }"></view>
			<view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
			</view>
		</view>
      <scroll-view scroll-y="true" class="scroll-view" >
        <view class="map-container">
          <map 
            id="map" 
            style="width: 100%; height: 500rpx;"
            :latitude="userLocation.latitude"
            :longitude="userLocation.longitude"
            :markers="markers"
            :scale="12"
        
          ></map>
        </view>
        </scroll-view>
       <!-- 底部导航栏-->
       <BeeTabbarVue active-tab="monitorPage"></BeeTabbarVue>
    </view>
  </template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from "../../utils/system";
import BeeTabbarVue from '../../components/BeeTabbar.vue';

import { ref } from 'vue'
import { request } from '@/utils/request'
import { onShow  } from '@dcloudio/uni-app'



// 假设用户位置
const userLocation = ref({
  latitude: 30.5728, 
  longitude: 104.0668 
});
// 地图标记点
const markers = ref([]);
const pointList = ref([]);

// 获取用户当前位置
const getUserLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      userLocation.value = {
        latitude: res.latitude,
        longitude: res.longitude
      };
      getPointList()
      
    },
    fail: (err) => {
      uni.showToast({
        title: '获取位置失败',
        icon: 'none'
      });
      loading.value = false;
    }
  });
};

// 获取附近的数据
const getPointList = async () => {
  try {
    const res = await request({
      url: 'xxxxx',
      method: 'post',
      data: {
        latitude: userLocation.value.latitude,
        longitude: userLocation.value.longitude,
   
      },
      showLoading: true, 
    });
    
    if (res.code === 0) {
      pointList.value=res.data
      addBeeFarmMarkers(res.data);
    } else {
      throw new Error(res.msg || '数据异常');
    }
  } catch (err) {
    console.error('获取蜂场数据失败:', err);
    loading.value = false;
  }
};

// 添加蜂场标记点
const addBeeFarmMarkers = (data) => {
  markers.value=[]
  data.forEach((farm, index) => {
    if (farm.latitude && farm.longitude) {
      markers.value.push({
        id: index + 1, 
        latitude: farm.latitude,
        longitude: farm.longitude,
        iconPath: '/static/images/homePage/marker.png',
		    width: 50,
		    height: 30,
        label: {
          content:farm.name||'未知蜂场',
          color: '#FFF',
          fontSize:'24rpx',
          anchorY: -28,
          anchorX: -25
        },
       
      });
    }
  });
};





onShow(() => {
  
  // getUserLocation();
 
});


</script>

<style lang="scss" scoped>

.container {
  background-color: #f7f7f7;
  height: 100vh;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 35rpx;

  
  
  .scroll-view {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 120rpx; /* 防止内容被底部导航栏遮挡 */
  .map-container {
  margin: 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  overflow: hidden;
  }
  
 
 }
  
 
  
}


</style>