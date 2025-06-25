<template>
		<view class="container">
			  <view>
			<view :style="{ height: getStatusBarHeight() + 'px' }"></view>
			<view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
			</view>
		</view>
			<scroll-view scroll-y="true" class="scroll-view">
				<view class="my-info-top">
					<view class="top-content">
						<view class="avatar-view">
							<image :src="userInfo.avatar" mode="" class="avatar-image"></image>
						</view>
						<view class="name-content">
							<text v-if="true" class="name-text">{{ userInfo.nickname }}</text>
							<text v-else class="name-text unlogin-text" @click="toLogin">请先登录</text>
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
						<view @click="gotoUserInfo" class="list-item">
						<view class="item-left">
							<image class="item-icon" src="/static/images/myPage/settingIcon.png" mode=""></image>
							<text class="text">设置</text>
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
		
			<BeeTabbarVue active-tab="myPage"></BeeTabbarVue>
		</view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from "../../utils/system";
import BeeTabbarVue from "../../components/BeeTabbar.vue";
import { ref } from "vue";
import { onShareAppMessage, onShow } from "@dcloudio/uni-app";
import { useTokenStorage } from "../../utils/storage";
import { request } from "@/utils/request";

const { getAccessToken, clearToken ,clearUser} = useTokenStorage();
const userInfo = ref({
	nickname: "111",
	avatar: "/static/images/gameLogo.png",
	id: "123456",
});


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
		title: "分享的名字",
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
		
		
	}
});




// 跳转用户信息
const gotoUserInfo = () => {
	navigateIfLoggedIn("/pages/userInfo/userInfo");
};





// 退出登录
const loginOut = () => {
	uni.showModal({
		title: "提示",
		content: "确定要注销登录吗？",
		success: (res) => {
			if (res.confirm) {
				clearToken();
				clearUser();
				userInfo.value = {};
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
	/* padding: 0rpx 20rpx 35rpx ; */
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	height: 100vh;
	.title-bar {
		.logo-image {
			width: 205rpx;
			height: 70rpx;
			margin-left: 40rpx;
		}
	}

	.scroll-view {
		flex: 1;
		overflow-y: auto;
		margin-top: 20rpx;
		.my-info-top {
			background-color: #fff;
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
