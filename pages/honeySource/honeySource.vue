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
    <view class="bee-list-box" v-for="item in honeySourceList">
      <view class="bee-item-img">
		  <image :src=item.imgUrl style="width: 100%; height: 100%;"></image>
	  </view>
      <view class="bee-item-title">
        <text>{{item.name}}</text>
        <view class="bee-item-address">{{item.address}}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '../../utils/system';
import BeeTabbarVue from '../../components/BeeTabbar.vue';
import { ref, onMounted, nextTick } from 'vue'
import { request } from '@/utils/request'

const loading = ref(false);
const honeySourceList = ref([]);
const mapInstance = ref(null);

// 成都的经纬度坐标
const chengduCoords = [30.5728, 104.0668];

onMounted(() => {
  loading.value = true;
  
  // 加载Leaflet资源
  const loadMapResources = async () => {
    return new Promise((resolve, reject) => {
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
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  };
  
  // 初始化地图
  const initMap = () => {
    // 检查Leaflet是否已加载
    if (typeof L === 'undefined') {
      console.error('Leaflet library not loaded');
      return;
    }

    // 创建地图实例
    mapInstance.value = L.map('map-container', {
      center: chengduCoords,
      zoom: 12,
      zoomControl: false,      // 禁用缩放控件
      attributionControl: false // 禁用属性控件
    });

    // 高德地图瓦片图层配置
    const gaodeLayer = L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', {
      subdomains: ['1', '2', '3', '4'],
      detectRetina: true
    });
    
    // 添加高德地图底图
    gaodeLayer.addTo(mapInstance.value);
  };
  
  // 加载资源并初始化地图
  loadMapResources()
    .then(() => {
      initMap();
      return getShoppingList();
    })
    .catch(err => {
      console.error('加载地图资源失败:', err);
      loading.value = false;
    });
});

//获取蜜源列表
const getShoppingList = async () => {
  try {
    const res = await request({
      url: '/app-api/front/bee-farm/get/list',
      showLoading: false, 
    });
    
    
    if (res.code === 0 || res.code === 200) {
      honeySourceList.value = res.data || [];
      // 等待DOM更新后再添加标记
      nextTick(() => {
        addMarkersToMap();
        loading.value = false;
      });
    } else {
      throw new Error(res.msg || '数据异常');
    }
  } catch (err) {
    console.error('获取蜜源数据失败:', err);
    loading.value = false;
  }
};

// 根据后端数据添加标记
const addMarkersToMap = () => {
  if (!mapInstance.value || !honeySourceList.value.length) return;
  
  // 自定义橙色圆点标记样式
  const orangeCircleMarker = {
    radius: 8,
    fillColor: "#FF7F50", // 橙色
    color: "#fff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  };
  
  // 添加蜜源标记点
  honeySourceList.value.forEach(item => {
    // 确保数据中有经纬度
    if (item.latitude && item.longitude) {
      // 直接使用后端返回的坐标，不进行转换
      const coords = [item.latitude, item.longitude];
      
      // 添加标记
      L.circleMarker(coords, orangeCircleMarker)
        .addTo(mapInstance.value)
        .bindPopup(`
          <div class="popup-content">
            <h3>${item.name}</h3>
            <p>${item.address}</p>
          </div>
        `);
    }
  });
  
  // 如果有数据，调整地图视图以显示所有标记
  if (honeySourceList.value.length > 0) {
    const validMarkers = honeySourceList.value
      .filter(item => item.latitude && item.longitude)
      .map(item => [item.latitude, item.longitude]);
    
    if (validMarkers.length > 0) {
      // 创建包含所有标记的边界
      const bounds = L.latLngBounds(validMarkers);
      // 调整地图视图
      mapInstance.value.fitBounds(bounds, { padding: [50, 50] });
    }
  }
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
</style>