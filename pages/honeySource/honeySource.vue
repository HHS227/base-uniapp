
  <template>
    <view> 
      <BeeTabbarVue active-tab="monitorPage"></BeeTabbarVue>
      <uni-popup ref="popup" type="center">
        <view class="popup-content">
          <view class="popup-title">{{ currentBeeDetail.name }}</view>
          <view class="popup-body">
            <view>面积:{{ currentBeeDetail.area }}</view> 
            <view>蜜源:{{ currentBeeDetail.honeySeeds }}</view> 
            <view>产区:{{ currentBeeDetail.region }}</view> 
          </view>
          <view class="popup-bottom">
            <button class="popup-btn" @click="closePopup">我已了解</button>
            <button class="popup-btn" @click="goToPayBeeFarm(currentBeeDetail.id)">去认养</button>
          </view>
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
            :latitude="userLocation.latitude"
            :longitude="userLocation.longitude"
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
import { ref } from 'vue'
import { request } from '@/utils/request'
import { onShow } from '@dcloudio/uni-app'

const popup = ref(null);
const loading = ref(true);
const currentBeeDetail = ref({});
const honeySourceList = ref([]);

// 用户位置 - 不设置默认值
const userLocation = ref({
latitude: null,
  longitude: null
});

// 地图标记点
const markers = ref([]);

// 获取用户当前位置
const getUserLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      userLocation.value = {
        latitude: res.latitude,
        longitude: res.longitude
      };
      getBeeFarmList();
    },
    fail: (err) => {
      console.error('获取位置失败:', err);
      uni.showToast({
        title: '获取位置失败，将无法显示附近蜜源',
        icon: 'none'
      });
      loading.value = false;
    }
  });
};





// 获取用户附件的蜂场列表
const getBeeFarmList = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/location/get/beeFarm/range',
      method: 'post',
      data: {
        latitude: userLocation.value.latitude,
        longitude: userLocation.value.longitude,
      },
      showLoading: false, 
    });
    
    if (res.code === 0) {
      // 添加蜂场标记点
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
  data.forEach((farm, index) => {
    if (farm.latitude && farm.longitude) {
      markers.value.push({
        id: index + 1, 
        latitude: farm.latitude,
        longitude: farm.longitude,
        width: 30,
        height: 30,
        label: {
          content: farm.name || '蜂场',
          color: '#333333',
          bgColor: '#FFD700',
          padding: 5,
          borderRadius: 3,
          anchorY: -35
        },
       
      });
    }
  });
};
// 获取蜜源列表
const getNectarList= async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/nectar/get/list',
      // data: {
      //   latitude: userLocation.value.latitude,
      //   longitude: userLocation.value.longitude
      // },
      showLoading: false, 
    });
    
    if (res.code === 0 ) {
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

//详情弹出框
const showBeeDetail = (item) => {
  currentBeeDetail.value = {
    ...item,
    id: item.id 
  };
  popup.value.open();
};

// 关闭弹窗
const closePopup = () => {
  popup.value.close();
};

//跳转到认养界面
const goToPayBeeFarm = (id) => {
  uni.navigateTo({
    url:`/pages/collectBee/payBeeFarm?id=${id}`
  })
};

onShow(() => {
  loading.value = true;
  getUserLocation();
  getNectarList()
});
</script>




<style lang="scss" scoped>
.popup-content {
	width: 600rpx;
  height: 400rpx;
	background: #fff;
	border-radius: 24rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
	

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
  .popup-bottom{
    display: flex;
    justify-content: space-between;

    
	.popup-btn {
    width: 48%;
		height: 80rpx;
		background: #ff6f0e;
		color: #fff;
		border-radius: 40rpx;
		font-size: 30rpx;
	}

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