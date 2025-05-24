<template>
    <view class="container">
        <TransNavVue title="微信提现"></TransNavVue>
        
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
</template>

<script setup>
import { ref } from 'vue'
import TransNavVue from '../../components/TransNav.vue'
import { request } from '@/utils/request'

const amount = ref('')
const availableBalance = ref('15230.80')
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
            url: '/api/withdraw',
            method: 'POST',
            data: {
                amount: amount.value
            }
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