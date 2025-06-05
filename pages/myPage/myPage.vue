<template>
	<view>
		<BeeTabbarVue active-tab="myPage"></BeeTabbarVue>
	<view class="container">
		<image src="/static/images/myPage/myPageTopBg.png" mode="" class="bg-image"></image>
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
						src="/static/images/myPage/wamanIcon.png" 
						mode="" 
						class="sex-image">
						</image>
						<image 
						v-else-if="userInfo.gender == 0" 
						src="/static/images/myPage/manIcon.png" 
						mode="" 
						class="sex-image">
						</image>
					</view>
					<view class="name-content">
  <text class="name-text" :class="{'unlogin-text': !getAccessToken()}">{{userInfo.nickname||'请先登陆' }}</text>
  <text class="id-text" v-if="userInfo.id">ID:{{ userInfo.id || '' }}</text>
</view>
					
				</view>
				<view class="app-info">
					<view class="info-left">
						<text class="name-text">蜜友汇</text>
						<text class="id">{{ userInfo.weId }}</text>
					</view>
					<button 
                            class="share-btn" 
                            open-type="share" 
                            @click="handleClickShare"
                        >
                            <image src="/static/images/myPage/shareIcon.png" class="btn" mode=""></image>
                        </button>
				</view>
			</view>
			<view class="commission-card">
				<view class="card-item" @click="gotoCommission">
					<image class="item-bg" src="/static/images/myPage/commissionBg.png" mode=""></image>
					<text class="amount">{{ commissionData.todaySEarnings||0 }}</text>
					<text class="commission-text">今日佣金</text>
				</view>
				<view class="card-item" @click="gotoCommission">
					<image class="item-bg" src="/static/images/myPage/commissionBg.png" mode=""></image>
					<text class="amount">{{ commissionData.cumulativeEarnings||0 }}</text>
					<text class="commission-text">累计佣金</text>
				</view>
			</view>
			<view class="assets-total">
				<view class="assets-item" @click="gotoWithdraw">
					<view class="item-left">
						<text class="amount">{{ walletData.balance||0 }}</text>
						<text class="text">现金</text>
					</view>
					<view class="item-right">
						<image src="/static/images/myPage/cashIcon.png" mode="" class="amount-image"></image>
						<image src="/static/images/myPage/ellipse.png" mode="" class="icon"></image>
					</view>
				</view>
				<view class="assets-item" @click="gotoWithdraw">
					<view class="item-left">
						<text class="amount">{{ walletData.coin ||0 }}</text>
						<text class="text">M币</text>
					</view>
					<view class="item-right">
						<image src="/static/images/myPage/MIcon.png" mode="" class="amount-image"></image>
						<image src="/static/images/myPage/ellipse.png" mode="" class="icon"></image>
					</view>
				</view>
			</view>
			<view class="menu-content">
				<view @click="gotAdoptionRecords"  class="menu-item">
					<image src="/static/images/myPage/adoptIcon.png" class="menu-icon" mode=""></image>
					<text class="menu-text">认养记录</text>
				</view>
				<view @click="gotoOrderList"  class="menu-item">
					<image src="/static/images/myPage/orderIcon.png" class="menu-icon" mode=""></image>
					<text class="menu-text">订单列表</text>
				</view>

				<view @click="gotoBeeFarmerJion"   class="menu-item">
					<image src="/static/images/myPage/beeEnterIcon.png" class="menu-icon" mode=""></image>
					<text class="menu-text">蜂农入住</text>
				</view>
				<view @click="gotoSmartBee"  class="menu-item">
					<image src="/static/images/myPage/intelligenceIcon.png" class="menu-icon" mode=""></image>
					<text class="menu-text">智能养蜂</text>
				</view>
			</view>
			
			<view class="list-content">
				<view @click="gotoCommission"  class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPage/invitationIcon.png" mode=""></image>
						<text class="text">邀请有礼</text>
					</view>
					<image class="btn" src="/static/images/rightBtn.png" mode=""></image>
				</view>
				<view @click="gotoMessagePage" class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPage/messageIcon.png" mode=""></image>
						<text class="text">消息</text>
					</view>
					<image class="btn" src="/static/images/rightBtn.png" mode=""></image>
				</view>
				<view @click="gotoSurveyList"  class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPage/surveyIcon.png" mode=""></image>
						<text class="text">问卷调查</text>
					</view>
					<image class="btn" src="/static/images/rightBtn.png" mode=""></image>
				</view>
			
				<view @click="gotoCustomerService"  class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPage/serviceIcon.png" mode=""></image>
						<text class="text">联系客服</text>
					</view>
					<image class="btn" src="/static/images/rightBtn.png" mode=""></image>
				</view>
				<view @click="gotoUserInfo"  class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPage/settingIcon.png" mode=""></image>
						<text class="text" >设置</text>
					</view>
					<image class="btn" src="/static/images/rightBtn.png" mode=""></image>
				</view>
				<view @click="logout" class="list-item">
				  <view class="item-left">
				    <image class="item-icon" src="/static/images/myPage/settingIcon.png" mode=""></image>
				    <text class="text">注销登录</text>
				  </view>
				
				</view>
			</view>
		</scroll-view>
		<view class="tabbar-bottom"></view>
	</view>
	</view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '../../utils/system'

import BeeTabbarVue from '../../components/BeeTabbar.vue'
import {ref,onMounted,} from 'vue'
import { onShow ,onShareAppMessage} from '@dcloudio/uni-app'
import { useTokenStorage } from '../../utils/storage'
const {  getAccessToken ,getOpenId} = useTokenStorage()
import { request } from '@/utils/request'

const userInfo = ref({})
const walletData = ref({})
const commissionData = ref({})
const shareConfig = ref({
  title: '智慧养蜂，快来领养吧', 
  imageUrl: '/static/images/myPage/Invitation.png', 
  path: '/pages/myPage/myPage' 
})

// 点击分享按钮时执行的函数
const handleClickShare = (e) => {
  // 可以在这里添加点击按钮后的额外逻辑，如记录点击事件
  console.log('分享按钮被点击')
  
  // 如果用户未登录，可以在这里处理登录逻辑
  if (!getAccessToken()) {
    e.stopPropagation() // 阻止默认分享行为
    uni.showModal({
      title: '提示',
      content: '请先登录再分享',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
  }
  // 如果已登录，则不阻止，让 onShareAppMessage 处理实际分享逻辑
}

// 注册全局分享钩子
onShareAppMessage(() => {
  // 这里只处理已登录用户的分享配置
  if (!getAccessToken()) {
    return false // 阻止未登录用户的分享
  }
  
  return {
    title: shareConfig.value.title,
    imageUrl: shareConfig.value.imageUrl,
    path: shareConfig.value.path,
    success: () => {
      console.log('分享成功')
      uni.showToast({
        title: '分享成功',
        icon: 'success'
      })
    },
    fail: (err) => {
      console.error('分享失败:', err)
      uni.showToast({
        title: '分享失败',
        icon: 'none'
      })
    }
  }
})













onShow(() => {
  if (!getAccessToken()) {
    uni.showModal({
      title: '提示',
      content: '您尚未登录，请先登录',
      confirmText: '去登录',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    })
  } else {
	
    getMyInfo()
    getCommissionDetail()
    getWalletInfo()
  }
})



//跳转到客服服务
const gotoCustomerService = () => {
  if (!getAccessToken()) {
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
    uni.navigateTo({
      url: '/pages/customerService/customerService'
    })
  }
}

// 跳转佣金详情
const gotoCommission = () => {
	if (!getAccessToken()) {
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
	if (!getAccessToken()) {
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
	if (!getAccessToken()) {
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
	if (!getAccessToken()) {
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
    if (!getAccessToken()) {
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
	if (!getAccessToken()) {
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
	if (!getAccessToken()) {
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
	if (!getAccessToken()) {
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
	if (!getAccessToken()) {
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
//退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要注销登录吗？',
    success: (res) => {
      if (res.confirm) {
        const { clearToken } = useTokenStorage()
        clearToken()
        userInfo.value = {}
        walletData.value = {}
        commissionData.value = {}
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}


</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	padding-bottom: 35rpx;
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
					.unlogin-text {
  color: red;
  font-size: 12px;
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



