<template>
    <view class="container">
		<view class="setting-item">
			<text class="setting-text">
				头像
			</text>
			<view class="setting-btn">
				<image src="/static/logo.png" mode="" class="avatar-image"></image>
				<image src="/static/images/myPapeImages/向右箭头.png" mode="" class="setting-icon"></image>
			</view>
		</view>
		<view class="setting-item">
			<text class="setting-text">
				电话
			</text>
			<view class="setting-btn">
				<text class="tel-text">13142216598</text>
				<image src="/static/images/myPapeImages/向右箭头.png" mode="" class="setting-icon"></image>
			</view>
		</view>
		<view class="setting-item">
			<text class="setting-text">
				性别
			</text>
			<view class="setting-btn">
				<view class="sex-item" @click="handleSexSelect('男')">
						<image :src="selectedSex === '男' ? '/static/images/myPapeImages/Group 956@2x.png' : '/static/images/myPapeImages/Vector@2x.png'" mode="" class="sex-image"></image>
						<text :style="{ color: selectedSex === '男' ? '#242424' : '#999999' }">男</text>
					</view>
					<view class="sex-item" @click="handleSexSelect('女')">
						<image :src="selectedSex === '女' ? '/static/images/myPapeImages/Group 956@2x.png' : '/static/images/myPapeImages/Vector@2x.png'" mode="" class="sex-image"></image>
						<text :style="{ color: selectedSex === '女' ? '#242424' : '#999999' }">女</text>
					</view>
			</view>
		</view>
		<navigator url="/pages/addressManager/addressManager" class="setting-item">
			<text class="setting-text">
				地址管理
			</text>
			<view class="setting-btn">
				<image src="/static/images/myPapeImages/向右箭头.png" mode="" class="setting-icon"></image>
			</view>
		</navigator>
    </view>
</template>

<script setup>
import { ref } from 'vue'

const selectedSex = ref('男')

const handleSexSelect = (sex) => {
  selectedSex.value = sex
}
</script>

<style lang="scss" scoped>
	.setting-item{
		margin-top: 30rpx;
		padding: 0 40rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.setting-text{
			font-weight: 500;
			font-size: 30rpx;
			color: #101010;
			line-height: 42rpx;
			width: 150rpx;
		}
		.setting-btn{
			display: flex;
			align-items: center;
			.avatar-image{
				width: 100rpx;
				height: 100rpx;
				border-radius: 100rpx;
			}
			.tel-text{
				font-size: 28rpx;
				color: #999999;
				line-height: 42rpx;
			}
			.sex-item{
				display: flex;
				align-items: center;
				font-size: 28rpx;
				line-height: 42rpx;
				margin-right: 40rpx;
				.sex-image{
					width: 32rpx;
					height: 32rpx;
				}
			}
			.setting-icon{
				margin-left: 4rpx;
				width: 28rpx;
				height: 28rpx;
			}
		}
	}
</style>
