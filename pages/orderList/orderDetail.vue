<template>
    <view>
        <TransNavVue title="订单详情" />
        <view class="container">
            <scroll-view scroll-y class="content">
             
                <view class="item-box">
                        <view class="first-title"> 订单信息 </view>
                         <view>
                                <view class="info-item">
                                    <text class="item-left">商品名称</text>
                                    <text >{{ orderDetail.productName }}</text>
                                </view>
                                <view class="info-item">
                                    <text class="item-left">价格</text>
                                    <text >{{ orderDetail.amount }}</text>
                                </view>
                                <view class="info-item">
                                    <text class="item-left">源蜜场地</text>
                                    <text >{{ orderDetail.address }}</text>
                                </view>
                                <view class="info-item">
                                    <text class="item-left">产品规格</text>
                                    <text >{{ orderDetail.productName }}</text>
                                </view>
                                <view class="info-item">
                                    <text class="item-left">购买数量</text>
                                    <text >{{ orderDetail.productNumber }}</text>
                                </view>
                                <view class="info-item">
                                    <text class="item-left">下单时间</text>
                                    <text >{{formatDateTime(orderDetail.createTime) }}</text>
                                </view>
                                <view class="info-item">
                                    <text class="item-left">订单号</text>
                                    <text >{{ orderDetail.orderId }}</text>
                                </view>
                        </view>      
                </view>

                <view class="item-box">
                        <view class="first-title"> 物流信息 </view>
                    
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
import {formatDateTime}  from '../../utils/system'

const orderDetail=ref({})

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
const getOrderDetail= async (id) => {
    try {
        const res = await request({
            url: `/app-api/weixin/order/get/info?id=${id}`,
            showLoading: true,
        });
        if (res.code === 0 ) {
            orderDetail.value=res.data||{}
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
  
    .item-box{
        background-color: #fff;
        height: 500rpx;
         margin-top: 20rpx;
        padding:  20rpx;
           .first-title{
                margin-bottom: 20rpx;
                font-weight: bold;
                font-size: 42rpx;
               
            }

            .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 26rpx;
                color: #000;
                margin-bottom: 20rpx;
                .item-left{
                    color: #999999;
                }

            }
    }
   

}
</style>