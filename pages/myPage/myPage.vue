<template>
	<view>
		<BeeTabbarVue active-tab="myPage"></BeeTabbarVue>
	<view class="container">
		<image src="/static/images/myPapeImages/Rectangle 34625693@2x.png" mode="" class="bg-image"></image>
		<view :style="{ height: getStatusBarHeight() + 'px' }"></view>
		<view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
			<image src="/static/images/logo.png" class="logo-image" mode="aspectFill"></image>
		</view>
		<scroll-view scroll-y="true" class="scroll-content">
			<view class="my-info-card">
				<view class="avatar-content">
					<view class="avatar-view">
						<image :src="userInfo.avatar" mode="" class="avatar-image"></image>
						<image 
						v-if="userInfo.gender == 1" 
						src="/static/images/myPapeImages/Group 1000008640@2x.png" 
						mode="" 
						class="sex-image">
						</image>
						<image 
						v-else-if="userInfo.gender == 0" 
						src="/static/images/myPapeImages/Group 1000009029.png" 
						mode="" 
						class="sex-image">
						</image>
					</view>
					<view class="name-content"  >
						<text class="name-text">{{userInfo.nickname||'暂未登陆' }}</text>
						<text class="id-text" v-if="userInfo.id">ID:{{ userInfo.id || '' }}</text>
					</view>
					
				</view>
				<view class="app-info">
					<view class="info-left">
						<text class="name-text">蜜友汇</text>
						<text class="id">{{ userInfo.weId }}</text>
					</view>
					<button class="share-btn" open-type="share"><image  src="/static/images/myPapeImages/Group 1000007328@2x.png" class="btn" mode=""></image></button>
				</view>
			</view>
			<view class="commission-card">
				<view class="card-item" @click="gotoCommission">
					<image class="item-bg" src="/static/images/myPapeImages/Group 1000009077@2x (2).png" mode=""></image>
					<text class="amount">{{ commissionData.todaySEarnings||0 }}</text>
					<text class="commission-text">今日佣金</text>
				</view>
				<view class="card-item" @click="gotoCommission">
					<image class="item-bg" src="/static/images/myPapeImages/Group 1000009077@2x (2).png" mode=""></image>
					<text class="amount">{{ commissionData.cumulativeEarnings||0 }}</text>
					<text class="commission-text">累计佣金</text>
				</view>
			</view>
			<view class="assets-total">
				<view class="assets-item" @click="gotoWithdraw">
					<view class="item-left">
						<text class="amount">{{ walletData.balance }}</text>
						<text class="text">现金</text>
					</view>
					<view class="item-right">
						<image src="/static/images/myPapeImages/使用工具生成图片 (1) 1@2x.png" mode="" class="amount-image"></image>
						<image src="/static/images/myPapeImages/Ellipse 1836@2x.png" mode="" class="icon"></image>
					</view>
				</view>
				<view class="assets-item" @click="gotoWithdraw">
					<view class="item-left">
						<text class="amount">{{ walletData.coin ||0 }}</text>
						<text class="text">M币</text>
					</view>
					<view class="item-right">
						<image src="/static/images/myPapeImages/使用工具生成图片 3@2x.png" mode="" class="amount-image"></image>
						<image src="/static/images/myPapeImages/Ellipse 1836@2x.png" mode="" class="icon"></image>
					</view>
				</view>
			</view>
			<view class="menu-content">
				<view @click="gotAdoptionRecords"  class="menu-item">
					<image src="/static/images/myPapeImages/Frame@2x.png" class="menu-icon" mode=""></image>
					<text class="menu-text">认养记录</text>
				</view>
				<view @click="gotoOrderList"  class="menu-item">
					<image src="/static/images/myPapeImages/Frame@2x(1).png" class="menu-icon" mode=""></image>
					<text class="menu-text">订单列表</text>
				</view>

				<view @click="gotoBeeFarmerJion"   class="menu-item">
					<image src="/static/images/myPapeImages/Frame@2x(2).png" class="menu-icon" mode=""></image>
					<text class="menu-text">蜂农入住</text>
				</view>
				<view @click="gotoSmartBee"  class="menu-item">
					<image src="/static/images/myPapeImages/Frame@2x(3).png" class="menu-icon" mode=""></image>
					<text class="menu-text">智能养蜂</text>
				</view>
			</view>
			
			<view class="list-content">
				<view @click="gotoCommission"  class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPapeImages/Frame@2x(4).png" mode=""></image>
						<text class="text">邀请有礼</text>
					</view>
					<image class="btn" src="/static/images/myPapeImages/向右箭头.png" mode=""></image>
				</view>
				<view @click="gotoMessagePage" class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPapeImages/Frame@2x (2).png" mode=""></image>
						<text class="text">消息</text>
					</view>
					<image class="btn" src="/static/images/myPapeImages/向右箭头.png" mode=""></image>
				</view>
				<view @click="gotoSurveyList"  class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPapeImages/纸飞机_发布.png" mode=""></image>
						<text class="text">问卷调查</text>
					</view>
					<image class="btn" src="/static/images/myPapeImages/向右箭头.png" mode=""></image>
				</view>
				<button open-type="contact" class="list-item contact-btn">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPapeImages/Frame@2x(5).png" mode=""></image>
						<text class="text">联系客服</text>
					</view>
					<image class="btn" src="/static/images/myPapeImages/向右箭头.png" mode=""></image>
				</button>
				<view @click="gotoUserInfo"  class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPapeImages/Frame@2x(6).png" mode=""></image>
						<text class="text" >设置</text>
					</view>
					<image class="btn" src="/static/images/myPapeImages/向右箭头.png" mode=""></image>
				</view>
			</view>
		</scroll-view>
		<view class="tabbar-bottom"></view>
	</view>
	</view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '../../utils/system'
import { useTokenStorage } from '../../utils/storage'
import BeeTabbarVue from '../../components/BeeTabbar.vue'
import {ref,onMounted,} from 'vue'
import { onShow } from '@dcloudio/uni-app'
const { token, getToken } = useTokenStorage()
import { request } from '@/utils/request'

const userInfo = ref({})
const walletData = ref({})
const commissionData = ref({})

onShow(() => {
  if (getToken()) {
    getMyInfo()
	getCommissionDetail()
	getWalletInfo()
  }
})

onMounted(() => {
  if (!getToken()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        } 
      }
    })
  } 
})



// 跳转佣金详情
const gotoCommission = () => {
	if (!getToken()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        } 
      }
    })
  } else{
	uni.navigateTo({
    url: '/pages/commissionDetail/commissionDetail'
  })
  }

  
}
// 跳转提现
const gotoWithdraw = () => {
	if (!getToken()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        } 
      }
    })
  } else{
	uni.navigateTo({
    url: '/pages/withdraw/withdraw',
    success: (res) => {
      res.eventChannel.emit('walletData', walletData.value)
    }
  })
  }
 
 
}


// 跳转认养记录
const gotAdoptionRecords = () => {
	if (!getToken()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
	}else{
		uni.navigateTo({
    url: '/pages/adoptionRecords/adoptionRecords'
  })
	}	
}
// 跳转订单列表
const gotoOrderList = () => {
	if (!getToken()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
	}else{
		uni.navigateTo({
    url: '/pages/orderList/orderList'
  })
	}
}
// 跳转蜂农入住
const gotoBeeFarmerJion = () => {
    if (!getToken()) {
        uni.showModal({
            title: '提示',
            content: '请先登录',
            success: (res) => {
                if (res.confirm) {
                    uni.navigateTo({ url: '/pages/login/login' })
                }
            }
        })
    } else {
        if (userInfo.value.isBeefarmer) {
            uni.navigateTo({
                url: '/pages/deviceManagement/deviceManagement'
            })
        } else {
            uni.navigateTo({
                url: '/pages/beeFarmerJion/beeFarmerJion'
            })
        }
    }
}
// 跳转智能养蜂
const gotoSmartBee = () => {
	if (!getToken()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
	}else{
		uni.navigateTo({
    url: '/pages/smartBee/smartBee'
  })
	}
}
// 跳转消息
const gotoMessagePage = () => {
	if (!getToken()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
	}else{
		uni.navigateTo({
    url: '/pages/messagePage/messagePage'
  })
	}
}
// 跳转问卷调查
const gotoSurveyList = () => {
	if (!getToken()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
	}else{
		uni.navigateTo({
    url: '/pages/surveyList/surveyList'
  })
	}
}
// 跳转用户信息
const gotoUserInfo = () => {
	if (!getToken()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
	}else{
		uni.navigateTo({
    url: '/pages/userInfo/userInfo'
  })
	}
}

// 获取佣金详情
const getCommissionDetail = async () => {
	try {
    const res = await request({
      url: '/app-api/weixin/distribution/get/commission/info',
      showLoading: true, 
      header: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    
    if (res.code === 0 || res.code === 200) {
     commissionData.value=res.data || {};
      
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
   
  }
}
// 获取钱包信息
const getWalletInfo = async () => {
	try {
    const res = await request({
      url: '/app-api/WeiXinMini/wallet/get/Info',
      showLoading: true, 
      header: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    
    if (res.code === 0 || res.code === 200) {
     walletData.value = res.data || {};
   
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
   
  }
}
// 获取用户信息
const getMyInfo = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/user/get/myInfo',
      showLoading: true, 
      header: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    
    if (res.code === 0 || res.code === 200) {
     userInfo.value = res.data || {};
      
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
   
  }
}



</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	position: relative;
	.bg-image {
		position: absolute;
		width: 750rpx;
		height: 292rpx;
	}
	.title-bar {
		.logo-image {
			width: 205rpx;
			height: 70rpx;
			margin-left: 40rpx;
		}
	}
	.scroll-content {
		flex: 1;
		height: 300rpx;
		margin-top: 20rpx;
		.my-info-card {
			margin: auto;
			width: 690rpx;
			height: 308rpx;
			background: linear-gradient(203deg, #e7b597 0%, #f2ece6  100%);
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			border: 1rpx solid #ffffff;
			.avatar-content {
				padding-top: 24rpx;
				display: flex;
				.avatar-view {
					margin-left: 50rpx;
					width: 140rpx;
					height: 140rpx;
					border-radius: 140rpx;
					border: 2rpx solid #fff;
					position: relative;
					display: flex;
					.avatar-image {
						width: 136rpx;
						height: 136rpx;
						border-radius: 140rpx;
					}
					.sex-image {
						right: 2rpx;
						bottom: 2rpx;
						position: absolute;
						width: 40rpx;
						height: 40rpx;
						border-radius: 32rpx;
						border: 2rpx solid #fff;
					}
				}
				.name-content {
					margin-top: 26rpx;
					margin-left: 30rpx;
					display: flex;
					flex-direction: column;
					.name-text {
						font-weight: bold;
						font-size: 46rpx;
						color: #010022;
						line-height: 38rpx;
					}
					.id-text {
						margin-top: 10rpx;
						font-size: 24rpx;
						color: #010022;
						line-height: 38rpx;
					}
				}
			}
			.app-info {
				margin-top: 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 40rpx 0 30rpx;

				.info-left {
					display: flex;
					flex-direction: column;
					.name-text {
						font-weight: 500;
						font-size: 32rpx;
						color: #010022;
						line-height: 34rpx;
					}
					.id {
						margin-top: 14rpx;
						font-weight: bold;
						font-size: 30rpx;
						color: #ff7f00;
						line-height: 34rpx;
					}
				}
				.share-btn{
					margin: 0;
					margin-top: 20rpx;
					padding: 0;
					background: transparent;
					width: 60rpx;
					height: 60rpx;
				}
				.btn {
					width: 60rpx;
					height: 60rpx;
				}
			}
		}
		.commission-card {
			margin: auto;
			margin-top: 24rpx;
			height: 144rpx;
			width: 690rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: relative;
			
			.card-item {
				width: 336rpx;
				height: 144rpx;
				display: flex;
				flex-direction: column;
				position: relative;
				.item-bg{
					position: absolute;
					width: 336rpx;
					height: 144rpx;
					z-index: -1;
				}
				.amount {
					margin-top: 24rpx;
					margin-left: 42rpx;
					font-weight: 800;
					font-size: 42rpx;
					color: #fff7d6;
				}
				.commission-text {
					margin-top: 2rpx;
					margin-left: 42rpx;
					font-weight: 500;
					font-size: 24rpx;
					color: #fff7d6;
				}
			}
		}
		.assets-total {
			width: 690rpx;
			display: flex;
			justify-content: space-between;
			margin: auto;
			margin-top: 32rpx;
			.assets-item {
				padding: 16rpx 32rpx 0 28rpx;
				width: 338rpx;
				height: 120rpx;
				background: #ffeddd;
				box-shadow: 1rpx 6rpx 24rpx 0rpx rgba(0, 0, 0, 0.06);
				border-radius: 16rpx;
				display: flex;
				justify-content: space-between;
				.item-left {
					display: flex;
					flex-direction: column;
					.amount {
						font-weight: 800;
						font-size: 32rpx;
						color: #411a0a;
						line-height: 48rpx;
					}
					.text {
						line-height: 34rpx;
						margin-top: 4rpx;
						font-weight: 400;
						font-size: 22rpx;
						color: #2d2d2d;
					}
				}
				.item-right {
					display: flex;
					flex-direction: column;
					align-items: center;
					.amount-image {
						width: 74rpx;
						height: 78rpx;
					}
					.icon {
						margin-top: 6rpx;
						width: 50rpx;
						height: 7rpx;
					}
				}
			}
		}
		.menu-content {
			margin: auto;
			margin-top: 30rpx;
			width: 690rpx;
			height: 142rpx;
			background: #ffffff;
			box-shadow: 1rpx 6rpx 24rpx 0rpx rgba(0, 0, 0, 0.06);
			border-radius: 16rpx;
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			.menu-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.menu-icon {
					width: 48rpx;
					height: 48rpx;
				}
				.menu-text {
					margin-top: 10rpx;
					font-weight: 400;
					font-size: 24rpx;
					color: #000000;
				}
			}
		}
		.list-content {
			width: 690rpx;
			height: 378rpx;
			background: #ffffff;
			box-shadow: 1rpx 6rpx 24rpx 0rpx rgba(0, 0, 0, 0.06);
			border-radius: 16rpx;
			margin: auto;
			margin-top: 30rpx;
			display: flex;
			flex-direction: column;
			.list-item {
				padding: 0 24rpx;
				display: flex;
				flex: 1;
				align-items: center;
				justify-content: space-between;
				.item-left {
					display: flex;
					.item-icon {
						width: 40rpx;
						height: 40rpx;
					}
					.text {
						margin-left: 12rpx;
						font-size: 28rpx;
						color: #4c3f30;
					}
				}
				.btn {
					width: 27rpx;
					height: 27rpx;
				}
			}
			.contact-btn{
				margin: 0;
				background: #fff;
				.item-left{
					display: flex;
					align-items: center;
				}
			}
		}
	}
}
</style>
