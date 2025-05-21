<template>
  <BeeTabbarVue active-tab="monitorPage"></BeeTabbarVue>
  <view class="container">
    <image src="/static/images/背景.png" mode="aspectFill" class="bg-image"></image>
    <view :style="{ height: getStatusBarHeight() + 'px' }"></view>
    <view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
      <view>蜜源</view>
    </view>
    
    <view class="map-box" id="map-container"></view>
    
    <view class="my-bee-title">
      <view>推荐蜜源</view>
      <image src="/static/images/我的蜂箱logo.png" mode="" class="title-image"></image>
    </view>
    <view class="bee-list-box" v-for="item in 3">
      <view class="bee-item-img"></view>
      <view class="bee-item-title">
        <text>蜜源名称</text>
        <view>xxx详情地址</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '../../utils/system';
import BeeTabbarVue from '../../components/BeeTabbar.vue';
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'

// 成都的经纬度坐标
const chengduCoords = [30.5728, 104.0668];

onMounted(() => {
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = '';
  document.head.appendChild(link);

 
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
  script.crossOrigin = '';
  script.onload = initMap;
  document.head.appendChild(script);
});

const initMap = () => {
  // 检查Leaflet是否已加载
  if (typeof L === 'undefined') {
    console.error('Leaflet library not loaded');
    return;
  }

  // 创建地图实例（
  const map = L.map('map-container', {
    center: chengduCoords,
    zoom: 12,
    zoomControl: false,      // 禁用缩放控件
    attributionControl: false // 禁用属性控件（水印）
  });

  // 高德地图瓦片图层配置
  const gaodeLayer = L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', {
    subdomains: ['1', '2', '3', '4'],
    detectRetina: true
  });
  
  // 添加高德地图底图
  gaodeLayer.addTo(map);
  
  // 坐标转换函数（简化的WGS84转GCJ-02）
  const transformToGCJ02 = (wgsLat, wgsLng) => {
    return [wgsLat + 0.006, wgsLng + 0.0065];
  };
  
  // 转换成都坐标到GCJ-02
  const chengduGCJ = transformToGCJ02(...chengduCoords);
  
  // 自定义标记图标
  const honeyIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
  
  // 添加主标记点
  L.marker(chengduGCJ, { icon: honeyIcon })
    .addTo(map)
    // .bindPopup()
    .openPopup();
  
  // 添加更多蜜源标记点
  const honeySources = [
    { name: '蜜源1', coords: [30.5828, 104.0568] },
    { name: '蜜源2', coords: [30.5628, 104.0768] },
    { name: '蜜源3', coords: [30.5928, 104.0668] }
  ];
  
  honeySources.forEach(source => {
    const gcjCoords = transformToGCJ02(...source.coords);
    L.marker(gcjCoords, { icon: honeyIcon })
      .addTo(map)
      .bindPopup(source.name);
  });

};
</script>

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
    
    // 隐藏Leaflet控件容器
    :deep(.leaflet-control-container) {
      display: none !important;
    }
    
    #map-container {
      width: 100%;
      height: 100%;
    }
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
        font-size: 16rpx;
        color:#ddd;
      }
    }
  }
}
</style>