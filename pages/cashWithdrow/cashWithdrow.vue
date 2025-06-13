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
                   @blur="validateAmount"
               />
           </view>
           <view class="balance-box">
               <text class="balance">可提现余额: ¥{{ availableBalance }}</text>
               <text v-if="availableBalance!=0" class="withdraw-all" @click="fillAllAmount">全部提现</text>
           </view>
           <view class="error-message" v-if="errorMessage">{{ errorMessage }}</view>
       </view>
       
       <view class="withdraw-btn" @click="submitWithdraw" :class="{ disabled: errorMessage }">
           申请提现
       </view>
   </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'
import TransNavVue from '../../components/TransNav.vue'
import { useTokenStorage } from '../../utils/storage'
import { onShow } from '@dcloudio/uni-app'

const { getOpenId } = useTokenStorage()

const amount = ref('')
const availableBalance = ref('0')
const errorMessage = ref('')

// 验证提现金额
const validateAmount = () => {
 if (!amount.value) {
   errorMessage.value = '请输入提现金额'
   return false
 }
 
 const withdrawAmount = parseFloat(amount.value)
 const balance = parseFloat(availableBalance.value)
 
 if (withdrawAmount <= 0) {
   errorMessage.value = '提现金额必须大于0'
   return false
 }
 
 if (withdrawAmount > balance) {
   errorMessage.value = `提现金额不能超过可提现余额 ¥${availableBalance.value}`
   return false
 }
 
 errorMessage.value = ''
 return true
}

//提现
const submitWithdraw = async () => {
 // 先验证金额
 if (!validateAmount()) {
   return
 }
 
 try {
   const res = await request({
     url: '/app-api/weixin/pay/initiate/payout',
     method: 'POST',
     data: { 
       transferAmount: amount.value,
       openid: getOpenId(),
       transferRemark: '极蜜部落提现',
       transferSceneId: '1000',
       transferSceneReportInfos: [
         {
           infoType: '活动名称',
           infoContent: '极蜜部落提现'
         },
         {
           infoType: '奖励说明',
           infoContent: '提现奖励'
         }
       ]
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
 errorMessage.value = ''
}

onShow(() => {
 const pages = getCurrentPages();
 const currentPage = pages[pages.length - 1];

 if (currentPage && currentPage.$vm) {
   const eventChannel = currentPage.$vm.getOpenerEventChannel();
   eventChannel.on('withdrawAmount', (data) => {
     availableBalance.value = data.amount || 0
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
       
       .error-message {
           font-size: 24rpx;
           color: #FF4D4F;
           margin-top: 10rpx;
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
       
       &.disabled {
           background-color: #FFB366;
           opacity: 0.7;
           cursor: not-allowed;
       }
   }
}
</style>
