<template>
    <view class="container">
        <TransNavVue title="确认订单"></TransNavVue>
        <view class="pay-center">
            <view v-if="addrdessList.consigneeName" class="name-box">
                <view class="address-header">
                    <text>{{ addrdessList.consigneeName }}&nbsp;{{ addrdessList.phoneNumber }}</text>
                    <text class="change-btn" @click="openAddressPopup">更换地址</text>
                </view>
                <view class="address-content">
                    <text>{{addrdessList.province}}{{addrdessList.city}}{{addrdessList.region}}{{addrdessList.addressDetail}}</text>
                </view>
            </view>
            <view v-else class="empty-address" @click="goToAddAddress">
                <text>暂无收货地址，去添加</text>
                <image src="/static/images/rightBtn.png" mode="aspectFit"></image>
            </view>
            
            <!-- 商品列表 -->
            <view class="pay-details" v-for="(item, index) in selectedItems" :key="index">
                <view class="details-box">
                    <image :src="item.sku.picUrl || '/static/images/default-goods.png'" class="details-img" mode="aspectFill"></image>
                    <view class="info">
                        <text class="goods-name">{{item.name}}</text>
                        <view class="details-price">￥{{(item.sku.price/100).toFixed(2) ||'-'}}</view>
                    </view>
                </view>
                <view class="details-info">
                    <text>商品价格</text>
                    <text>￥{{(item.sku.price/100).toFixed(2) ||'-'}}</text>
                </view>
                <view class="details-info">
                    <text>购买数量</text>
                    <text>{{item.count}}</text>
                </view>
            </view>
            
            <!-- 优惠券区域 -->
            <view class="sale-box" @click="openCouponPopup">
                <text>优惠券</text>
                <text class="coupon-count">{{selectedCoupon ? selectedCoupon.name : '未选择'}}</text>
                <image src="/static/images/rightBtn.png" mode="aspectFit"></image>
            </view>
            
            <!-- 支付方式 -->
            <view class="pay-method">
                <text class="method-title">支付方式</text>
                <view class="payment-option" @click="selectPayment('wechatPay')">
                    <view class="option-icon">
                        <image src="/static/images/wechat-pay.png" mode="scaleToFill"></image>
                    </view>
                    <view class="option-content">
                        <text class="option-name">微信支付</text>
                        <view class="option-desc">使用微信快捷支付</view>
                    </view>
                    <view class="option-radio">
                        <radio :checked="paymentMethod === 'wechatPay'" color="#ff6f0e"></radio>
                    </view>
                </view>
            </view>
            
            <!-- 订单摘要 -->
            <view class="order-summary">
                <view class="summary-item">
                    <text>商品总价</text>
                    <text>￥{{(goodsTotalPrice/100).toFixed(2)}}</text>
                </view>
                <view class="summary-item" v-if="selectedCoupon">
                    <text>{{selectedCoupon.name}}</text>
                    <text class="coupon-discount">-￥{{(selectedCoupon.discountAmount/100).toFixed(2)}}</text>
                </view>
                <view class="summary-item">
                    <text>运费</text>
                    <text>￥{{(shippingFee/100).toFixed(2)}}</text>
                </view>
            </view>
        </view>
        
        <!-- 底部支付栏 -->
        <view class="pay-bottom">
            <view class="pay-content">
                <view class="total">
                    合计：
                    <view class="price">
                        ￥{{(totalPrice/100).toFixed(2) ||'-'}}
                    </view>
                </view>
                <view class="pay-btn">
                    <button class="settle-btn" :loading="isPaying" @click="handlePay">确认支付</button>
                </view>
            </view>
        </view>
        
        <!-- 地址选择弹窗 -->
        <uni-popup ref="addressPopup" type="bottom">
            <view class="address-popup">
                <view class="popup-header">
                    <text class="popup-title">选择收货地址</text>
                    <text class="popup-close" @click="addressPopupClose">×</text>
                </view>
                <scroll-view scroll-y class="address-list">
                    <view 
                        v-for="(item, index) in addressList" 
                        :key="index" 
                        class="address-item"
                        @click="selectAddress(item)"
                    >
                        <radio :checked="item.isDefault" color="#ff6f0e"></radio>
                        <view class="address-info">
                            <view class="address-name">
                                <text>{{item.consigneeName}}</text>
                                <text>{{item.phoneNumber}}</text>
                            </view>
                            <text class="address-detail">{{item.province}}{{item.city}}{{item.region}}{{item.addressDetail}}</text>
                        </view>
                    </view>
                </scroll-view>
                <view class="add-address-btn" @click="goToAddAddress">
                    <text>+ 添加新地址</text>
                </view>
            </view>
        </uni-popup>
        
        <!-- 优惠券选择弹窗 -->
        <uni-popup ref="couponPopup" type="bottom">
            <view class="coupon-popup">
                <view class="popup-header">
                    <text class="popup-title">选择优惠券</text>
                    <text class="popup-close" @click="couponPopupClose">×</text>
                </view>
                <scroll-view scroll-y class="coupon-list">
                    <view 
                        v-for="(item, index) in availableCoupons" 
                        :key="index" 
                        class="coupon-item"
                        @click="selectCoupon(item)"
                    >
                        <view class="coupon-content">
                            <view class="coupon-value">
                                <text>￥{{(item.discountAmount/100).toFixed(2)}}</text>
                            </view>
                            <view class="coupon-info">
                                <text class="coupon-name">{{item.name}}</text>
                                <text class="coupon-condition">满{{(item.threshold/100).toFixed(2)}}可用</text>
                                <text class="coupon-date">{{item.validDate}}</text>
                            </view>
                            <view class="coupon-select">
                                <radio :checked="selectedCoupon?.id === item.id" color="#ff6f0e"></radio>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <view class="no-coupon" v-if="availableCoupons.length === 0">
                    <text>暂无可用优惠券</text>
                </view>
            </view>
        </uni-popup>
        
        <!-- 订单确认弹窗 -->
        <uni-popup ref="orderConfirmPopup" type="center">
            <view class="order-confirm-popup">
                <view class="confirm-title">确认订单</view>
                <view class="confirm-items">
                    <view class="confirm-item">
                        <text>商品总价</text>
                        <text>￥{{(goodsTotalPrice/100).toFixed(2)}}</text>
                    </view>
                    <view class="confirm-item" v-if="selectedCoupon">
                        <text>{{selectedCoupon.name}}</text>
                        <text class="coupon-discount">-￥{{(selectedCoupon.discountAmount/100).toFixed(2)}}</text>
                    </view>
                    <view class="confirm-item">
                        <text>运费</text>
                        <text>￥{{(shippingFee/100).toFixed(2)}}</text>
                    </view>
                    <view class="confirm-item total">
                        <text>实付款</text>
                        <text class="total-amount">￥{{(totalPrice/100).toFixed(2)}}</text>
                    </view>
                </view>
                <view class="confirm-buttons">
                    <button class="cancel-btn" @click="orderConfirmPopupClose">取消</button>
                    <button class="confirm-btn" @click="confirmPay">确认支付</button>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<style lang="scss" scoped>
.container {
    background-color: #f7f7f7;
    padding-bottom: 40rpx;
    min-height: 100vh;
    
    .pay-center {
        padding: 30rpx 30rpx 0rpx;
        
        .name-box {
            background-color: #fff;
            border-radius: 20rpx;
            padding: 20rpx;
            margin-bottom: 20rpx;
            
            .address-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10rpx;
                
                .change-btn {
                    color: #ff6f0e;
                    font-size: 28rpx;
                }
            }
            
            .address-content {
                color: #666;
                font-size: 28rpx;
            }
        }
        
        .pay-details {
            margin-top: 20rpx;
            background-color: #fff;
            border-radius: 20rpx;
            padding: 20rpx;
            margin-bottom: 20rpx;
            
            .details-box {
                display: flex;
                
                .details-img {
                    width: 150rpx;
                    height: 150rpx;
                    background-color: #c3c3c3;
                    border-radius: 5rpx;
                }
                
                .info {
                    margin-left: 20rpx;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    
                    .goods-name {
                        font-size: 32rpx;
                        line-height: 40rpx;
                        max-height: 80rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    
                    .details-price {
                        color: orange;
                        font-size: 32rpx;
                    }
                }
            }
            
            .details-info {
                margin-top: 10rpx;
                color: #666;
                display: flex;
                justify-content: space-between;
                font-size: 28rpx;
            }
        }
        
        .sale-box {
            margin-top: 20rpx;
            background-color: #fff;
            border-radius: 20rpx;
            padding: 20rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20rpx;
            
            .coupon-count {
                flex: 1;
                text-align: right;
                margin-right: 20rpx;
                color: #666;
            }
            
            image {
                width: 24rpx;
                height: 24rpx;
            }
        }
        
        .pay-method {
            margin-top: 20rpx;
            background-color: #fff;
            border-radius: 20rpx;
            padding: 20rpx;
            margin-bottom: 20rpx;
            
            .method-title {
                color: #999;
                font-size: 30rpx;
                margin-bottom: 15rpx;
            }
            
            .payment-option {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .option-icon {
                width: 60rpx;
                height: 60rpx;
                margin-right: 20rpx;
            }
            
            .option-icon image {
                width: 100%;
                height: 100%;
            }
            
            .option-content {
                margin-top: 10rpx;
                flex: 1;
            }
            
            .option-name {
                font-size: 36rpx;
                color: #333;
            }
            
            .option-desc {
                font-size: 28rpx;
                color: #999;
                margin-top: 5rpx;
            }
            
            .option-radio {
                width: 40rpx;
                height: 40rpx;
            }
        }
        
        .order-summary {
            background-color: #fff;
            border-radius: 20rpx;
            padding: 20rpx;
            
            .summary-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15rpx 0;
                border-bottom: 1rpx solid #eee;
                
                &:last-child {
                    border-bottom: none;
                }
                
                .coupon-discount {
                    color: #ff6f0e;
                }
            }
        }
    }
    
    .pay-bottom {
        position: fixed;
        width: 100%;
        bottom: 0px;
        height: 148rpx;
        padding: 0 32rpx;
        background: #ffffff;
        border-top: 1rpx solid #eeeeee;
        
        .pay-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            
            .pay-btn {
                .settle-btn {
                    width: 280rpx;
                    height: 96rpx;
                    background: #ff6f0e;
                    border-radius: 50rpx;
                    font-weight: 500;
                    font-size: 32rpx;
                    color: #ffffff;
                    line-height: 96rpx;
                }
            }
            
            .total {
                display: flex;
                align-items: center;
                font-weight: 500;
                font-size: 28rpx;
                color: #333333;
                
                .price {
                    display: flex;
                    align-items: center;
                    font-weight: bold;
                    font-size: 48rpx;
                    color: #fa4b46;
                    
                    text {
                        font-size: 28rpx;
                    }
                }
            }
        }
    }
}

.empty-address {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ff6f0e;
    font-size: 32rpx;
    margin-bottom: 20rpx;
    
    image {
        width: 40rpx;
        height: 40rpx;
    }
}

.address-popup {
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 30rpx;
    max-height: 70vh;
    
    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30rpx;
        
        .popup-title {
            font-size: 32rpx;
            font-weight: bold;
        }
        
        .popup-close {
            font-size: 40rpx;
            color: #999;
        }
    }
    
    .address-list {
        max-height: 50vh;
        padding-bottom: 20rpx;
    }
    
    .address-item {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #eee;
        
        .address-info {
            margin-left: 20rpx;
            
            .address-name {
                display: flex;
                margin-bottom: 10rpx;
                
                text:first-child {
                    margin-right: 20rpx;
                    font-weight: bold;
                }
            }
            
            .address-detail {
                color: #666;
                font-size: 28rpx;
            }
        }
    }
    
    .add-address-btn {
        text-align: center;
        padding: 20rpx 0;
        color: #ff6f0e;
        font-size: 32rpx;
        border-top: 1rpx solid #eee;
    }
}

.coupon-popup {
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 30rpx;
    max-height: 70vh;
    
    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30rpx;
        
        .popup-title {
            font-size: 32rpx;
            font-weight: bold;
        }
        
        .popup-close {
            font-size: 40rpx;
            color: #999;
        }
    }
    
    .coupon-list {
        max-height: 50vh;
        padding-bottom: 20rpx;
    }
    
    .coupon-item {
        margin-bottom: 20rpx;
    }
    
    .coupon-content {
        display: flex;
        align-items: center;
        background-color: #fff0e6;
        border-radius: 15rpx;
        padding: 20rpx;
    }
    
    .coupon-value {
        width: 150rpx;
        text-align: center;
        color: #ff6f0e;
        
        text {
            font-size: 48rpx;
            font-weight: bold;
        }
    }
    
    .coupon-info {
        flex: 1;
        padding: 0 20rpx;
        
        .coupon-name {
            font-size: 32rpx;
            font-weight: bold;
            margin-bottom: 10rpx;
        }
        
        .coupon-condition {
            font-size: 28rpx;
            color: #666;
            margin-bottom: 5rpx;
        }
        
        .coupon-date {
            font-size: 24rpx;
            color: #999;
        }
    }
    
    .coupon-select {
        width: 40rpx;
        height: 40rpx;
    }
    
    .no-coupon {
        text-align: center;
        padding: 40rpx 0;
        color: #999;
    }
}

.order-confirm-popup {
    background-color: #fff;
    border-radius: 20rpx;
    width: 600rpx;
    padding: 40rpx;
    
    .confirm-title {
        text-align: center;
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 30rpx;
    }
    
    .confirm-items {
        margin-bottom: 40rpx;
    }
    
    .confirm-item {
        display: flex;
        justify-content: space-between;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #eee;
        font-size: 32rpx;
        
        &.total {
            font-weight: bold;
            color: #ff6f0e;
        }
        
        .total-amount {
            font-size: 36rpx;
        }
        
        .coupon-discount {
            color: #ff6f0e;
        }
    }
    
    .confirm-buttons {
        display: flex;
        justify-content: space-between;
        padding-top: 20rpx;
    }
    
    .cancel-btn {
        width: 260rpx;
        height: 90rpx;
        line-height: 90rpx;
        text-align: center;
        border: 1rpx solid #ff6f0e;
        border-radius: 50rpx;
        color: #ff6f0e;
        font-size: 32rpx;
    }
    
    .confirm-btn {
        width: 260rpx;
        height: 90rpx;
        line-height: 90rpx;
        text-align: center;
        background-color: #ff6f0e;
        border-radius: 50rpx;
        color: #fff;
        font-size: 32rpx;
    }
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { request } from '@/utils/request';
import { useTokenStorage } from '../../utils/storage';
import TransNavVue from '../../components/TransNav.vue';
import { onShow } from '@dcloudio/uni-app';
import { appendFile } from 'fs';

const { getAccessToken } = useTokenStorage();

// 状态管理
const selectedItems = ref([]);
const totalPrice = ref(0);
const addrdessList = ref({});
const addressList = ref([]);
const addressPopup = ref(null);
const couponPopup = ref(null);
const orderConfirmPopup = ref(null);
const availableCoupons = ref([]);
const selectedCoupon = ref(null);
const paymentMethod = ref('wechatPay');
const isPaying = ref(false);
const goodsTotalPrice = computed(() => {
    return selectedItems.value.reduce((total, item) => {
        return total + (item.sku.price * item.count);
    }, 0);
});
const shippingFee = ref(0);

// 获取地址列表
const getAddressList = async () => {
    try {
        const res = await request({
            url: '/app-api/weixin/shipping-address/list',
            showLoading: true,
        });
        
        if (res.code === 0 || res.code === 200) {
            addressList.value = res.data || [];
            // 设置默认地址
            const defaultAddress = res.data.find(item => item.isDefault) || res.data[0];
            if (defaultAddress) {
                addrdessList.value = defaultAddress;
            }
        } else {
            uni.showToast({
                title: res.msg || '获取地址列表失败',
                icon: 'none'
            });
        }
    } catch (err) {
        console.error('获取地址列表失败:', err);
        uni.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none'
        });
    }
};

// 获取优惠券列表
const getCouponList = async () => {
    try {
        const res = await request({
            url: '/app-api/weixin/coupon/available',
            data: {
                orderAmount: goodsTotalPrice.value
            },
            showLoading: true
        });
        
        if (res.code === 0 || res.code === 200) {
            availableCoupons.value = res.data || [];
            // 默认选择第一张优惠券
            if (availableCoupons.value.length > 0) {
                selectedCoupon.value = availableCoupons.value[0];
                calculateTotalPrice();
            }
        } else {
            uni.showToast({
                title: res.msg || '获取优惠券失败',
                icon: 'none'
            });
        }
    } catch (err) {
        console.error('获取优惠券失败:', err);
        uni.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none'
        });
    }
};

// 计算最终价格
const calculateTotalPrice = () => {
    let total = goodsTotalPrice.value + shippingFee.value;
    if (selectedCoupon.value) {
        total -= selectedCoupon.value.discountAmount;
    }
    totalPrice.value = total < 0 ? 0 : total;
};

// 地址选择相关
const selectAddress = (item) => {
    // 取消所有地址的选中状态
    addressList.value.forEach(addr => {
        addr.isDefault = false;
    });
    // 设置当前选中地址
    item.isDefault = true;
    addrdessList.value = item;
    addressPopup.value.close();
};

const openAddressPopup = () => {
    // 打开弹窗前确保当前地址被选中
    if (addrdessList.value.id) {
        addressList.value.forEach(addr => {
            addr.isDefault = addr.id === addrdessList.value.id;
        });
    }
    addressPopup.value.open();
};

const addressPopupClose = () => {
    addressPopup.value.close();
};

// 优惠券选择相关
const selectCoupon = (item) => {
    selectedCoupon.value = item;
    calculateTotalPrice();
    couponPopup.value.close();
};

const openCouponPopup = () => {
    couponPopup.value.open();
};

const couponPopupClose = () => {
    couponPopup.value.close();
};

// 订单确认弹窗相关
const openOrderConfirmPopup = () => {
    orderConfirmPopup.value.open();
};

const orderConfirmPopupClose = () => {
    orderConfirmPopup.value.close();
};

// 支付方式选择
const selectPayment = (method) => {
    paymentMethod.value = method;
};

// 页面加载和显示时获取数据
onShow(() => {
    getAddressList();
});

onMounted(() => {
    // 获取从购物车或商品详情页传递过来的商品信息
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    if (currentPage && currentPage.$vm) {
        const eventChannel = currentPage.$vm.getOpenerEventChannel();
        
        eventChannel.on('acceptSelectedItems', (data) => {
            if (data?.selectedItems && data.selectedItems.length > 0) {
                selectedItems.value = data.selectedItems;
                shippingFee.value = data.shippingFee || 0;
                calculateTotalPrice();
                getAddressList();
                // getCouponList();
            } else {
                uni.showToast({ title: '参数错误', icon: 'none' });
                setTimeout(() => {
                    uni.navigateBack();
                }, 1500);
            }
        });
    }
});

// 跳转到添加地址页面
const goToAddAddress = () => {
    uni.navigateTo({
        url: '/pages/userInfo/addressEdit'
    });
};

// 支付流程
const handlePay = () => {
    // 检查是否有收货地址
    if (!addrdessList.value.id) {
        uni.showToast({
            title: '请选择收货地址',
            icon: 'none'
        });
        return;
    }
    
    // 检查是否有商品
    if (selectedItems.value.length === 0) {
        uni.showToast({
            title: '购物车为空',
            icon: 'none'
        });
        return;
    }
    
    // 打开订单确认弹窗
    openOrderConfirmPopup();
};

// 确认支付
const confirmPay = async () => {
    orderConfirmPopupClose();
    
    if (isPaying.value) return;
    isPaying.value = true;
    
    try {
        // 1. 先创建订单
        const orderRes = await request({
            url: '/app-api/trade/cart/create/cartOrder',
            data: {
                items: selectedItems.value.map(item => ({
                    skuId: item.sku.id,
                    count: item.count
                })),
                receiverName: addrdessList.value.consigneeName,
                receiverMobile: addrdessList.value.phoneNumber,
                receiverAddress: `${addrdessList.value.province}${addrdessList.value.city}${addrdessList.value.region}${addrdessList.value.addressDetail}`,
                deliveryType: 1,
                // couponId: selectedCoupon.value?.id || null
            },
            method: 'post',
            showLoading: true,
        });

        if (orderRes.code === 0 ) {
            const payOrderId = orderRes.data.payOrderId;
			const paylist = await request({
            url: '/app-api/pay/order/submit',
            data: {
                id: payOrderId,
				channelCode: 'wx_lite',
				channelExtras:{
					openid: 'o_zHs0KUgGP6EbmivsvWcM2EoZiA'
				}
            },
            method: 'post',
            showLoading: true,
        });
		if (paylist.code === 0 ) {
			const payParams = JSON.parse(paylist.data.displayContent)
			const orderInfoList= {
				appid: String(payParams.appId),         // 确保是字符串
				timeStamp: String(payParams.timeStamp),  // 确保是字符串
                nonceStr: String(payParams.nonceStr),    // 确保是字符串
                package: payParams.packageValue,         // 注意参数名可能是packageValue
                signType: payParams.signType,
                paySign: String(payParams.paySign),
				}
				console.log('订单信息:', orderInfoList);
			 // 2. 调用微信支付API
			 const payRes = await uni.requestPayment({
                provider: 'wxpay',
                orderInfo: orderInfoList,
                success: (res) => {
                    uni.showToast({
                        title: '支付成功',
                        icon: 'success'
                    });
                    console.log('支付成功:', res);
                     // 3. 支付成功后跳转到订单详情页
                    // setTimeout(() => {
                    //     uni.redirectTo({
                    //         url: `/pages/order/orderDetail?orderId=${orderId}`
                    //     });
                    // }, 1500);
                },
                fail: (err) => {
                    console.error('支付失败:', err);
                    
                    if (err.errMsg.includes('cancel')) {
                        uni.showToast({
                            title: '支付已取消',
                            icon: 'none'
                        });
                    } else {
                        uni.showToast({
                            title: '支付失败，请重试',
                            icon: 'none'
                        });
                    }
                    
                    // 4. 支付失败后跳转到订单列表页
                    setTimeout(() => {
                        uni.redirectTo({
                            url: '/pages/order/orderList'
                        });
                    }, 1500);
                }
            });
		}
            
          
        } else {
            throw new Error(orderRes.msg || '订单创建失败');
        }
    } catch (err) {
        console.error('支付流程出错:', err);
        uni.showToast({
            title: err.message || '支付出错，请重试',
            icon: 'none'
        });
    } finally {
        isPaying.value = false;
    }
};
</script>    