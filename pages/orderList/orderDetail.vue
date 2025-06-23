<template>
    <view>
        <TransNavVue title="订单详情" />
        <view class="container">
            <scroll-view scroll-y class="content">
                <view class="item-box">
                    <view class="first-title"> 物流信息 </view>
                    <view style="text-align: center; color:#ff6f0e">等待卖家发货</view>
                    <view style=" text-align: center;margin-top: 20rpx; color:#999 ;font-size: 24rpx;">商品正在仓库打包,请耐心等待
                    </view>

                </view>
                <view class="item-box">
                    <view class="first-title"> 商品信息 </view>

                    <view class="productBox">
                        <view class="product-item" v-for="(item,index) in orderDetail.itemList" :key="index">
                            <image class="product-img" :src="item.productImg"></image>
                            <view class="product-name">
                                <view>{{ item.productName }}</view>
                                <view>x{{ item.productNumber }}</view>
                            </view>
                            <view class="product-price">
                                ￥{{ item.productPrice }}
                            </view>
                        </view>
                    </view>

                
                    <view class="info-item">
                        <text class="item-left">优惠金额</text>
                        <text class="product-price">￥{{ orderDetail.lessAmount ||0}}</text>
                    </view>
                    <view class="info-item">
                        <text class="item-left">支付金额</text>
                        <text class="product-price">￥{{ orderDetail.amount }}</text>
                    </view>





                </view>
                <view class="item-box">
                    <view class="first-title"> 订单信息 </view>
                    <view class="info-item">
                        <text class="item-left">下单时间</text>
                        <text class="item-detail">{{ formatDateTime(orderDetail.createTime) }}</text>
                    </view>
                    <view class="info-item">
                        <text class="item-left">订单号</text>
                        <text class="item-detail">{{ orderDetail.orderId }}</text>
                    </view>
                    <view class="info-item">
                        <text class="item-left">商户号</text>
                        <text class="item-detail">{{ orderDetail.merchantId }}</text>
                    </view>
                    <view class="info-item">
                        <text class="item-left">支付方式</text>
                        <text class="item-detail">微信支付</text>
                    </view>
                    <view class="info-item">
                        <text class="item-left">配送方式</text>
                        <text class="item-detail">快递运输</text>
                    </view>


                </view>

            </scroll-view>
        </view>
    </view>
</template>

<script setup>
import { ref } from "vue";
import { request } from "@/utils/request";
import TransNavVue from "../../components/TransNav.vue";
import { onShow } from "@dcloudio/uni-app";
import { formatDateTime } from '../../utils/system'

const orderDetail = ref({})

onShow(() => {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const options = currentPage.$page.options || currentPage.options
    if (options.id) {
        getOrderDetail(options.id)
    } else {
        console.error('订单id失效')
    }
});
//获取订单详情
const getOrderDetail = async (id) => {
    try {
        const res = await request({
            url: `/app-api/weixin/order/get/info?id=${id}`,
            showLoading: true,
        });
        if (res.code === 0) {
            orderDetail.value = res.data || {}
        } else {
            throw new Error(res.msg || "获取订单详情失败");
        }
    } catch (err) {
        console.error("获取订单详情失败:", err);

    }
};



</script>

<style lang="scss" scoped>
.container {
    background-color: #f7f7f7;
    height: 100vh;


    .item-box {
        background-color: #fff;
        margin-top: 20rpx;
        padding: 20rpx;

        .first-title {
            margin-bottom: 20rpx;
            font-weight: bold;
            font-size: 42rpx;

        }

        .productBox {
            border-bottom: 1rpx dashed #999 ;
            border-top: 1rpx dashed #999;
            padding: 20rpx;
            margin-bottom: 20rpx;
            .product-item {
                padding: 10rpx 0rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .product-img {
                    width: 100rpx;
                    height: 100rpx;
                }

                .product-name {
                    width: 50%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 22rpx;
                }

                

            }

        }

        .product-price {
                    font-size: 32rpx;
                    color: #ff6f0e;
                }
        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 26rpx;
            color: #000;
            margin-bottom: 20rpx;
            padding: 0 20rpx;

            .item-left {
                color: #999999;
            }

            .item-detail {
                max-width: 80%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

        }


    }


}
</style>