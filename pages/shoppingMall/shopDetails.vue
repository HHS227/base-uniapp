<template>
	<view class="container">
		<TransNavVue title="商品详情"></TransNavVue>
		<view class="details-top">
			<view class="swiper-content">
				<swiper class="swiper" circular indicator-active-color="#ffffff" indicator-dots="true" autoplay="true"
					interval="2000" duration="500">
					<swiper-item class="swiper-item" v-for="item in commodityDetails.imgUrls" :key="item">
						<image :src="item" class="swiper-image" mode=""></image>
					</swiper-item>
				</swiper>

			</view>
			<view class="swiper-title">
				<view><text class="money">￥{{commodityDetails.price}}</text> <text class="discounts">优惠券</text><text
						class="sale">满50-20</text> </view>
				<view class="kg">净重 {{commodityDetails.weight}}克</view>
			</view>
		</view>
		<view class="details-center">
			<view class="details-title"> 图文详情</view>
			<view class="details-img">
				<image v-for="item in commodityDetails.imgUrls" :src="item" class="details-image" mode="" :key="item"></image>

			</view>
		</view>

		<view class="details-bottom">
			<button class="settle-btn" @click="buyBtn">立即购买</button>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import TransNavVue from '../../components/TransNav.vue';
	import {
		request
	} from '@/utils/request'
	import { useTokenStorage } from '../../utils/storage'  // 新增导入

	const { getAccessToken } = useTokenStorage()  // 新增获取token方法
	// 删除useRoute引入，改用uni-app方式获取参数
	const commodityDetails = ref({
		"id": 28522,
		"name": "王五",
		"beefarmId": null,
		"price": 6663,
		"originalPrice": null,
		"imgUrl": "https://www.iocoder.cn",
		"imgUrls": ["https://avatars.githubusercontent.com/u/48255171",
			"https://avatars.githubusercontent.com/u/48255171"
		],
		"weight": 0,
		"traceabilityCode": null,
		"describle": "",
		"stock": 0,
		"preSale": null,
		"origin": null,
		"sold": null,
		"status": null,
		"goodsType": null,
		"adoptionBenefits": "",
		"adoptType": "1",
		"deliverType": "1",
		"region": "",
		"regionId": 18328,
		"brokerageType": 2,
		"firstBrokeragePrice": 17715,
		"secondBrokeragePrice": 11682,
		"firstBrokerageProportion": 0,
		"secondBrokerageProportion": 0
	})

	//添加物品
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
	    if (res.code === 0 || res.code === 200) {
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
	onMounted(() => {
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
			height: 380rpx;
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

			.discounts {
				display: inline-block;
				width: 100rpx;
				background-color: red;
				color: #fff;
				margin: 0px 10rpx;
			}

			.sale {
				color: orange;
				font-weight: 600;


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
			height: 600rpx;

			.details-title {
				height: 100rpx;
				line-height: 100rpx;
				color: #000;
				text-align: center;
			}

			.details-img {
				height: 500rpx;
				width: 100%;
				overflow: auto;

				.details-image {
					width: 100%;
				}
			}
		}

		.details-bottom {
			position: fixed;
			bottom: 0px;
			width: 100%;
			background-color: #fff;
			height: 60px;

			.settle-btn {
				margin-top: 10rpx;
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