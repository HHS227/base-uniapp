<template>

    <view>
        <TransNavVue title="流量充值" />
        <view class="container">
            <view class="recommend-section" v-if="recommendPackage">
                <text class="tag">优惠推荐</text>
                <view class="flow-info">
                    <text class="flow-value"> {{recommendPackage.flowAmount}}G</text>
                    <text class="flow-unit">/流量</text>
                </view>
                <button class="buy-btn" type="default" size="mini" @click="handleBuyNow(recommendPackage)">
                    立即购买
                </button>
            </view>
            <view class="recharge-section">
                <text class="section-title">流量充值</text>
                <view class="recharge-list">
                    <button v-for="item in trafficList" :key="item.id" class="recharge-item"
                        :class="{ active: item.id === selectedPackageId }" @click="handleRechargeSelect(item)">
                        <text class="recharge-value">{{ item.flowAmount }}G</text>
                        <text class="recharge-price">{{ item.price }}元</text>

                    </button>
                </view>
            </view>
            <view class="description-section" v-if="selectedPackage">
                <text class="section-title">流量包详情</text>
                <view class="package-detail">
                    <text class="detail-item"> 套餐名称: {{ selectedPackage.packageName }}</text>
                    <text class="detail-item" v-if="selectedPackage.description">套餐说明: {{ selectedPackage.description
                        }}</text>
                </view>
            </view>
        </view>


        <view class="footer">
            
            <checkbox-group @change="handleAgreementChange">
                <label class="agreement-label">
                    <checkbox :checked="agreementChecked" />
                    <text>我已阅读并同意平台 <text @click="userAgreement" style="color:#000">《用户协议》</text></text>
                </label>
            </checkbox-group>
            <button class="confirm-buy-btn" :disabled="!agreementChecked"
                @click="handleConfirmBuy">
                立即购买
            </button>
        </view>
    </view>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { request ,processPayment} from '@/utils/request';
import { onShow } from '@dcloudio/uni-app';
import TransNavVue from '../../components/TransNav.vue'


const deviceId=ref() //设备id
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
  return trafficList.value.find(item => item.hot) || null;
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
            if (trafficList.value.length > 0) {
                const defaultPackage = trafficList.value.find(item => item.hot);
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
// 套餐选择
const handleRechargeSelect = (packageInfo) => {
    selectedPackageId.value = packageInfo.id;
    
};
// 处理立即购买按钮点击
const handleBuyNow = (packageInfo) => {
    selectedPackageId.value = packageInfo.id;
    // 如果已经勾选协议，直接跳转支付
    if (agreementChecked.value) {
        handleConfirmBuy();
    }else{
        uni.showToast({
            title: '请先同意协议',
            icon: 'none'
        });
    }
};
// 处理协议勾选变化
const handleAgreementChange = (e) => {
    agreementChecked.value = e.detail.value.length > 0;
};

// 确认购买
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
            // 创建新订单
            const res = await request({
            url: `/app-api/weixin/flow/create/order?id=${selectedPackageId.value}&facilityId=${deviceId.value}`,
            method: 'POST',
            showLoading: true
        });
            if (res.code == 0 && res.data.payOrderId) {
                payOrderId.value = res.data.payOrderId;
                const options={orderId : res.data.payOrderId, successToUrl :'/pages/deviceManagement/deviceManagement'}
                processPayment(options)
            }else{
                throw new Error(res.msg || '订单创建失败');
            }
              
    } catch (err) {
        uni.showToast({
            title: err.message || '支付出错，请重试',
            icon: 'none'
        });
    } 
};



// 跳转协议
const userAgreement=()=>{
    uni.navigateTo({
    url: '/pages/userAgreement/userAgreement'
  })
    
  
}
//获取id
onMounted(() => {
  const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const beeFarmId  = currentPage.$page.options|| currentPage.options
	  if (beeFarmId.id) {
        deviceId.value=beeFarmId.id
	  } else {
	    console.error('设备 ID 缺失')
	  }
})
</script>

<style scoped lang="scss">
.container {
    height: 100vh;
    padding: 20rpx;
    background-color: #f7f7f7;
}

.recommend-section {
        background-image: url('/static/images/myPage/trafficBg.png');
        background-size: 100% 100%;
        border-radius: 20rpx;
        padding: 32rpx 24rpx;
        color: #fff;
        position: relative;
        margin-bottom: 20rpx;


    }
    
    .tag {
            background-image: url('/static/images/myPage/trafficTopIcon.png');
            background-size: 100% 100%;
            font-size: 24rpx;
            opacity: 0.9;
            display: inline-block;
            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
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
            margin: 20rpx 0rpx;
            border: 2rpx solid #e6e6e6;
            border-radius: 16rpx;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 12rpx 0;
            position: relative;
            transition: all 0.3s;
        }

        .recharge-item.active {
            border-color: #FF7E26;
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

.footer {
position: fixed;
bottom: 0;
right: 0;
width: 100%;
padding: 20rpx;
background: #fff;
}
.confirm-buy-btn {
    background: #ff6f0e;
    color: #fff;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 32rpx;
  }
  .confirm-buy-btn:disabled {
    background: #e0e0e0; 
    color: #999; 
    opacity: 0.8; 
    box-shadow: none; 
  }

.agreement-label {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #666;
    margin-bottom: 20rpx;
}

.agreement-label checkbox {
    transform: scale(0.8);
    margin-right: 12rpx;
}


</style>