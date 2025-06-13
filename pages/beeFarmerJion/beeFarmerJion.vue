<template>
<view>
	<TransNavVue title="蜂农认证"/>
    <view class="container">
		<image class="container-bg" src="/static/images/homePage/homePageBg.png" mode=""></image>
		
		<image class="poster-image" src="/static/images/mypage/beeEnterBg.png" mode=""></image>
		<text class="jion-text">未入驻平台</text>
		<view class="tips-content">
			<image src="/static/images/mypage/beeEnterWarring.png" class="tips-image" mode=""></image>
			您还没有入驻平台，填写资料入驻
		</view>
		<button class="jion-btn" @click="gotoJion" >立即入驻</button>
		<view class="jion-rules-content">
			<view class="rules-title">
				<image src="/static/images/myPage/enterRule.png" class="title-icon" mode=""></image>
				入驻规则
			</view>
			<text class="rules-text">愿你的每一天都充满阳光和欢笑，每一步都走得坚定而有力。在这个多彩的世界里，愿你收获满满的幸福与成功！\n
祝福如春风般温暖，如夏雨般滋润，如秋月般皎洁，如冬雪般纯净。愿你的每一天都充满阳光和欢笑，每一步都走向成功和幸福。</text>
		</view>
    </view>
</view>
</template>

<script setup>
import TransNavVue from '../../components/TransNav.vue';
const gotoJion = ()=>{
	uni.navigateTo({
		url:'/pages/beeFarmerJion/addFarm'
	})
}
</script>

<style lang="scss" scoped>
	.container{
		display: flex;
		flex-direction: column;
		position: relative;
		background: #F6F6F6;
		height: 100vh;
		z-index: 1;
		.container-bg{
			width: 100%;
			height: 548rpx;
			position: absolute;
			z-index: -1;
		}
		.poster-image{
			margin: auto;
			margin-bottom: 0;
			margin-top: 20rpx;
			width: 690rpx;
			height: 470rpx;
		}
		.jion-text{
			margin-top: 50rpx;
			text-align: center;
			font-weight: bold;
			font-size: 48rpx;
			color: #0F1214;
			line-height: 72rpx;
		}
		.tips-content{
			margin-top: 12rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #666666;
			line-height: 42rpx;
			.tips-image{
				width: 32rpx;
				height: 32rpx;
				margin-right: 8rpx;
			}
		}
		.jion-btn{
			margin-top: 40rpx;
			width: 686rpx;
			height: 96rpx;
			background: linear-gradient( 90deg, #FF9A56 0%, #FF7A20 100%);
			border-radius: 50rpx;
			font-weight: bold;
			font-size: 32rpx;
			color: #F6F6F6;
			line-height: 96rpx;
		}
		.jion-rules-content{
			margin:0 auto;
			margin-top: 30rpx;
			width: 686rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			padding: 32rpx;
			.rules-title{
				margin-bottom: 28rpx;
				display: flex;
				align-items: center;
				font-weight: bold;
				font-size: 32rpx;
				color: #1E1E1E;
				.title-icon{
					width: 48rpx;
					height: 48rpx;
				}
			}
			.rules-text{
				font-size: 28rpx;
				color: #666666;	
			}
		}
	}
</style>
