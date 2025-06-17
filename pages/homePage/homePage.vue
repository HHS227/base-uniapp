<template>
	<view>
	<BeeTabbarVue></BeeTabbarVue>
	<view class="container">
		<image src="/static/images/homePage/homePageBg.png" mode="aspectFill" class="bg-image"></image>
		<view :style="{ height: getStatusBarHeight() + 'px' }"></view>
		<view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
			<image src="/static/images/logo.png" class="logo-image" mode="aspectFill"></image>
		</view>
		<scroll-view scroll-y="true" class="scroll-view">
			<view class="swiper-content">
				<swiper class="swiper" circular indicator-active-color="#ffffff" indicator-dots="true" autoplay="true" interval="2000" duration="500">
					<swiper-item class="swiper-item" v-for="(item,index) in swiperList" :key="index">
						<image :src=item.url class="swiper-image" mode="" @click="activeBtn(item)"></image>
					</swiper-item>
				
				</swiper>
			</view>
			<view class="bee-farm-data">
				<image src="/static/images/homePage/dataBg.png" class="bee-farm-image" mode="aspectFill"></image>
				<view class="data-title">
					<view class="title-right">
						<view>极蜜智慧蜂场</view>
						<image src="/static/images/homePage/beeDataTitle.png" mode="" class="title-image"></image>
					</view>
					<view class="title-left">
						<image src="/static/images/homePage/moreBtn.png" mode="" class="title-btn" @click="gotoHiveData"></image>
					</view>
				</view>
				<view class="data-list">
					<view class="data-item">
						<image src="/static/images/homePage/dataListOne.png" mode="" class="data-bg"></image>
						<view class="data-item-title">蜂场</view>
						<view class="data-item-text">
							{{infoData.countryNumber}}
							<text>/个</text>
						</view>
					</view>
					<view class="data-item">
						<image src="/static/images/homePage/dataListTwo.png" mode="" class="data-bg"></image>
						<view class="data-item-title">产量</view>
						<view class="data-item-text">
							{{infoData.outputAmount}}
							<text>/斤</text>
						</view>
					</view>
					<view class="data-item">
						<image src="/static/images/homePage/dataListThree.png" mode="" class="data-bg"></image>
						<view class="data-item-title">蜂群数量</view>
						<view class="data-item-text">
							{{infoData.beeNumber}}
							<text>/群</text>
						</view>
					</view>
					<view class="data-item">
						<image src="/static/images/homePage/dataListFour.png" mode="" class="data-bg"></image>
						<view class="data-item-title">被认养</view>
						<view class="data-item-text">
							{{infoData.adoptionAmount}}
							<text>/箱</text>
						</view>
					</view>
				</view>
			</view>
			<view class="scan-content">
				<image @click="scanCode" src="/static/images/homePage/scanBg.png" mode="" class="scan-image"></image>
			</view>
			<view class="my-bee-box">
				<view class="my-bee-title">
					<view>我的蜂箱</view>
					<image src="/static/images/homePage/myBeeTitle.png" mode="" class="title-image"></image>
				</view>
				<view class="my-bee-right" @click="collectBee">
					去认养 <uni-icons type="right" size="14" color="#ff7f00"></uni-icons>
				</view>
			</view>
	
			<view v-if="dataList.length>0">
				<view class="my-bee-card" v-for='(item,index) in dataList' :key="index" @click="gotoMyBeehive(item)">
					<image src="/static/images/homePage/myBeeHiveListBg.png" mode="" class="card-bg"></image>
					<view class="card-content">
						<view class="card-top">
							<view>
								<image src="/static/images/homePage/BeehiveLogo.png" mode="" class="my-bee-icon"></image>
							</view>
							<view class="top-info">
								<view class="card-title">{{item.beehiveName}}</view>
								<view  v-if="item.adoptType == 1" class="exclusive">
									<view >{{ item.region }}</view>
									<view >{{ item.honeySeeds }}</view>
								</view>
								
								<view class="group-purchase" v-if="item.adoptType == 2">
  									<AvatarStackVue :avatars="item.avatars" :size="40"></AvatarStackVue>
  									<view class="gruop-info">还差{{item.needNumber - item.adoptNumber||0}}人</view>
								</view>
								<view class="progress-info" v-if="item.adoptType == 2">
  								<view class="progress-content">
    							<view class="progress-val" :style="{ width: `${Math.min((item.adoptNumber / item.needNumber) * 100, 100)}%` }"></view>
 								 </view>
								 {{ Math.min((item.adoptNumber / item.needNumber) * 100, 100) + '%' }}
								</view>
							</view>
						</view>
						<view class="card-bottom">
							<view class="bottom-left">
								领养类型：
								<text class="bottom-text">{{item.adoptType==1?'单独领养':'拼团'}}</text>
							</view>
							<view class="bottom-right">
								领养时间：
								<text class="bottom-text">{{formatDateTime(item.createTime)}}</text>
							</view>
						</view>
					</view>
				</view>
			
				
				
			</view>
			<view v-else class="no-bee">
				<image src="/static/images/homePage/noData.png" mode=""></image>
				<view><text>当前暂无蜂箱信息</text></view>
				<view> <button class="buy-btn" @click='collectBee'>点击领取蜂箱</button></view>
				
			</view>
		</scroll-view>
		<view class="tabbar-bottom"></view>
	</view>
	<uni-popup ref="popup" type="center">
		<view class="popup-content">
			<view class="popup-title">活动通知</view>
			
			<view class="active-list">
			
				<swiper class="swiper" circular indicator-active-color="#ffffff" indicator-dots="true" autoplay="true" interval="2000" duration="500">
					
					<swiper-item class="swiper-item" v-for="(item,index) in activities" :key="index">
						<view>{{ item.describle }}</view>
						<image :src=item.url class="swiper-image" mode="" @click="activeBtn(item)"></image>
					</swiper-item>
				
				</swiper>
				
				
			</view>
			
			<button class="popup-btn" @click="closePopup">我已了解</button>
		</view>
	</uni-popup>
	
	</view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '../../utils/system';
import AvatarStackVue from '../../components/AvatarStack.vue';
import BeeTabbarVue from '../../components/BeeTabbar.vue';
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '@/utils/request'
import { useTokenStorage } from '../../utils/storage'
import {formatDateTime}  from '../../utils/system'


const {  getAccessToken } = useTokenStorage()
const swiperList=ref([])
const infoData=ref({})
const dataList=ref([])
const popup = ref(null);
const activities = ref([])


onMounted(() => {
	getActiveList()
})
onShow(() => {
  getSwiperList()
  getInfoData()
  if (getAccessToken()) {
    getInfoDataList()
  }
})


//跳转到活动页面
const activeBtn = (item) => {
  if (item.activityId !==null) {
  	uni.navigateTo({ url: '/pages/couponPage/couponPage' })
  }	else{
	uni.navigateTo({
        url:`/pages/shoppingMall/shopDetails?id=${item.productId}`
    })
  }
}
// 关闭弹窗
const closePopup = () => {
  popup.value.close();
};

// 获取轮播图数据
const getSwiperList = async () => {
  try {
    const res = await request({
      url: '/app-api/WeiXinMini/index/get/banner',
      showLoading: true, 
    })
    if (res.code === 0 ) {
      swiperList.value = res.data || []
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('轮播图加载失败:', err)
   
  }
}
//获取活动数据
const getActiveList = async () => {
  try {
    const res = await request({
      url: '/app-api/WeiXinMini/index/get/activity',
      showLoading: true, 
    })
    if (res.code === 0 ) {
      activities.value = res.data || []
	  popup.value.open();
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('轮播图加载失败:', err)
   
  }
}
//获取蜂场数据
const getInfoData = async () => {
  try {
    const res = await request({
      url: '/app-api/WeiXinMini/index/get/info',
      showLoading: true, 
    })
    if (res.code === 0 ) {
    infoData.value=res.data
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取蜂场数据失败:', err)
   
  }
}
//获取我的蜂箱列表
const getInfoDataList = async () => {
  try {
    const res = await request({
      url: '/app-api/WeiXinMini/index/get/MyBeehiveInfo',
      showLoading: true, 
	
    })
   
    if (res.code === 0 ) {
		dataList.value=res.data||[]
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } 
  catch (err) {
    console.error('获取我的蜂箱数据失败:', err)
   
  }
}


// 蜂场数据 查看更多
const gotoHiveData = () => {
	uni.navigateTo({
		url: '/pages/beeHiveData/beeHiveData'
	});
};
// 我的蜂箱点击查看详情
const gotoMyBeehive = (item) => { 
  uni.navigateTo({
    url: '/pages/myBeeHive/myBeeHive',
	success: (res) => {
      res.eventChannel.emit('itemId', {
        beeId: item.beehiveId,
        
      });
    }
  });
};
// 领取蜂箱跳转
const collectBee = () => {
  if (!getAccessToken()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
    return
  }else{
	uni.navigateTo({
    url: '/pages/collectBee/collectBee'
  });
  }
 
}

//扫码溯源
const scanCode = () => {
	uni.navigateTo({
          url: `/pages/traceabilityDetails/traceabilityDetails`,
         
        })
//   uni.scanCode({
//     success: (res) => {
//       const productId = JSON.parse(res.result).id
//       if (productId) {
//         uni.navigateTo({
//           url: `/pages/shoppingMall/shopDetails?id=${productId}`,
//           success: () => {
//             uni.showToast({
//               title: '跳转成功',
//               icon: 'success'
//             })
//           }
//         })
//       } else {
//         uni.showToast({
//           title: '未识别到商品ID',
//           icon: 'none'
//         })
//       }
//     },
//     fail: (err) => {
//       console.error('扫码失败:', err)
//       uni.showToast({
//         title: '扫码失败',
//         icon: 'none'
//       })
//     }
//   })
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	padding-bottom: 35rpx;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	height: 100vh;  // 新增：设置容器高度为视窗高度

	.bg-image {
		width: 100%;
		height: 374rpx;
		position: fixed;  // 修改：改为fixed定位
		z-index: -1;
	}
	.title-bar {
		position: sticky;  // 新增：标题栏固定
		top: 0;
		z-index: 10;
		background-color: transparent;
		.logo-image {
			width: 205rpx;
			height: 70rpx;
			margin-left: 40rpx;
		}
	}
	.scroll-view {
		flex: 1;
		overflow-y: auto;  // 确保可滚动
		
		height: 300rpx;
		.swiper-content {
			height: 340rpx;
			width: 704rpx;
			border-radius: 24rpx;
			overflow: hidden;
			margin: auto;
			margin-top: 5rpx;
			.swiper {
				width: 100%;
				height: 100%;
				.swiper-image {
					height: 100%;
					width: 100%;
				}
			}
		}
		.bee-farm-data {
			height: 464rpx;
			width: 702rpx;
			margin: auto;
			margin-top: 30rpx;
			position: relative;
			.bee-farm-image {
				height: 100%;
				width: 100%;
				position: absolute;
				z-index: -1;
			}
			.data-title {
				display: flex;
				justify-content: space-between;
				height: 76rpx;
				.title-right {
					position: relative;
					display: flex;
					view {
						margin-top: 21rpx;
						margin-left: 30rpx;
						font-weight: bold;
						font-size: 38rpx;
						color: #010022;
					}
					.title-image {
						width: 109rpx;
						height: 37rpx;
						position: absolute;
						left: 210rpx;
						top: 34rpx;
						z-index: -1;
					}

				}
				.title-btn {
					margin-top: 30rpx;
					margin-right: 30rpx;
					width: 125rpx;
					height: 46rpx;
				}
			}
			.data-list {
				margin-top: 30rpx;
				display: flex;
				padding: 0 30rpx;
				flex-wrap: wrap;
				justify-content: space-between;
				.data-item {
					display: flex;
					flex-direction: column;
					width: 310rpx;
					height: 157rpx;
					position: relative;
					margin-bottom: 20rpx;
					.data-bg {
						position: absolute;
						width: 310rpx;
						height: 157rpx;
						z-index: -1;
					}
				
					.six-imge {
						position: absolute;
						width: 98rpx;
						height: 89rpx;
						top: 5rpx;
						left: 191rpx;
					}
					.data-item-title {
						margin-top: 24rpx;
						margin-left: 24rpx;
						font-weight: 500;
						font-size: 32rpx;
						color: #010022 ;
					}
					.data-item-text {
						margin-top: 20rpx;
						margin-left: 24rpx;
						font-weight: bold;
						font-size: 38rpx;
						color: #010022;
						text {
							font-weight: 500;
							font-size: 22rpx;
							color: #999999;
						}
					}
				}
			}
		}
		.scan-content {
			width: 698rpx;
			height: 110rpx;
			margin: auto;
			margin-top: 30rpx;
			.scan-image {
				width: 698rpx;
				height: 110rpx;
			}
		}
		.my-bee-box{
			
			display: flex;
			justify-content: space-between;
			height: 76rpx;
			.my-bee-right {
				margin-top: 30rpx;
				width: 140rpx;
				height: 46rpx;
				display: flex;
				align-items: center;
				font-size: 14px;
				
			
			}
			
			
		}
		.my-bee-title {
			position: relative;
			display: flex;
		
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
		.my-bee-card {
			width: 702rpx;
			height: 290rpx;
			margin: auto;
			margin-top: 24rpx;
			position: relative;
			.card-content {
				height: 100%;
				width: 100%;
				padding: 24rpx 24rpx 23rpx;
				.card-top {
					width: 100%;
					height: 188rpx;
					border-bottom: 2rpx dashed #ebebeb;
					display: flex;
					.top-info {
						margin-left: 24rpx;
						.card-title {
							width: 446rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							
						}
						.exclusive{
							margin-top: 20rpx;
							font-size: 26rpx;
							color: #999999;
							}
						.group-purchase {
							height: 40rpx;
							margin-top: 14rpx;
							display: flex;
							align-items: center;
							.gruop-info {
								margin-left: 16rpx;
								font-weight: 400;
								font-size: 26rpx;
								color: #999999;
								line-height: 35rpx;
							}
						}
						.progress-info {
							margin-top: 24rpx;
							height: 28rpx;
							font-weight: 500;
							font-size: 20rpx;
							color: #2d2d2d;
							display: flex;
							align-items: center;
							.progress-content {
								width: 390rpx;
								background: #f7f7f7;
								height: 28rpx;
								border-radius: 28rpx;
								margin-right: 10rpx;
								.progress-val {
									background: linear-gradient(90deg, #ffa66a 0%, #ff6f0e 100%);
									height: 28rpx;
									border-radius: 28rpx;
								}
							}
						}
					}
					.my-bee-icon {
						width: 160rpx;
						height: 160rpx;
					}
				}
				.card-bottom {
					display: flex;
					justify-content: space-between;
					margin-top: 18rpx;
					font-weight: 400;
					font-size: 26rpx;
					color: #999999;
					.bottom-text {
						font-weight: 400;
						font-size: 26rpx;
						color: #666666;
					}
				}
			}
			.card-bg {
				position: absolute;
				z-index: -1;
				width: 702rpx;
				height: 290rpx;
			}
		}
		.no-bee {
			width: 702rpx;
			height: 226rpx;
			background: #ffffff;
			box-shadow: 0rpx 4rpx 16rpx 0rpx rgba(0, 0, 0, 0.03);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			margin: auto;
			margin-top: 24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			image {
				height: 120rpx;
				width: 120rpx;
				margin-top: 5rpx;
			}
			text {
				font-weight: 400;
				font-size: 24rpx;
				color: #b5b5b5;
			}
			.buy-btn {
			    width: 228rpx;
			    height: 44rpx;
			    background: #FF6F0E;
			    border-radius: 130rpx;
			    line-height: 44rpx;
			    font-weight: 500;
			    font-size: 24rpx;
			    color: #FFFFFF;
			    
			}
		}
	}
}
.popup-content {
	width: 600rpx;
	background: #fff;
	border-radius: 24rpx;
	padding: 40rpx;

	.popup-title {
		font-weight: bold;
		font-size: 40rpx;
		color: #0a0b0f;
		text-align: center;
		margin-bottom: 20rpx;
	}
	.active-list{
		max-height: 400rpx;
		overflow: auto;
		.active-item{
		
		margin-bottom: 40rpx;
	}
	}

	.popup-btn {
		margin-top: 20rpx;
		width: 100%;
		height: 80rpx;
		background: #ff6f0e;
		color: #fff;
		border-radius: 40rpx;
		font-size: 30rpx;
	}
}
</style>


