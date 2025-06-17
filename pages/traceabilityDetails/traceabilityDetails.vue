<template>
    <view>
        <TransNavVue title="溯源商品" />
        <view class="container">
            <scroll-view scroll-y class="content">
                <image style="width: 100%; height: 300rpx" src="/static/logo.png"></image>
                <view class="pay-box">
                    <view class="commodity-box">
                        <view class="commodity-title">
                            <image style="width: 140rpx; height: 140rpx" src="/static/logo.png"></image>
                            <view class="title-info">
                                <view>云峰场</view>
                                <view>傻逼小礼盒</view>
                                <view>MSDHAKLDWAL;DJADLAD</view>
                            </view>
                        </view>
                   
                    </view>

                    <view class="commodity-info">
                            <view class="info-title">
                                <image style="width: 20rpx; height: 20rpx" src="/static/logo.png"></image>
                                购物信息
                            </view>

                            <view>
                                <view class="info-item">
                                    <text>防伪标志</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                                <view class="info-item">
                                    <text>防伪标志</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                                <view class="info-item">
                                    <text>防伪标志</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                            </view>
                            <view class="angin-buy"><view class="buy">再次购买</view></view>
                    </view>
                </view>

                <view class="item-box">
                    <view class="commodity-info">
                            <view class="info-title">
                                <image style="width: 20rpx; height: 20rpx" src="/static/logo.png"></image>
                                商品批次信息
                            </view>

                            <view>
                                <view class="info-item">
                                    <text>品牌</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                                <view class="info-item">
                                    <text>品名</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                                <view class="info-item">
                                    <text>产地</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                                <view class="info-item">
                                    <text>蜜源种类</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                                <view class="info-item">
                                    <text>加工批号</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                                <view class="info-item">
                                    <text>企业</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                            </view>
                           
                    </view>
                </view>

                <view class="item-box">
                    <view class="commodity-info">
                            <view class="info-title">
                                <image style="width: 20rpx; height: 20rpx" src="/static/logo.png"></image>
                                质检信息
                            </view>

                            <view>
                                <view class="info-item">
                                    <text>资质信息</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                                <view class="info-item">
                                    <text>资质信息</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                                <view class="info-item">
                                    <text>资质信息</text>
                                    <text>NMFJEKFHGJ</text>
                                </view>
                            </view>
                            <view class="angin-buy"><view class="buy">再次购买</view></view>
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

onShow(() => {
    // getSmartBeeList()
});
//获取智能养蜂内容
const getSmartBeeList = async () => {
    try {
        const res = await request({
            url: "/app-api/weixin/bee-keeping/get/list",
            showLoading: true,
        });

        if (res.code === 0 || res.code === 200) {
        } else {
            throw new Error(res.msg || "数据异常");
        }
    } catch (err) {
        console.error("获取智能养蜂内容:", err);
        uni.showToast({
            title: "获取内容失败",
            icon: "error",
        });
    }
};
</script>

<style lang="scss" scoped>
.container {
    background-color: #f7f7f7;
    height: 100vh;

    .pay-box {
        background-color: #fff;
        width: 100%;
        height: 500rpx;
        position: relative;
        padding-top: 100rpx;
        margin-bottom: 10rpx;

        .commodity-box {
            padding: 0 40rpx;
            position: absolute;
            height: 200rpx;
            top: -100rpx;
            left: 0rpx;
            right: 0rpx;
            z-index: 1;

            .commodity-title {
                background-color: yellow;
                padding: 20rpx;
                display: flex;

                align-items: center;

                .title-info {
                    margin-left: 20rpx;
                }
            }
        }

        .commodity-info {
           
            padding:  20rpx;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .info-title {
                margin-bottom: 20rpx;
                display: flex;
                align-items: center;
            }

            .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .angin-buy {
                 display: flex;
              justify-content: center;
            .buy{
                width: 200rpx;
                height: 60rpx;
                line-height: 60rpx;
                background-color: red;
                color: #fff;
                text-align: center;
                border-radius: 20rpx;
            }
         }
        }


       
    }
    .item-box{
        background-color: #fff;
        width: 100%;
        height: 500rpx;
        margin-bottom: 10rpx;
        padding-top: 30rpx;
        .commodity-info {
           padding:  20rpx;
           height: 100%;
           .info-title {
               margin-bottom: 20rpx;
               display: flex;
               align-items: center;
           }

           .info-item {
               display: flex;
               justify-content: space-between;
               align-items: center;
           }

        
       }

    }
}
</style>