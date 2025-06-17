<template>
	<view class="container">
	  <TransNavVue title="商品详情" />
	  <scroll-view class="scroll-content" scroll-y>
		<view class="details-top">
		  <view class="swiper-content">
			<swiper class="swiper" circular indicator-active-color="#ffffff" indicator-dots="true" autoplay="true"
			  interval="2000" duration="500">
			  <swiper-item class="swiper-item" v-for="(item,index) in commodityDetails.imgUrls" :key="index">
				<image :src="item" class="swiper-image" mode=""></image>
			  </swiper-item>
			</swiper>
		  </view>
		  <view class="swiper-title">
			<view>
			  <text class="money">￥{{commodityDetails.price}}</text> 
			</view>
			<view class="kg">净重 {{commodityDetails.weight}}克</view>
		  </view>
		</view>
		<view class="details-center">
		  <view class="details-title">图文详情</view>
		  <view class="rich-text-container">
			<!-- 使用 mp-html 组件 -->
			<mp-html 
			  :content="processedContent" 
			  :lazy-load="true"
			  @imgtap="previewImage"
			  @linktap="handleLinkTap"
			/>
		  </view>
		</view>
  
		<view class="details-bottom">
		  <button class="settle-btn" @click="buyBtn">加入购物车</button>
		</view>
	  </scroll-view>
	</view>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import TransNavVue from '../../components/TransNav.vue'
  import { request } from '@/utils/request'
  import { useTokenStorage } from '../../utils/storage'
  import { onShow } from '@dcloudio/uni-app'
  import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'
  
  const { getAccessToken } = useTokenStorage()
  const commodityDetails = ref({})
  
  // 处理富文本内容
  const processedContent = computed(() => {
	if (!commodityDetails.value.describle) return ''
	
	// 处理图片自适应
	let content = commodityDetails.value.describle
	  .replace(/<img/gi, '<img class="rich-image" style="max-width:100%;height:auto" ')
	  .replace(/<video/gi, '<video class="rich-video" style="max-width:100%;height:auto" ')
	
	return content
  })
  
  // 图片预览
  const previewImage = (src) => {
	uni.previewImage({
	  urls: [src],
	  current: src
	})
  }
  
  // 链接点击处理
  const handleLinkTap = (href) => {
	uni.navigateTo({
	  url: '/pages/webview/webview?url=' + encodeURIComponent(href)
	})
  }
  
  // 添加物品到购物车
  const buyBtn = async () => {
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
	}
	
	try {
	  const res = await request({
		url: '/app-api/trade/cart/add',
		showLoading: true, 
		method:'post',
		data:{
		  skuId:commodityDetails.value.id,
		  count:'1'
		},
	  })
	  if (res.code === 0 ) {
		uni.navigateTo({
		  url: '/pages/shoppingCart/shoppingCart'
		})
	  } else {
		throw new Error(res.msg || '数据异常')
	  }
	} catch (err) {
	  console.error('获取商场数据失败:', err)
	}
  }
  
  // 获取商品详情
  const getCommodityDetail = async (id) => {
	try {
	  const res = await request({
		url: `/app-api/WeiXinMini/product/get/info?id=${id}`
	  })
	  commodityDetails.value = res.data
	} catch (error) {
	  console.error('获取详情失败:', error)
	}
  }
  
  // 初始化数据
  onShow(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const options = currentPage.$page.options || currentPage.options
	
	if (options.id) {
	  getCommodityDetail(options.id)
	} else {
	  console.error('商品 ID 缺失')
	}
  })
  </script>
  
  <style lang="scss" scoped>
  .container {
	background-color: #f7f7f7;
	height: 100vh;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
  
	.swiper-content {
	  height: 580rpx;
	  width: 100%;
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
  
	.swiper-title {
	  height: 150rpx;
	  background-color: #fff;
	  display: flex;
	  justify-content: space-between;
	  padding: 50rpx 20rpx;
  
	  .money {
		color: orange
	  }
  
	  .kg {
		font-size: 14px;
		color: #cccccc;
	  }
	}
  
	.details-center {
	  margin-top: 10rpx;
	  background-color: #fff;
	  width: 100%;
	  padding-bottom: 120rpx;
  
	  .details-title {
		height: 100rpx;
		line-height: 100rpx;
		color: #000;
		text-align: center;
	  }
  
	  .rich-text-container {
		padding: 20rpx;
		
		/* 确保富文本内容样式正确 */
		 .rich-image{
        width: 100% !important;
        height: auto !important;
        display: block;
        margin: 10rpx 0;
      }
		
		 .rich-video {
		  width: 100% !important;
		  height: auto !important;
		  display: block;
		  margin: 20rpx 0;
		}
	  }
	}
  
	.details-bottom {
	  position: fixed;
	  bottom: 0px;
	  width: 100%;
	  background-color: #fff;
	  height: 60px;
	  display: flex;
	  justify-content: center;
	  align-items: center;
  
	  .settle-btn {
		width: 580rpx;
		height: 76rpx;
		background: #ff6f0e;
		border-radius: 50rpx 50rpx 50rpx 50rpx;
		font-weight: 500;
		font-size: 32rpx;
		color: #ffffff;
		line-height: 76rpx;
	  }
	}
  }
  </style>