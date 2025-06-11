
<template>
  <view> 
    <BeeTabbarVue active-tab="monitorPage"></BeeTabbarVue>
    <uni-popup ref="popup" type="center">
		<view class="popup-content">
			<view class="popup-title">{{ currentBeeDetail.name }}</view>
		
			<view class="popup-body">{{ currentBeeDetail.mainNectarPlants }}</view>
	    <!-- <view class="popup-time">{{ formatDateTime(currentBeeDetail.establishTime) }}</view> -->
			<button class="popup-btn" @click="closePopup">我已了解</button>
		</view>
	</uni-popup>
   <view class="container">
     <image src="/static/images/homePage/homePageBg.png" mode="aspectFill" class="bg-image"></image>
     <view :style="{ height: getStatusBarHeight() + 'px' }"></view>
     <view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }"></view>
     
     
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
       <image src="/static/images/homePage/myBeeTitle.png" mode="" class="title-image"></image>
     </view>
     <view class="bee-list-center">
       <view class="bee-list-box" v-for="(item,index) in honeySourceList" :key="index" @click="showBeeDetail(item)">
       <view class="bee-item-img">
       <image :src=item.imgUrl style="width: 100%; height: 100%;"></image>
     </view>
       <view class="bee-item-title">
         <text>{{item.name}}</text>
         <view class="bee-item-address">{{item.address}}</view>
       </view>
     </view>
     </view>
   
   </view>
   <view class="tabbar-bottom"></view>
   </view>
</template>
<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '../../utils/system';
import BeeTabbarVue from '../../components/BeeTabbar.vue';
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'
import { onShow } from '@dcloudio/uni-app'

const popup = ref(null);
const loading = ref(false);
const currentBeeDetail = ref({});
const honeySourceList = ref([]);
// 移除mapInstance引用
const markers = ref([
  {
		id: 1,
		latitude: 30.6667,
		longitude: 104.0667,
		iconPath: '/static/images/homePage/marker.png',
		width: 34,
		height: 38,
		label: {
			content: '1',
			color: '#ffffff',
			anchorY: -36,
			anchorX: -12
		}
	}
])
const generateMarkers = (list) => {
  return list
    .filter(item => item.latitude && item.longitude)
    .map((item, index) => ({
      id: index,
      latitude: item.latitude,
      longitude: item.longitude,
      iconPath: '/static/images/homePage/marker.png',
      width: 34,
      height: 38,
      // label: {  // 使用label属性在图标上方显示名称
      //   content: 1,
      //   color: '#fff',
      //   fontSize: 14,
      //   anchorX: -13,
      //   anchorY: -35  // 调整位置在图标上方
      // }
    }))
}

// 获取蜜源列表
const getShoppingList = async () => {
  try {
    const res = await request({
      url: '/app-api/front/bee-farm/get/list',
      showLoading: false, 
    });
    
    if (res.code === 0 || res.code === 200) {
      honeySourceList.value = res.data || [];
      markers.value = generateMarkers(honeySourceList.value);
      loading.value = false;
    } else {
      throw new Error(res.msg || '数据异常');
    }
  } catch (err) {
    console.error('获取蜜源数据失败:', err);
    loading.value = false;
  }
};
//详情弹出框
const showBeeDetail = (item) => {
  currentBeeDetail.value = {
    ...item,
    id: item.id // 确保使用正确的ID字段
  };
  popup.value.open();
};
// 关闭弹窗
const closePopup = () => {
  popup.value.close();
};
const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}
onShow(() => {
  getShoppingList();
});
</script>


<style lang="scss" scoped>
.popup-content {
	width: 600rpx;
	background: #fff;
	border-radius: 24rpx;
  padding: 20rpx;
	

	.popup-title {
		font-weight: bold;
		font-size: 40rpx;
		color: #ff7f00;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.popup-time {
    
		font-weight: 400;
		font-size: 22rpx;
		color: #999999;
		text-align: right;
		margin-bottom: 40rpx;
	}

	.popup-body {
		font-weight: 400;
		font-size: 27rpx;
		color: #323232;
		line-height: 1.6;
		margin-bottom: 40rpx;
    max-height: 300rpx;
    overflow: auto;
   
	}

	.popup-btn {
		
		height: 80rpx;
		background: #ff6f0e;
		color: #fff;
		border-radius: 40rpx;
		font-size: 30rpx;
	}
}
.container {
  background-color: #f7f7f7;
  height: 100vh;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 35rpx;

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
  .bee-list-center{
    flex: 1;

    overflow: auto;
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
  
}

.map-container {
  margin: 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 10rpx;
  overflow: hidden;
}
</style>