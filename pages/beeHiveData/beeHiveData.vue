<template>
	<view>
		<TransNavVue title="蜂场数据"/>
	<view class="container">
		<image src="/static/images/homePage/homePageBg.png" mode="" class="bg-image"></image>
		
		<view class="data-panel">
			<image class="panel-bg" src="/static/images/homePage/data-bg.png" mode=""></image>
			<view class="data-content">
				<view class="data-item" v-for="(value, key) in dataList"  :key="key">
					<view class="title" v-if="key!= 'nectarSourceArea'">
						<text class="title-text">{{ dataMap[key].text }} </text>
						<image :src="dataMap[key].icon" mode="aspectFill" class="data-icon"></image>
					</view>
					<view class="data-value" v-if="key!= 'nectarSourceArea'">
						<text class="value">{{ value }}</text>
						{{ dataMap[key].unit }}
					</view>
				</view>
			</view>
		</view>
		<view class="bee-bar">
			<image src="/static/images/homePage/honeySourceBg.png" class="bar-bg"></image>
			<view class="bar-content">
				<view class="bar-left">
					<image src="/static/images/homePage/honeySourceIcon.png" mode="" class="bee-image"></image>
					<view class="bar-title">
						<text>极蜜部落专属认证蜂场面积</text>
						<view class="title-bt">
							<image src="/static/images/homePage/diamond.png" mode="" class="icon"></image>
							<text class="text" style='font-size: 8px;'>优质蜂源</text>
						</view>
					</view>
				</view>
				<view class="bar-right">
						{{dataList.nectarSourceArea || '0'}}
					<text class="unit">亩</text>
				</view>
			</view>
		</view>
		<view class="map-content">
			
			<map 
			class="map-view"
            id="map" 
            :latitude="userLocation.latitude"
            :longitude="userLocation.longitude"
            :markers="markers"
            :scale="12"
        
          ></map>
		</view>
		<view class="safe-view"></view>
	</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TransNavVue from '../../components/TransNav.vue';
import { request } from '@/utils/request'

// 假设用户位置 
const userLocation = ref({
	latitude: 30.5728, 
    longitude: 104.0668 

});
const dataMap = ref({
	countryNumber: {
		text: '蜂场',
		icon: '/static/images/homePage/countryIcon.png',
		unit: '/个'
	},
	adoptionAmount: {
		text: '领养量',
		icon: '/static/images/homePage/outputIcon.png',
		unit: '/箱'
	},
	outputAmount: {
		text: '产量',
		icon: '/static/images/homePage/adoptIcon.png',
		unit: '/万斤'
	},
	beeNumber: {
		text: '数量',
		icon: '/static/images/homePage/beeIcon.png',
		unit: '/箱'
	},
	attendanceRate: {
		text: '出勤',
		icon: '/static/images/homePage/beeIcon.png',
		unit: '/万次'
	},
	userAmount: {
		text: '用户量',
		icon: '/static/images/homePage/uesrIcon.png',
		unit: '/人'
	}
});
const dataList = ref({});

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
      uni.showToast({
        title: '获取位置失败，将无法显示附近蜜源',
        icon: 'none'
      });

    }
  });
};
// 获取用户附近的蜂场列表
const getBeeFarmList = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/location/get/beeFarm/range',
      method: 'post',
      data: {
        latitude: userLocation.value.latitude,
        longitude: userLocation.value.longitude,
   
      },
      showLoading: true, 
    });
    
    if (res.code === 0) {
      addBeeFarmMarkers(res.data);
    } else {
      throw new Error(res.msg || '数据异常');
    }
  } catch (err) {
    console.error('获取蜂场数据失败:', err);
  
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


//获取蜂场更多数据
const getInfoData = async () => {
  try {
    const res = await request({
      url: '/app-api/WeiXinMini/index/get/info',
      showLoading: true, 
    })
    if (res.code === 0 ) {
    dataList.value=res.data
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取蜂场数据失败:', err)
   
  }
}
onShow(() => {
  getInfoData()
  getUserLocation();
})
</script>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	height: 100vh;
	padding-bottom: 20rpx;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;

	.bg-image {
		width: 100%;
		height: 548rpx;
		position: absolute;
		z-index: -1;
	}
	.data-panel {
		margin: 0 auto;
		margin-top: 18rpx;
		width: 702rpx;
		height: 350rpx;
		position: relative;
		z-index: 1;
		.panel-bg {
			height: 100%;
			width: 100%;
			position: absolute;
			z-index: -1;
		}
		.data-content {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			.data-item {
				padding: 30rpx;
				border-bottom: 2rpx solid #f6f6f6;
				border-right: 2rpx solid #f6f6f6;
				height: 175rpx;
				&:nth-child(3n) {
					border-right: 0;
				}
				&:nth-child(n + 4) {
					border-bottom: 0;
				}
				.title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.title-text {
						font-weight: 500;
						font-size: 32rpx;
						color: #666666;
					}
					.data-icon {
						width: 58rpx;
						height: 58rpx;
					}
				}
				.data-value {
					margin-top: 16rpx;
					font-weight: 500;
					font-size: 20rpx;
					color: #999999;
					.value {
						font-weight: bold;
						font-size: 36rpx;
						color: #010022;
					}
				}
			}
		}
	}
	.bee-bar {
		margin: 6rpx 0;
		height: 158rpx;
		width: 750rpx;
		display: flex;
		position: relative;
		z-index: 1;

		.bar-bg {
			position: absolute;
			height: 158rpx;
			width: 750rpx;
			z-index: -1;
		}
		.bar-content {
			width: 100%;
			padding: 40rpx 48rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.bar-left {
				display: flex;

				.bee-image {
					width: 76rpx;
					height: 76rpx;
				}
				.bar-title {
					background: linear-gradient(181deg, #fff6d1 0%, #ffffff 100%);
					-webkit-background-clip: text;
					color: transparent;
					margin-left: 24rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 29rpx;
					.title-bt {
						width: 140rpx;
						height: 26rpx;
						background: linear-gradient(275deg, #fff6d1 0%, #ffffff 100%);
						border-radius: 23rpx;
						display: flex;
						align-items: center;
						padding: 0 10rpx;

						.icon {
							width: 18rpx;
							height: 18rpx;
						}
						.text {
						
							margin-left: 4rpx;
							font-weight: 500;
							font-size: 16rpx;
							background: linear-gradient(356deg, #49433c 0%, #756c61 100%);
							-webkit-background-clip: text;
						}
					}
				}
			}
			.bar-right {
				margin-bottom: 6rpx;
				font-weight: bold;
				font-size: 32rpx;
				color: #fffefc;
				line-height: 48rpx;
				.unit {
					font-weight: 500;
					font-size: 24rpx;
					color: #99927f;
					line-height: 48rpx;
				}
			}
		}
	}
	.map-content {
		flex: 1;
		height: 200rpx;
		padding: 0 30rpx;
		
		.map-view {
			border: 5rpx solid #fff;
			height: 100%;
			width: 100%;
		}
	}
}
</style>
