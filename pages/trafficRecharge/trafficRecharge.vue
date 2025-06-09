<template>
    <view>
        <TransNavVue title="流量充值" />
        <view class="flow-management">
            <!-- 优惠推荐及流量展示区域 -->
            <view class="recommend-section" v-if="recommendPackage">
                <text class="tag">优惠推荐</text>
                <view class="flow-info">
                    <text class="flow-value">{{ recommendPackage.flowAmount }}G</text>
                    <text class="flow-unit">/流量</text>
                </view>
                <button class="buy-btn" type="default" size="mini" @click="handleBuyNow(recommendPackage)">
                    立即购买
                </button>
            </view>

            <!-- 流量充值选项区域 -->
            <view class="recharge-section">
                <text class="section-title">流量充值</text>
                <view class="recharge-list">
                    <button v-for="item in trafficList" :key="item.id" class="recharge-item"
                        :class="{ active: item.id === selectedPackageId }" @click="handleRechargeSelect(item)">
                        <text class="recharge-value">{{ item.flowAmount }}G</text>
                        <text class="recharge-price">{{ item.price }}元</text>
                        <text class="recommend-tag" v-if="item.isRecommend">推荐</text>
                    </button>
                </view>
            </view>

            <!-- 流量包说明区域 -->
            <view class="description-section" v-if="selectedPackage">
                <text class="section-title">流量包详情</text>
                <view class="package-detail">
                    <text class="detail-item">套餐名称: {{ selectedPackage.packageName }}</text>
                    <text class="detail-item">流量: {{ selectedPackage.flowAmount }}GB</text>
                    <text class="detail-item">价格: {{ selectedPackage.price }}元</text>
                    <text class="detail-item">有效期: {{ selectedPackage.validDays }}天</text>
                    <text class="detail-item" v-if="selectedPackage.description">套餐说明: {{ selectedPackage.description
                        }}</text>
                </view>
            </view>

            <!-- 协议及购买按钮区域 -->
            <view class="agreement-section">
                <checkbox-group @change="handleAgreementChange">
                    <label class="agreement-label">
                        <checkbox :checked="agreementChecked" />
                        <text>我已阅读并同意平台《用户协议》</text>
                    </label>
                </checkbox-group>
                <button class="confirm-buy-btn" :disabled="!agreementChecked || !selectedPackageId"
                    @click="handleConfirmBuy">
                    立即购买
                </button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { request } from '@/utils/request';
import { onShow } from '@dcloudio/uni-app';
import TransNavVue from '../../components/TransNav.vue'
import { useTokenStorage } from '../../utils/storage';
const { getAccessToken, getOpenId } = useTokenStorage();

// 状态管理
const trafficList = ref([]); // 流量套餐列表
const selectedPackageId = ref(null); // 当前选中的套餐ID
const agreementChecked = ref(false); // 用户协议勾选状态
const isLoading = ref(false); // 加载状态
const errorMsg = ref(''); // 错误信息

// 计算属性：获取当前选中的套餐详情
const selectedPackage = computed(() => {
    return trafficList.value.find(item => item.id === selectedPackageId.value) || null;
});

// 计算属性：获取推荐套餐（如果有）
const recommendPackage = computed(() => {
    return trafficList.value.find(item => item.isRecommend) || null;
});

// 页面加载时获取流量套餐列表
onShow(async () => {
    await getTrafficList();
});

// 获取流量套餐列表
const getTrafficList = async () => {
    isLoading.value = true;
    errorMsg.value = '';

    try {
        const res = await request({
            url: '/app-api/weixin/flow/list',
            showLoading: true
        });

        if (res.code === 0 && Array.isArray(res.data)) {
            trafficList.value = res.data;

            // 自动选中第一个套餐或推荐套餐
            if (trafficList.value.length > 0) {
                const defaultPackage = trafficList.value.find(item => item.isRecommend) || trafficList.value[0];
                selectedPackageId.value = defaultPackage.id;
            }
        } else {
            throw new Error(res.msg || '获取流量套餐失败');
        }
    } catch (err) {
        errorMsg.value = err.message || '获取流量套餐失败';
        uni.showToast({
            title: errorMsg.value,
            icon: 'none'
        });
    } finally {
        isLoading.value = false;
    }
};

// 处理套餐选择
const handleRechargeSelect = (packageInfo) => {
    selectedPackageId.value = packageInfo.id;
};

// 处理立即购买按钮点击
const handleBuyNow = (packageInfo) => {
    selectedPackageId.value = packageInfo.id;
    // 如果已经勾选协议，直接跳转支付
    if (agreementChecked.value) {
        handleConfirmBuy();
    }
};

// 处理协议勾选变化
const handleAgreementChange = (e) => {
    agreementChecked.value = e.detail.value.length > 0;
};



// 处理确认购买
const handleConfirmBuy = async () => {
    if (!agreementChecked.value) {
        uni.showToast({
            title: '请先同意用户协议',
            icon: 'none'
        });
        return;
    }

    if (!selectedPackageId.value) {
        uni.showToast({
            title: '请选择流量套餐',
            icon: 'none'
        });
        return;
    }

    try {
        // 模拟调用购买接口
        const res = await request({
            url: `/app-api/weixin/flow/create/order?id=${selectedPackageId.value}&facilityId=${28687}`,
            method: 'POST',

            showLoading: true
        });

        if (res.code === 0) {
            console.log('121')
            const payOrderId = res.data.payOrderId;

            // 2. 提交支付请求
            const paylist = await request({
                url: '/app-api/pay/order/submit',
                data: {
                    id: payOrderId,
                    channelCode: 'wx_lite',
                    channelExtras: {
                        openid: getOpenId() // 实际环境应从用户信息中获取
                    }
                },
                method: 'post',
                showLoading: true,
            });

            if (paylist.code === 0) {
                console.log('121')
                // 解析支付参数
                const payParams = JSON.parse(paylist.data.displayContent);
                console.log('支付参数:', payParams);

                // 3. 调用微信支付API
                const payRes = await uni.requestPayment({
                    provider: 'wxpay',
                    timeStamp: String(payParams.timeStamp),  // 确保为字符串类型
                    nonceStr: String(payParams.nonceStr),    // 确保为字符串类型
                    package: payParams.packageValue || payParams.package, // 兼容不同后端返回字段
                    signType: payParams.signType || 'MD5',   // 默认MD5
                    paySign: String(payParams.paySign),      // 确保为字符串类型

                    success: async (res) => {
                        uni.showToast({
                            title: '支付成功',
                            icon: 'success'
                        });

                        // 4. 支付成功后更新订单状态
                        await request({
                            url: '/app-api/weixin/order/update-paid',
                            data: {
                                payOrderId: payOrderId
                            },
                            method: 'post',
                            showLoading: true,
                        });

                        // 5. 跳转到订单详情页
                        setTimeout(() => {
                            uni.navigateTo({
                                url: '/pages/deviceManagement/deviceManagement'
                            });
                        }, 1500);
                    },

                    fail: async (err) => {
                        console.error('支付失败:', err);

                        if (err.errMsg.includes('cancel')) {
                            uni.showToast({
                                title: '支付已取消',
                                icon: 'none'
                            });
                        } else {
                            // 显示支付失败原因
                            const errorMsg = err.errMsg.includes('fail')
                                ? '支付失败，请重试'
                                : err.errMsg;

                            // 提供重试选项
                            const { confirm } = await uni.showModal({
                                title: '支付失败',
                                content: errorMsg,
                                confirmText: '重试',
                                cancelText: '返回'
                            });

                            if (confirm) {
                                await handleConfirmBuy(); // 重试支付
                            }
                        }
                    }
                });
            } else {
                throw new Error(paylist.msg || '支付请求失败');
            }
        } else {
            throw new Error(orderRes.msg || '订单创建失败');
        }
    } catch (err) {

    }
};
</script>

<style scoped>
.flow-management {
    padding: 30rpx 24rpx;
    background-color: #f8f8f8;
}

/* 优惠推荐区域 */
.recommend-section {
    background: linear-gradient(to right, #ff7a7a, #ff4d4f);
    border-radius: 20rpx;
    padding: 32rpx 24rpx;
    color: #fff;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(255, 77, 79, 0.2);
}

.tag {
    font-size: 24rpx;
    opacity: 0.9;
}

.flow-info {
    display: flex;
    align-items: center;
    margin-top: 16rpx;
}

.flow-value {
    font-size: 56rpx;
    font-weight: bold;
}

.flow-unit {
    font-size: 32rpx;
    margin-left: 12rpx;
    opacity: 0.9;
}

.buy-btn {
    margin-top: 20rpx;
    background-color: #fff;
    color: #ff4d4f;
    border-radius: 40rpx;
    padding: 12rpx 32rpx;
    font-size: 28rpx;
    font-weight: 500;
}

/* 流量充值区域 */
.recharge-section {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 32rpx 24rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 24rpx;
    color: #333;
}

.recharge-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.recharge-item {
    width: 30%;
    margin-bottom: 20rpx;
    border: 2rpx solid #e6e6e6;
    border-radius: 16rpx;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24rpx 0;
    position: relative;
    transition: all 0.3s;
}

.recharge-item.active {
    border-color: #ff4d4f;
    background-color: rgba(255, 77, 79, 0.05);
}

.recharge-value {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.recharge-price {
    font-size: 28rpx;
    margin-top: 8rpx;
    color: #ff4d4f;
}

.recommend-tag {
    position: absolute;
    top: -10rpx;
    right: -10rpx;
    background-color: #ff4d4f;
    color: #fff;
    font-size: 20rpx;
    padding: 4rpx 12rpx;
    border-radius: 20rpx;
}

/* 流量包详情区域 */
.description-section {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 32rpx 24rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.package-detail {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.detail-item {
    font-size: 28rpx;
    color: #666;
    display: flex;
    align-items: center;
}

.detail-item::before {
    content: '•';
    color: #ff4d4f;
    margin-right: 12rpx;
    font-size: 32rpx;
}

/* 协议及购买按钮区域 */
.agreement-section {
    padding: 0 24rpx;
}

.agreement-label {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #666;
}

.agreement-label checkbox {
    transform: scale(0.8);
    margin-right: 12rpx;
}

.confirm-buy-btn {
    margin-top: 32rpx;
    background-color: #ff4d4f;
    color: #fff;
    font-size: 36rpx;
    border-radius: 48rpx;
    padding: 24rpx 0;
    font-weight: 500;
    box-shadow: 0 6rpx 20rpx rgba(255, 77, 79, 0.3);
}

.confirm-buy-btn:disabled {
    background-color: #e6e6e6;
    color: #999;
    box-shadow: none;
}
</style>