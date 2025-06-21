<template>
  <view>
    <BeeTabbarVue active-tab="shoppingMall"></BeeTabbarVue>
    <view class="container">

      <image src="/static/images/homePage/homePageBg.png" mode="aspectFill" class="bg-image"></image>
      <view :style="{ height: getStatusBarHeight() + 'px' }"></view>
      <view class="title-bar" :style="{ height: getTitleBarHeight() + 'px' }">
        <image src="/static/images/logo.png" class="logo-image" mode="aspectFill"></image>
      </view>
      <view class="floating-btn" @click="gotoCart">
        <image src="/static/images/cart.png" mode="aspectFit" class="cart-icon"></image>
        <view class="btn-text">购物车</view>
      </view>

      <scroll-view scroll-y="true" class="scroll-view" enable-flex>
        <view class="swiper-content">
          <swiper class="swiper" circular indicator-active-color="#ffffff" indicator-dots="true" autoplay="true"
            interval="2000" duration="500">
            <swiper-item class="swiper-item" v-for="(item, index) in activities" :key="index">
              <image :src=item.url class="swiper-image" mode="" @click="activeBtn(item)"></image>
            </swiper-item>

          </swiper>
        </view>

        <view v-if="shoppingList.length === 0" class="empty-container">
          <text class="empty-text">暂无商品</text>
        </view>

        <view class="scroll-content" v-else>
          <view class="goods-item" v-for="(item, index) in shoppingList" :key="index" @click="shopDetails(item)">
            <image :src="item.imgUrl" mode="aspectFill" class="goods-image" lazy-load="true"></image>
            <view class="goods-title">{{ item.name }}</view>
            <view class="goods-info">
              <view class="goods-weight">
                重量：
                <text>{{ item.weight || 0 }}g</text>
              </view>
              <view class="goods-weight">已售{{ item.sold || 0 }}</view>
            </view>
            <view class="goods-handle">
              <view class="goods-price">￥
                <text>{{ item.price || '-' }}</text>
                <view class="normal-price">￥{{ item.originalPrice || 0 }}</view>
              </view>
              <view @click.stop="shoppingBuy(item)">
                <button class="buy-btn">购买</button>
              </view>
            </view>

            <view class="tag-box" v-if="item.isNew">新品</view>
          </view>
        </view>

        <view class="tabbar-bottom"></view>

      </scroll-view>

    </view>
    
  </view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '../../utils/system';
import BeeTabbarVue from '../../components/BeeTabbar.vue';
import { ref } from 'vue'
import { request } from '@/utils/request'
import { onShow } from '@dcloudio/uni-app'
import { useTokenStorage } from '../../utils/storage'

const { getAccessToken } = useTokenStorage()
const shoppingList = ref([])
const activities = ref([])

// 跳转购物车
const gotoCart = () => {
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
      url: '/pages/shoppingCart/shoppingCart'
    })
  }

}
// 跳转详情
const shopDetails = (item) => {
  uni.navigateTo({
    url: `/pages/shopDetails/shopDetails?id=${item.id}`
  })
}
//跳转到活动页面
const activeBtn = (item) => {
  if (item.activityId !== null) {
    uni.navigateTo({ url: '/pages/couponPage/couponPage' })
  } else {
    uni.navigateTo({
      url: `/pages/shopDetails/shopDetails?id=${item.productId}`
    })
  }
}

//单独购买
const shoppingBuy = async (item) => {
  const res = await request({
    url: '/app-api/trade/cart/add',
    showLoading: true,
    method: 'post',
    data: {
      skuId: item.id,
      count: '1'
    },

  })
  if (res.code === 0) {
    const selectedItems = [
      {
        count: 1,
        sku: {
          id: item.id,
          picUrl: item.imgUrl,
          name: item.name,
          weight: item.weight,
          price: item.price * 100,
        }
      }
    ]

    uni.navigateTo({
      url: '/pages/shoppingPay/shoppingPay',
      success: (res) => {
        res.eventChannel.emit('acceptSelectedItems', {
          selectedItems: selectedItems,
          totalPrice: item.price * 100
        });
      }
    })
  }


}

//获取商场列表
const getShoppingList = async () => {
  try {
    const res = await request({
      url: '/app-api/WeiXinMini/product/get/productList',
      showLoading: true,
    })
    if (res.code === 0) {
      shoppingList.value = res.data

    } else {
      throw new Error(res.msg || '数据异常')
    }
  }
  catch (err) {
    console.error('获取商场数据失败:', err)

  }
}
//获取活动数据
const getActiveList = async () => {
  try {
    const res = await request({
      url: '/app-api/WeiXinMini/index/get/activity',
      showLoading: true,
    })
    if (res.code === 0) {
      activities.value = res.data || []
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('轮播图加载失败:', err)

  }
}

onShow(() => {
  getShoppingList()
  getActiveList()
})

</script>

<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  padding-bottom: 35rpx;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	height: 100vh;  

	.bg-image {
		width: 100%;
		height: 374rpx;
		position: absolute;  
		z-index: -1;
	}
	.title-bar {
		position: sticky;  // 新增：标题栏固定
		top: 0;
		z-index: 10;
		background-color: transparent;
		.logo-image {
			width: 205rpx;
			height: 70rpx;
			margin-left: 40rpx;
		}
	}

  .floating-btn {
    z-index: 999;
    position: fixed;
    right: 0;
    bottom: 384rpx;
    width: 89rpx;
    height: 107rpx;
    background: #FFFFFF;
    box-shadow: 0rpx 2rpx 12rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 20rpx 0rpx 0rpx 20rpx;
    border: 1rpx solid #EEEEEE;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .cart-icon {
      width: 45rpx;
      height: 41rpx;
    }
    .btn-text {
      margin-top: 8rpx;
      font-size: 22rpx;
      color: #202120;
      line-height: 20rpx;
    }
  }

  .scroll-view {
    flex: 1;
    overflow-y: auto; 
    height: 300rpx;

    .swiper-content {
			height: 340rpx;
			width: 704rpx;
			border-radius: 24rpx;
			overflow: hidden;
			margin: auto;
			margin-top: 5rpx;
      margin-bottom: 20rpx;
			.swiper {
				width: 100%;
				height: 100%;
				.swiper-image {
					height: 100%;
					width: 100%;
				}
			}
		}
    .scroll-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 20rpx;
  }

  .goods-item {
    height: 510rpx;
    width: 343rpx;
    background: #ffffff;
    margin-bottom: 16rpx;
    position: relative;

    .goods-image {
      width: 100%;
      height: 335rpx;
    }

    .goods-title {
      width: 295rpx;
      margin: auto;
      margin-top: 16rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .goods-info {
      margin-top: 4rpx;
      padding: 0 24rpx;
      display: flex;
      justify-content: space-between;

      .goods-weight {
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        line-height: 36rpx;

        text {
          font-weight: 500;
          font-size: 24rpx;
          color: #101010;
        }
      }
    }

    .goods-handle {
      display: flex;
      height: 44rpx;
      margin-top: 20rpx;
      justify-content: space-between;
      padding: 0 24rpx;

      .goods-price {
        display: flex;
        font-weight: 500;
        font-size: 24rpx;
        color: #EB5C20;
        align-items: center;

        text {
          font-weight: bold;
          font-size: 24rpx;
        }

        .normal-price {
          margin-left: 8rpx;
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
          text-decoration-line: line-through;
        }
      }

      .buy-btn {
        width: 128rpx;
        height: 44rpx;
        background: #FF6F0E;
        border-radius: 130rpx 130rpx 130rpx 130rpx;
        line-height: 44rpx;
        font-weight: 500;
        font-size: 24rpx;
        color: #FFFFFF;
      }
    }
    .tag-box{
      position: absolute;
      left: 0;
      top: 0;
      height:40rpx;
      width: 80rpx;
      background-color: #ff6f0e;
      text-align: center;
      font-size: 24rpx;
      color: #fff;
    }
  }
  }


  .empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;



    .empty-text {
      font-size: 28rpx;
      color: #999;
    }

  }
}
</style>