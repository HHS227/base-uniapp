<template>
	<view>
		<BeeTabbarVue active-tab="myPage"></BeeTabbarVue>
		<view class="container">
			<view :style="{ height: getStatusBarHeight() + 'px' }"></view>
			<view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
				<image src="/static/images/logo.png" class="logo-image" mode="aspectFill"></image>
			</view>

			<scroll-view scroll-y="true" class="scroll-content">
				<view class="my-info-top">
					<view class="top-content">
						<view class="avatar-view">
							<image :src="userInfo.avatar" mode="" class="avatar-image"></image>
						</view>
						<view class="name-content">
							<text v-if="getAccessToken()" class="name-text"  >{{userInfo.nickname  }}</text>
							<text v-else class="name-text unlogin-text" @click="toLogin" >请先登录</text>
							<view class="vip-content">
								<text class="id-text" v-if="userInfo.id">ID:{{ userInfo.id || "" }}</text>
								<view class="share-box">
								<button class="share-btn" open-type="share" @click="handleClickShare">
									<image src="/static/images/myPage/shareIcon.png" class="btn" mode=""> </image>
								</button>
							
								</view>
							</view>
							
						</view>
						
					</view>
					<view class="bottom-content">
						<view>我的服务</view>
						<view class="menu-content">
							<view @click="gotAdoptionRecords" class="menu-item">
								<image src="/static/images/myPage/adoptIcon.png" class="menu-icon" mode=""></image>
								<text class="menu-text">认养记录</text>
							</view>
							<view @click="gotoOrderList" class="menu-item">
								<image src="/static/images/myPage/orderIcon.png" class="menu-icon" mode=""></image>
								<text class="menu-text">订单列表</text>
							</view>
							<view @click="gotoCommission" class="menu-item">
								<image src="/static/images/myPage/invitationIcon.png" class="menu-icon" mode=""></image>
								<text class="menu-text">邀请有礼</text>
							</view>
							<view @click="gotoBeeFarmerJion" class="menu-item">
								<image src="/static/images/myPage/beeEnterIcon.png" class="menu-icon" mode=""></image>
								<text class="menu-text">蜂农入住</text>
							</view>
						</view>
					</view>
				</view>

				<view class="my-info-center">
					<view>我的收益</view>
					<view class="commission-card">
						<view class="card-todaySEarnings card-item" @click="gotoCommission">
							<view class="amount">{{ commissionData.todaySEarnings || 0 }}</view>
							<text class="commission-text">今日佣金</text>
						</view>
						<view class="card-cumulativeEarnings card-item" @click="gotoCommission">
						
							<view class="amount">{{ commissionData.cumulativeEarnings || 0 }}</view>
							<text class="commission-text">累计佣金</text>
						</view>
						<view class="card-currentEarnings card-item" @click="gotoWithdraw">
					
							<view class="amount">{{  commissionData.currentEarnings||0  }}</view>
							<text class="commission-text">可提现金额</text>
						</view>
						<view class="card-coin card-item" @click="gotoWithdraw">
			
							<view class="amount">{{ commissionData.coin || 0 }}</view>
							<text class="commission-text">M币</text>
						</view>
					</view>

				</view>
				<view class="my-info-bottom">
					<view @click="gotoCustomerService"  class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPage/serviceIcon.png" mode=""></image>
						<text class="text"> 联系客服 </text>
					</view>
					<image class="btn" src="/static/images/rightBtn.png" mode=""></image>
					</view>
					<view @click="gotoSmartBee"  class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPage/intelligenceIcon.png" mode=""></image>
						<text class="text"> 智能养蜂 </text>
					</view>
					<image class="btn" src="/static/images/rightBtn.png" mode=""></image>
					</view>
					<view @click="gotoMessagePage"  class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPage/messageIcon.png" mode=""></image>
						<text class="text"> 我的消息 </text>
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
				<view @click="gotoUserInfo"  class="list-item">
					<view class="item-left">
						<image class="item-icon" src="/static/images/myPage/settingIcon.png" mode=""></image>
						<text class="text" >设置</text>
					</view>
					<image class="btn" src="/static/images/rightBtn.png" mode=""></image>
				</view>
				<view @click="loginOut" class="list-item">
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
import { getStatusBarHeight, getTitleBarHeight } from "../../utils/system";
import BeeTabbarVue from "../../components/BeeTabbar.vue";
import { ref } from "vue";
import { onShareAppMessage, onShow } from "@dcloudio/uni-app";
import { useTokenStorage } from "../../utils/storage";
import { request } from "@/utils/request";

const { getAccessToken, clearToken } = useTokenStorage();
const userInfo = ref({});
const commissionData = ref({});
const isBeeFarm = ref({});

// 处理登录检查和导航的公共函数
const navigateIfLoggedIn = (url) => {
	if (!getAccessToken()) {
		uni.showModal({
			title: "提示",
			content: "请先登录",
			success: (res) => {
				if (res.confirm) {
					uni.navigateTo({ url: "/pages/login/login" });
				}
			},
		});
	} else {
		uni.navigateTo({ url });
	}
};

// 点击分享按钮时执行的函数
const handleClickShare = (e) => {
	if (!getAccessToken()) {
		e.stopPropagation();
		uni.showModal({
			title: "提示",
			content: "请先登录再分享",
			success: (res) => {
				if (res.confirm) {
					uni.navigateTo({ url: "/pages/login/login" });
				}
			},
		});
	}
};
// 注册全局分享钩子
onShareAppMessage(() => {
	if (!getAccessToken()) {
		return false;
	}

	return {
		title: "智慧养蜂，快来领养吧",
		imageUrl: "/static/images/myPage/Invitation.png",
		path: `/pages/login/login?shareUserId=${userInfo.value.id}`,
		success: () => {
			uni.showToast({
				title: "分享成功",
				icon: "success",
			});
		},
		fail: (err) => {
			uni.showToast({
				title: "分享失败",
				icon: "none",
			});
		},
	};
});

//去登录
const toLogin = () => {
	uni.navigateTo({ url: "/pages/login/login" });
};

onShow(() => {
	if (!getAccessToken()) {
		uni.showModal({
			title: "提示",
			content: "您尚未登录，请先登录",
			confirmText: "去登录",
			cancelText: "取消",
			success: (res) => {
				if (res.confirm) {
					uni.navigateTo({ url: "/pages/login/login" });
				}
			},
		});
	} else {
		getMyInfo();
		getCommissionDetail();
		getIsBeeFarm();
	}
});

// 跳转佣金详情
const gotoCommission = () => {
	if (!getAccessToken()) {
		uni.showModal({
			title: "提示",
			content: "请先登录",
			success: (res) => {
				if (res.confirm) {
					uni.navigateTo({ url: "/pages/login/login" });
				}
			},
		});
	} else {
		uni.navigateTo({ url:`/pages/commissionDetail/commissionDetail?shareUserId=${userInfo.value.id}`});
	}
};

// 跳转提现
const gotoWithdraw = () => {
	navigateIfLoggedIn("/pages/withdraw/withdraw");
};

// 跳转认养记录
const gotAdoptionRecords = () => {
	navigateIfLoggedIn("/pages/adoptionRecords/adoptionRecords");
};

// 跳转订单列表
const gotoOrderList = () => {
	navigateIfLoggedIn("/pages/orderList/orderList");
};

// 跳转蜂农入住
const gotoBeeFarmerJion = () => {
	if (!getAccessToken()) {
		uni.showModal({
			title: "提示",
			content: "请先登录",
			success: (res) => {
				if (res.confirm) {
					uni.navigateTo({ url: "/pages/login/login" });
				}
			},
		});
	} else {
		if (isBeeFarm.value.auditStatus == 1) {
			uni.navigateTo({
				url: "/pages/beeFarmerJion/beeFarmInfo",
			});
		} else if (isBeeFarm.value.auditStatus == 0) {
			uni.navigateTo({
				url: "/pages/beeFarmerJion/jionFeedback",
			});
		} else {
			uni.navigateTo({
				url: "/pages/beeFarmerJion/beeFarmerJion",
			});
		}
	}
};

// 跳转智能养蜂
const gotoSmartBee = () => {
	navigateIfLoggedIn("/pages/smartBee/smartBee");
};

// 跳转消息
const gotoMessagePage = () => {
	navigateIfLoggedIn("/pages/messagePage/messagePage");
};

// 跳转问卷调查
const gotoSurveyList = () => {
	navigateIfLoggedIn("/pages/surveyList/surveyList");
};

// 跳转用户信息
const gotoUserInfo = () => {
	navigateIfLoggedIn("/pages/userInfo/userInfo");
};

// 跳转客服服务
const gotoCustomerService = () => {
	navigateIfLoggedIn("/pages/customerService/customerService");
};

// 获取佣金详情
const getCommissionDetail = async () => {
	try {
		const res = await request({
			url: "/app-api/weixin/distribution/get/commission/info",
			showLoading: true,
		});
		if (res.code === 0 || res.code === 200) {
			commissionData.value = res.data || {};
		}
	} catch (err) {
		console.error("获取佣金信息失败:", err);
	}
};

// 获取用户信息
const getMyInfo = async () => {
	try {
		const res = await request({
			url: "/app-api/weixin/user/get/myInfo",
			showLoading: true,
		});
		if (res.code === 0 || res.code === 200) {
			userInfo.value = res.data || {};
		}
	} catch (err) {
		console.error("获取用户信息失败:", err);
	}
};

// 获取是否是蜂农入驻
const getIsBeeFarm = async () => {
	try {
		const res = await request({
			url: "/app-api/weixin/beeFarmApply/get",
			showLoading: true,
		});
		if (res.code === 0 || res.code === 200) {
			isBeeFarm.value = res.data;
		}
	} catch (err) {
		console.error("获取蜂农入驻信息失败:", err);
	}
};

// 退出登录
const loginOut = () => {
	uni.showModal({
		title: "提示",
		content: "确定要注销登录吗？",
		success: (res) => {
			if (res.confirm) {
				clearToken();
				userInfo.value = {};
				commissionData.value = {};
				uni.showToast({
					title: "已退出登录",
					icon: "success",
				});
			}
		},
	});
};

</script>

<style lang="scss" scoped>
.container {
	background: linear-gradient(180deg, #f9ddc9 0%, #f6ebe8 58%, #f6f6f6 83%);
	height: 100vh;
	position: relative;
	padding: 0rpx 20rpx;

	.title-bar {
		.logo-image {
			width: 205rpx;
			height: 70rpx;
			margin-left: 40rpx;
		}
	}

	.scroll-content {
		margin: 20rpx 0rpx;

		.my-info-top {
			background-image: url('/static/images/myPage/myPageTopbg.png');
			height: 445rpx;
			background-size: 100% 100%;
			padding: 30rpx;

			.top-content {
				display: flex;
				align-items: center;

				.avatar-view {
					width: 95rpx;
					height: 95rpx;
					border: 2rpx solid #fff;
					border-radius: 95rpx;

					.avatar-image {
						width: 91rpx;
						height: 91rpx;
						border-radius: 95rpx;
					}
				}

				.name-content {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 20rpx;

					.name-text {
						font-weight: bold;
						font-size: 42rpx;
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

				.vip-content {
					display: flex;
					.share-box {
						display: flex;
						align-items: center;
						color: #FF6F0E;
						margin-top: 10rpx;
					
						.share-btn {
							background: transparent;
							padding: 0;
							margin-left: 10rpx;

							.btn {
								margin-right: 10rpx;
								width: 30rpx;
								height: 30rpx;
							}
						}
					}
				}
			}

			.bottom-content {
				margin-top: 80rpx;

				.menu-content {
					margin-top: 30rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.menu-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;

						.menu-icon {
							width: 70rpx;
							height: 70rpx;
						}

						.menu-text {
							margin-top: 10rpx;
							font-weight: 400;
							font-size: 26rpx;
							color: #000000;
						}
					}
				}
			}
		}

		.my-info-center {
			margin-top: 20rpx;
			height: 360rpx;
			background-color: #fff;
			padding: 10rpx 30rpx 0rpx 30rpx;
			border-radius: 16rpx;

			.commission-card {
				margin-top: 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				.card-item{
					height: 120rpx;
					width: 48%;
					margin-bottom: 20rpx;
					padding: 20rpx;
					font-weight: 500;
					font-size: 24rpx;
					color: #fff;
				.amount{
					font-weight: 800;
					font-size: 42rpx;
					
				}
				}
				.card-todaySEarnings{
					background-image: url('/static/images/myPage/todaySEarningsBg.png');
					background-size: 100% 100%;
					
				}
				.card-cumulativeEarnings{
					background-image: url('/static/images/myPage/cumulativeEarningsBg.png');
					background-size: 100% 100%;
				}
				.card-currentEarnings{
					background-image: url('/static/images/myPage/currentEarningsBg.png');
					background-size: 100% 100%;
				}
				.card-coin{
					background-image: url('/static/images/myPage/coinBg.png');
					background-size: 100% 100%;
				}
			}

		}

		.my-info-bottom {
			margin-top: 20rpx;
			height: 430rpx;
			background-color: #fff;
			border-radius: 16rpx;
			padding:0rpx 20rpx;
			.list-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #EEEEEE;

				.item-left {
					padding: 15rpx 0rpx;
					display: flex;
					.item-icon {
						width: 40rpx;
						height: 40rpx;
					}
					.text {
						margin-left: 22rpx;
						font-size: 28rpx;
						color: #4c3f30;
					}
				}

				.btn {
					width: 27rpx;
					height: 27rpx;
				}
			}
		}
	}


}
</style>
