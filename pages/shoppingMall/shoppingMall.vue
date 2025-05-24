<template>
   <view>
    <BeeTabbarVue active-tab="shoppingMall"></BeeTabbarVue>
    <view class="container">
        <view class="floating-btn cart-btn" @click="gotoCart">
            <image src="/static/images/cart.png" mode="aspectFit" class="cart-icon"></image>
            <view class="btn-text">购物车</view>
        </view>
   
        <scroll-view scroll-y="true" class="scroll-view" enable-flex>
            <view class="scroll-content">
                <view class="goods-item" v-for="item in shoppingList" :key="item">
                    <image src="/static/logo.png" mode="" class="goods-image"></image>
                    <view class="goods-title" @click="shopDetails(item)">{{item.name}}</view>
                    <view class="goods-info">
                        <view class="goods-weight">
                            重量：
                            <text>{{item.weight||0}}kg</text>
                        </view>
                        <view class="goods-weight">已售{{item.sold||0}}</view>
                    </view>
                    <view class="goods-handle">
                        <view class="goods-price">
                            ￥
                            <text>{{item.price||'-'}}</text>
                            <view class="normal-price">￥8888</view>
                        </view>
                        <view>
                            <button class="buy-btn" @click='shoppingBuy'>购买</button>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
       
    </view>
   </view>
</template>

<script setup>
import BeeTabbarVue from '../../components/BeeTabbar.vue';
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'
const shoppingList=ref([])

const gotoMessage =()=>{
    uni.navigateTo({
        url:'/pages/messagePage/messagePage'
    })
}
const gotoCart = ()=>{
    uni.navigateTo({
        url:'/pages/shoppingCart/shoppingCart'
    })
}
const shopDetails = (item)=>{
    uni.navigateTo({
        url:`/pages/shoppingMall/shopDetails?id=${item.id}`
    })
}
const shoppingBuy = ()=>{
    uni.navigateTo({
        url:'/pages/shoppingMall/shoppingPay'
    })
}

//获取商场列表
const getShoppingList = async () => {
  try {
    const res = await request({
      url: '/app-api/WeiXinMini/product/get/productList',
      showLoading: true, 
    })
    if (res.code === 0 || res.code === 200) {
	shoppingList.value=res.data
	
		
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } 
  catch (err) {
    console.error('获取商场数据失败:', err)
   
  }
}


onMounted(() => {
  getShoppingList()
})

</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f7f7f7;

    .cart-btn {
        bottom: 384rpx;

        .cart-icon {
            width: 45rpx;
            height: 41rpx;
        }
    }

    .message-btn {
        bottom: 257rpx;

        .cart-icon {
            width: 40rpx;
            height: 40rpx;
        }
    }

    .floating-btn {
        z-index: 999;
        position: fixed;
        right: 0;
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
        .btn-text {
            margin-top: 8rpx;
            font-size: 22rpx;
            color: #202120;
            line-height: 20rpx;
        }
    }

    .scroll-view {
        flex: 1;
        height: 720rpx;
        box-sizing: border-box;
        padding: 32rpx 24rpx 0;

    }
    
    
    .scroll-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .goods-item {
        height: 510rpx;
        width: 343rpx;
        background: #ffffff;
        margin-bottom: 16rpx;

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
    }
}
</style>