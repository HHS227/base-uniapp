<template>
    <view>
        <TransNavVue title="溯源商品" />
        <view class="container">
            <scroll-view scroll-y class="content">
                <image style="width: 100%; height: 300rpx" :src="traceabilityData.temperature"></image>
                <view class="pay-box">
                    <view class="commodity-box">
                        <view class="commodity-title">
                            <view><image style="width: 140rpx; height: 140rpx" :src="traceabilityData.brandUrl"></image></view>
                            <view class="title-info">
                            <view>云峰场</view>
                            <view>{{traceabilityData.productName }}</view>
                            <view class="title-red">{{traceabilityData.traceabilityCode }}</view>
                            </view>
                        </view>
                   
                    </view>

                    <view class="commodity-info">
                            <view class="first-title"> 购物信息 </view>
                            <view>
                                <view class="info-item">
                                    <text class="itme-left">防伪编号</text>
                                    <text class="itme-right">{{traceabilityData.traceabilityCode}}</text>
                                </view>
                                <view class="info-item">
                                    <text class="itme-left">首次登记时间</text>
                                    <text class="itme-right">{{formatDateTime (traceabilityData.registeredTime)}}</text>
                                </view>
                                <view class="info-item">
                                    <text class="itme-left">首次登记地点</text>
                                    <text class="itme-right">{{traceabilityData.registeredAddress}}</text>
                                </view>
                            </view>
                            <!-- <view class="angin-buy"><view class="buy" @click="anginBuy(traceabilityData.productId)">再次购买</view></view> -->
                    </view>
                </view>

                <view class="item-box">
                        <view class="first-title"> 商品批次信息 </view>
                         <view>
                                <view class="info-item">
                                    <text class="itme-left">品牌</text>
                                    <text class="itme-right">{{traceabilityData.brand}}</text>
                                </view>
                                <view class="info-item">
                                    <text class="itme-left">品名</text>
                                    <text class="itme-right">{{traceabilityData.productName}}</text>
                                </view>
                                <view class="info-item">
                                    <text class="itme-left">源蜜场地</text>
                                    <text class="itme-right">{{traceabilityData.honeyOrigin}}</text>
                                </view>
                                <view class="info-item">
                                    <text class="itme-left">产品规格</text>
                                    <text class="itme-right">{{traceabilityData.specification}}</text>
                                </view>
                                <view class="info-item">
                                    <text class="itme-left">加工批号</text>
                                    <text class="itme-right">{{traceabilityData.no}}</text>
                                </view>
                                <view class="info-item">
                                    <text class="itme-left">出品企业</text>
                                    <text class="itme-right">{{traceabilityData.producedCompany}}</text>
                                </view>
                        </view>      
                </view>

                <view class="item-box">
                    <view class="first-title"> 质检信息 </view>
                    <view> <image style="width: 100%; height: 400rpx" :src="traceabilityData.qualityUrl"></image> </view>
                </view>


                <view class="map-box">
                    <view class="first-title"> 蜂场信息 </view>

                    <view class="map-container">
                        <map  id="map"   style="width: 100%; height: 500rpx;"  
                          :latitude="userLocation.latitude" 
                          :longitude="userLocation.longitude" 
                          :markers="markers" show-location >
                        </map>
                    </view>

                    <view class="map-info">
                            <view class="info">
                                <text>箱内温度</text>
                                <view class="info-icon">
                                     <image style="width: 60rpx; height: 60rpx ; margin-right: 20rpx;" src="/static/images/homePage/temperatureIcon.png" ></image>
                                     <text>{{traceabilityData.facilityInfo.temperature }}</text></view>
                            </view>
                            <view class="info">
                                <text>箱内湿度</text>
                                <view class="info-icon"> <image style="width: 60rpx; height: 60rpx ; margin-right: 20rpx;" src="/static/images/homePage/humidityIcon.png" ></image> 
                                    <text>{{traceabilityData.facilityInfo.humidity }}</text></view>
                            </view>
                            <view class="info">
                                <text>箱内重量</text>
                          <view class="info-icon"> <image style="width: 60rpx; height: 60rpx ; margin-right: 20rpx;" src="/static/images/homePage/weightIcon.png" ></image> 
                            <text>{{traceabilityData.facilityInfo.weight}}</text></view>
                            </view>
                            <view class="info">
                                <text>当日进出量</text>
                          <view class="info-icon"> <image style="width: 60rpx; height: 60rpx ; margin-right: 20rpx;" src="/static/images/homePage/travelIcon.png" ></image>
                             <text>{{traceabilityData.facilityInfo.inAndOut}}</text></view>
                            </view>
                            <view class="info">
                                <text>箱内声音</text>
                          <view class="info-icon"> <image style="width: 60rpx; height: 60rpx ; margin-right: 20rpx;" src="/static/images/homePage/soundIcon.png" ></image> 
                            <text>{{traceabilityData.facilityInfo.sound}}</text></view>
                            </view>
                            <view class="info">
                                <text>当前蜜源</text>
                          <view class="info-icon"> <image style="width: 60rpx; height: 60rpx ; margin-right: 20rpx;" src="/static/images/homePage/flowerIcon.png" ></image> 
                            <text>{{traceabilityData.farm.honeySeeds}}</text></view>
                            </view>
                           
                    </view>
                    <view class="update">
                        <text>更新时间:2025-02-05</text>
                        <view class="remark-box">
                            注：本智能蜂箱仅为生成批次蜜源来源蜂箱之一，因季节花期变迁，与溯源产品蜜源可能不同
                        </view>
                    </view>
                </view>

                <view class="item-box">
                    <view class="first-title"> 蜜源来自{{  traceabilityData.farm.name}} </view>
                    <view> 
                        <video style="width: 100%; height: 400rpx" :src="traceabilityData.farm.videoUrl"></video>
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
import {formatDateTime}  from '../../utils/system'

const traceabilityData=ref({})
// 用户位置 - 不设置默认值
const userLocation = ref({
    latitude: null, 
    longitude: null 
});
// 地图标记点
const markers = ref([]);
onShow(() => {
    const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const options = currentPage.$page.options || currentPage.options
	if (options.id) {
        getScanList(options.id)
	} else {
	  console.error('溯源码缺失')
	}
});
//获取溯源内容
const getScanList = async (id) => {
    try {
        const res = await request({
            url: `/app-api/weixin/productTrace/scan/qrCode?traceabilityCode=${id}`,
            showLoading: true,
        });
        if (res.code === 0 ) {
            traceabilityData.value=res.data
            userLocation.value = {latitude: res.data.farm.latitude,longitude: res.data.farm.longitude };
        } else {
            throw new Error(res.msg || "数据异常");
        }
    } catch (err) {
        console.error("获取溯源内容:", err);
      
    }
};

const anginBuy =(id)=>{
    uni.navigateTo({
        url:`/pages/shoppingMall/shopDetails?id=${item.id}`
    })
}


</script>

<style lang="scss" scoped>
.container {
    background-color: #f7f7f7;
    height: 100%;
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
                background-color: #FDD000;
                height: 100%;
                padding: 20rpx;
                display: flex;
                align-items: center;
                border-radius: 20rpx;
                font-size: 26rpx;
                .title-info {
                    margin-left: 20rpx;
                    .title-red{
                        margin-top: 20rpx;
                        color: #FC5E43;
                    }
                }
            }
        }

        .commodity-info {
            padding:  20rpx;
            height: 100%;
        
          
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

            .angin-buy {
             display: flex;
              justify-content: center;
            .buy{
                width: 300rpx;
                height: 70rpx;
                line-height: 70rpx;
                background-color: #FF6F0E;
                color: #fff;
                text-align: center;
                border-radius: 50rpx;
                font-size: 30rpx;
            }
         }
        }


       
    }
    .item-box{
        background-color: #fff;
        height: 500rpx;
        margin-bottom: 10rpx;
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
    .map-box{
        background-color: #fff;
        height: 1000rpx;
        margin-bottom: 10rpx;
        padding:  20rpx;
        .first-title{
                margin-bottom: 20rpx;
                font-weight: bold;
                font-size: 42rpx;
            }
        .map-container {
                 margin: 20rpx;
                border: 2rpx solid #e0e0e0;
                border-radius: 10rpx;
                 overflow: hidden;
    }
    .map-info{
        display: flex;
        flex-wrap: wrap;
        margin-top: 20rpx;
        .info{
            width: 33%;
            color: #999999;
            font-size: 26rpx;
            .info-icon{
                display: flex;
                align-items: center;
                font-weight: bold;
                color: #333333;
            }
        }
    }
    .update{
        margin-top: 20rpx;
        font-size: 26rpx;
        .remark-box{
        margin-top: 10rpx;
        height: 100rpx;
        padding: 10rpx;
        background-color: #f7f7f7;
        color: #999;
        
     }
    }
  
    }

}
</style>