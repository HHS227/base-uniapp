<template>
	<view class="container">
		<scroll-view scroll-y="true" class="scroll-content">
			<view class="address-item" v-for="(item, index) in addressList" :key="index">
				<view class="item-top">
					<view class="text-content">
						<view class="user-info">
							<text class="name-text">{{item.name}}</text>
							<text class="phone-text">{{formatPhone(item.phone)}}</text>
						</view>
						<text class="address-text">{{item.address}}</text>
					</view>
					<image src="/static/images/myPapeImages/Group 9004@2x.png" class="edit-icon" mode=""></image>
				</view>
				<view class="operation-content">
					<view class="set-default" @click="setDefault(index)">
						<image class="set-image" :src="item.isDefault ? '/static/images/myPapeImages/Group 956@2x.png' : '/static/images/myPapeImages/Vector@2x.png'" mode=""></image>
						<text class="set-btn">{{item.isDefault ? '默认地址' : '设为默认地址'}}</text>
					</view>
					<text class="del-btn" @click="deleteAddress(index)">删除</text>
				</view>
			</view>
		</scroll-view>
		<view class="holder"></view>
	</view>
	<view class="bottom-btn">
		<view class="btn-content">
			<button class="add-btn" @click="gotoEdit">新增收货地址</button>
		</view>
		<view class="safe-view"></view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const addressList = ref([
  {
    name: '安徒生',
    phone: '13523653686',
    address: '湖南省 长沙市 开福区 芙蓉大道',
    isDefault: true
  },
  {
    name: '张三',
    phone: '13800138000',
    address: '北京市 海淀区 中关村大街',
    isDefault: false
  }
])

const setDefault = (index) => {
  addressList.value.forEach((item, i) => {
    item.isDefault = i === index
  })
}

const deleteAddress = (index) => {
  addressList.value.splice(index, 1)
}

const formatPhone = (phone) => {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
}

const gotoEdit = ()=>{
	uni.navigateTo({
		url:'/pages/editAddress/editAddress'
	})
}
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	position: relative;
	background: #f8f8f8;
	.scroll-content {
		flex: 1;
		height: 200rpx;
		.address-item {
			margin: auto;
			margin-top: 24rpx;
			width: 690rpx;
			height: 244rpx;
			background: #ffffff;
			border-radius: 24rpx;
			.item-top {
				display: flex;
				justify-content: space-between;
				.text-content {
					margin-top: 30rpx;
					margin-left: 28rpx;
					display: flex;
					flex-direction: column;
					.user-info {
						display: flex;
						align-items: center;
						.name-text {
							font-weight: 500;
							font-size: 32rpx;
							color: #101010;
							line-height: 48rpx;
						}
						.phone-text {
							margin-left: 20rpx;
							font-size: 30rpx;
							color: #6b6b6b;
						}
					}
					.address-text {
						margin-top: 16rpx;
						font-weight: 400;
						font-size: 28rpx;
						color: #101010;
						line-height: 42rpx;
					}
				}
				.edit-icon {
					margin-top: 40rpx;
					margin-right: 30rpx;
					width: 26rpx;
					height: 24rpx;
				}
			}
			.operation-content {
				width: 634rpx;
				margin: auto;
				margin-top: 20rpx;
				border-top: 2rpx solid #e9e9e9;
				display: flex;
				justify-content: space-between;
				.set-default {
					margin-top: 18rpx;
					display: flex;
					align-items: center;
					line-height: 36rpx;
					font-size: 24rpx;
					color: #6b6b6b;
					.set-image {
						width: 32rpx;
						height: 32rpx;
						margin-right: 20rpx;
					}
				}
				.del-btn{
					margin-top: 24rpx;
					font-size: 24rpx;
					color: #999999;
					line-height: 36rpx;
				}
			}
		}
	}
	.holder {
		height: calc(132rpx + env(safe-area-inset-bottom));
	}
}
.bottom-btn {
	background-color: #fff;
	width: 100%;
	position: absolute;
	bottom: 0;
	.btn-content {
		height: 132rpx;
		display: flex;
		align-items: center;
		.add-btn {
			font-weight: 500;
			font-size: 32rpx;
			color: #ffffff;
			line-height: 94rpx;
			width: 660rpx;
			height: 94rpx;
			background: #ff6f0e;
			border-radius: 60rpx;
		}
	}
}
</style>
