<template>
     <view>
        <TransNavVue title="微信提现"/>
    <view class="container">
     
        
        
        <view class="withdraw-card">
            <view class="title">提现金额</view>
            <view class="input-box">
                <text>¥</text>
                <input 
                    type="number" 
                    placeholder="请输入提现金额" 
                    v-model="amount"
                />
            </view>
            <view class="balance-box">
                <text class="balance">可提现余额: ¥{{ availableBalance }}</text>
                <text class="withdraw-all" @click="fillAllAmount">全部提现</text>
            </view>
        </view>
        
        
        
        <view class="withdraw-btn" @click="submitWithdraw">申请提现</view>
    </view>
     </view>
</template>

<script setup>
import { ref ,onMounted} from 'vue'

import { request } from '@/utils/request'

import TransNavVue from '../../components/TransNav.vue'
import { useTokenStorage } from '../../utils/storage'
const {  getAccessToken ,getOpenId} = useTokenStorage()

const amount = ref('')
const availableBalance = ref('0')
const wechatInfo = ref({
    nickname: '微信用户',
    avatar: ''
})

const submitWithdraw = async () => {
    if (!amount.value) {
        uni.showToast({
            title: '请输入提现金额',
            icon: 'none'
        })
        return
    }
    
    try {
        const res = await request({
        url: '/app-api/weixin/pay/initiate/payout',
        method: 'POST',
        data: { transferAmount: walletData.value.balance ,
              openid: getOpenId(),
              transferRemark: '极蜜部落提现'
        },
        showLoading: true,
       
      })
        
        uni.showToast({
            title: '提现申请已提交',
            icon: 'success'
        })
        
        // 更新余额
        availableBalance.value = (parseFloat(availableBalance.value) - parseFloat(amount.value)).toFixed(2)
        
        amount.value = ''
        
    } catch (error) {
        uni.showToast({
            title: error.message || '提现失败',
            icon: 'none'
        })
    }
}

const fillAllAmount = () => {
    amount.value = availableBalance.value
}
onMounted(() => {

    const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  // 通过页面参数获取数据
  if (currentPage && currentPage.$vm) {
    const eventChannel = currentPage.$vm.getOpenerEventChannel();
    eventChannel.on('withdrawAmount', (data) => {
        // 处理提现金额数据
        availableBalance.value = data.amount||0
    });
  }
  
})
</script>

<style lang="scss" scoped>
.container {
    padding: 30rpx;
    background-color: #f7f7f7;
    min-height: 100vh;
    
    .withdraw-card {
        background-color: #fff;
        border-radius: 16rpx;
        padding: 40rpx;
        margin-bottom: 30rpx;
        
        .title {
            font-size: 32rpx;
            color: #333;
            margin-bottom: 40rpx;
        }
        
        .input-box {
            display: flex;
            align-items: center;
            border-bottom: 1rpx solid #eee;
            padding-bottom: 20rpx;
            margin-bottom: 20rpx;
            
            text {
                font-size: 48rpx;
                color: #333;
                margin-right: 10rpx;
            }
            
            input {
                flex: 1;
                font-size: 48rpx;
                height: 80rpx;
            }
        }
        
        .balance-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .balance {
                font-size: 28rpx;
                color: #999;
            }
            
            .withdraw-all {
                font-size: 28rpx;
                color: #FF7D00;
            }
        }
    }
    
    .wechat-info {
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 16rpx;
        padding: 30rpx;
        margin-bottom: 60rpx;
        
        image {
            width: 60rpx;
            height: 60rpx;
            margin-right: 20rpx;
        }
        
        text {
            font-size: 28rpx;
            color: #333;
        }
    }
    
    .withdraw-btn {
        height: 90rpx;
        line-height: 90rpx;
        background-color: #FF7D00;
        color: white;
        font-size: 32rpx;
        border-radius: 45rpx;
        text-align: center;
    }
}
</style>