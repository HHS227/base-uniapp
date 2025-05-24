
<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '../../utils/system';
import BeeTabbarVue from '../../components/BeeTabbar.vue';
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'

const loading = ref(false);
const honeySourceList = ref([]);
// 移除mapInstance引用

// 获取蜜源列表
const getShoppingList = async () => {
  try {
    const res = await request({
      url: '/app-api/front/bee-farm/get/list',
      showLoading: false, 
    });
    
    if (res.code === 0 || res.code === 200) {
      honeySourceList.value = res.data || [];
      loading.value = false;
    } else {
      throw new Error(res.msg || '数据异常');
    }
  } catch (err) {
    console.error('获取蜜源数据失败:', err);
    loading.value = false;
  }
};

onMounted(() => {
  getShoppingList();
});
</script>

<template>
 <view> <BeeTabbarVue active-tab="monitorPage"></BeeTabbarVue>
  <view class="container">
    <image src="/static/images/背景.png" mode="aspectFill" class="bg-image"></image>
    <view :style="{ height: getStatusBarHeight() + 'px' }"></view>
    <view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
      <view>蜜源</view>
    </view>
    
    
    <view class="map-container">
      <map 
        id="map" 
        style="width: 100%; height: 500rpx;"
        :latitude="30.5728"
        :longitude="104.0668"
        :markers="markers"
        show-location
      ></map>
    </view>
    
    <view class="my-bee-title">
      <view>推荐蜜源</view>
      <image src="/static/images/我的蜂箱logo.png" mode="" class="title-image"></image>
    </view>
    <view class="bee-list-box" v-for="(item,index) in honeySourceList" :key="index">
      <view class="bee-item-img">
		  <image :src=item.imgUrl style="width: 100%; height: 100%;"></image>
	  </view>
      <view class="bee-item-title">
        <text>{{item.name}}</text>
        <view class="bee-item-address">{{item.address}}</view>
      </view>
    </view>
  </view></view>
</template>

<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  height: 100vh;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;

  .bg-image {
    width: 100%;
    height: 374rpx;
    position: absolute;
    z-index: -1;
  }
  .title-bar {
    text-align: center;
    font-weight: 600;
  }
  
  .map-box {
    margin: 0rpx 30rpx;
    background-color: #fff;
    height: 500rpx;
    border-radius: 5rpx;
    overflow: hidden;
    
    /* 移除Leaflet相关样式 */
  }
  
  .my-bee-title {
    position: relative;
    display: flex;
    margin-bottom: 20rpx;
  
    view {
      margin-top: 24rpx;
      margin-left: 54rpx;
      font-weight: bold;
      font-size: 38rpx;
      color: #010022;
    }
    .title-image {
      width: 109rpx;
      height: 37rpx;
      position: absolute;
      left: 149rpx;
      top: 38rpx;
      z-index: -1;
    }
  }
  .bee-list-box {
    margin: 5rpx 30rpx;
    height: 150rpx;
    background-color:#fff;
    border-radius: 5rpx;
    padding: 20rpx;
    display: flex;

    .bee-item-img {
      width: 100rpx;
      height: 100rpx;
      background-color: #ddd;
      margin-right: 10rpx;
    }
    .bee-item-title {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text {
        font-weight: 600;
      }
      view {
		  width: 500rpx;
		 overflow: hidden;
		 text-overflow: ellipsis;
		 white-space: nowrap;
        font-size: 16rpx;
        color:#ddd;
      }
    }
  }
}

.map-container {
  margin: 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  overflow: hidden;
}
</style>