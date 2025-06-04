<template>
	<view>
		<TransNavVue title="入驻"/>
	<view class="container">
		<image src="/static/images/myPage/BeeEnterInfoBg.png" class="container-bg" mode=""></image>
		
		<view class="title-content">
			填写信息
			<text class="tips">填写相关信息，完成入驻</text>
		</view>
		<view class="form-content">
			<picker mode="region" @change="selectCity" class="form-item">
				<view class="picker-view" :class="{ 'has-value': formData.region.length > 0 }">
					{{ formData.region.length > 0 ? formData.region.join(' ') : '请选择省、市、区' }}
				</view>
			</picker>
			<input :inputBorder="false" placeholder-class="place" v-model="formData.beeType" placeholder="蜜源种类" class="form-item form-input" />
			<input :inputBorder="false" placeholder-class="place" v-model="formData.deviceNumber" placeholder="设备编号" class="form-item form-input" />
			<button class="submit-btn" @click="enterBtn">入驻</button>
		</view>
	</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import TransNavVue from '../../components/TransNav.vue';
const formData = ref({
	region: [],
	beeType: '',
	deviceNumber: ''
});

const enterBtn = ()=>{
    uni.navigateTo({
        url:'/pages/beeFarmerJion/jionFeedback'
    })
}

const selectCity = (e) => {
	formData.value.region = e.detail.value;
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	position: relative;
	background: #f6f6f6;
	height: 100vh;
	z-index: 1;
	.container-bg {
		width: 100%;
		height: 548rpx;
		position: absolute;
		z-index: -1;
	}
	.title-content {
		margin-top: 70rpx;
		margin-left: 72rpx;
		display: flex;
		flex-direction: column;
		font-weight: bold;
		font-size: 48rpx;
		color: #1e1e1e;
		line-height: 72rpx;
		.tips {
			margin-top: 12rpx;
			font-size: 26rpx;
			color: #999999;
			line-height: 40rpx;
		}
	}
	.form-content {
		padding: 48rpx 32rpx;
		margin: auto;
		margin-top: 32rpx;
		width: 686rpx;
		height: 606rpx;
		background: #ffffff;
		border-radius: 24rpx;
		.form-item {
			padding-left: 32rpx;
			margin-bottom: 28rpx;
			width: 622rpx;
			height: 110rpx;
			background: #f6f6f6;
			border-radius: 16rpx;
			.picker-view {
				padding: 32rpx 0;
				line-height: 48rpx;
				font-size: 32rpx;
				&.has-value {
					color: #000;
				}
				&:not(.has-value) {
					color: rgba(0, 0, 0, 0.25);
				}
			}
		}

		::v-deep .place {
			color: rgba(0, 0, 0, 0.25);
		}
		.submit-btn{
			width: 622rpx;
			height: 96rpx;
			background: #FF6F0E;
			border-radius: 50rpx;
			font-weight: 500;
			font-size: 32rpx;
			color: #FFFFFF;
			line-height: 96rpx;
		}
	}
}
</style>
