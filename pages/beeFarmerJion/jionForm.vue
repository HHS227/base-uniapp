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
				<view class="picker-view" :class="{ 'has-value': formData.region }">
					{{ formData.region || '请选择省、市、区' }}
				</view>
			</picker>
			<input :inputBorder="false" placeholder-class="place" v-model="formData.honeySeeds" placeholder="蜜源种类" class="form-item form-input" />
			<input :inputBorder="false" placeholder-class="place" v-model="formData.name" placeholder="蜂场名称" class="form-item form-input" />
			<input :inputBorder="false" placeholder-class="place" v-model="formData.area" placeholder="蜂场面积" class="form-item form-input" />
			<input :inputBorder="false" placeholder-class="place" v-model="formData.beeType" placeholder="蜜蜂种类" class="form-item form-input" />
			<input :inputBorder="false" placeholder-class="place" v-model="formData.ownerName" placeholder="养蜂人" class="form-item form-input" />
			<button class="submit-btn" @click="enterBtn">入驻</button>
		</view>
	</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import TransNavVue from '../../components/TransNav.vue';
import { request } from '@/utils/request';
const formData = ref({
	region: '',
	honeyseeds: '',
	name: '',
	area: '',
	beetype: '',
	ownername: '',
});


const enterBtn = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/beeFarmApply/create',
      showLoading: true, 
		data:formData.value,
		method:'post'
    })
   
    if (res.code === 0 ) {
		uni.navigateTo({
    url: '/pages/beeFarmerJion/jionFeedback'
  })
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } 
  catch (err) {
    console.error('入驻失败:', err)
   
  }
}

const selectCity = (e) => {
    // 将数组转换为空格分隔的字符串
    formData.value.region = e.detail.value.join(' ');
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
		padding: 48rpx 15rpx;
		margin: auto;
		width: 686rpx;
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
