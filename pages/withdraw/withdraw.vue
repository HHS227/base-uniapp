<template>
  <view class="container">
    <!-- 修改顶部黑色区域显示现金余额 -->
    <view class="top-card black-bg">
      
        <text class="amount">{{ walletData.balance || 0 }}</text>
        <view class="card-content">
          <text class="label">账号余额</text>
          <view class="right-content" @click="showCashWithdraw">
          <image src="/static/images/myPapeImages/Frame (1).png" class="arrow-icon"></image>
          <text class="withdraw-text">余额提现</text>
          <image src="/static/images/myPapeImages/向右箭头.png" class="arrow-icon"></image>
        </view>
        </view>
   
      

    </view>
    
    <!-- 修改下方橙色区域显示M币余额 -->
    <view class="bottom-card orange-bg">
      <view class="card-content">
        <view class="left-content">
          <text class="amount">{{ walletData.coin || 0 }}</text>
          <view class="label">M币使用
            <image  style="width:24rpx;height:24rpx;display:inline-block" src="/static/images/myPapeImages/向右箭头.png" ></image>
          </view>
        
        </view>
        <image style="width: 150rpx; height:150rpx" src="/static/images/myPapeImages/Group 1000009076.png" class="honey-icon"></image>
      </view>
    </view>
    
    <!-- 修改弹窗中的余额显示 -->
    <uni-popup ref="popup" type="center">
      <view class="popup-content center-popup">
        <text class="title">现金提现</text>
        <text class="balance">当前有<text class="amount-highlight">{{ walletData.balance || 0 }}</text>可提现</text>
        <text class="notice">提现3-5分钟到账</text>
        <button class="confirm-btn" @click="handleWithdraw">立即提现</button>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'
import { useTokenStorage } from '../../utils/storage'
const { getAccessToken } = useTokenStorage()

const popup = ref(null)
const walletData = ref({
  balance: 0,
  coin: 0
})

onMounted(() => {
  getWalletInfo()
 

})
const getWalletInfo = async () => {
	try {
    const res = await request({
      url: '/app-api/WeiXinMini/wallet/get/Info',
      showLoading: true, 
     
    })
    
    if (res.code === 0 || res.code === 200) {
     walletData.value = res.data || {};
      
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
   
  }
}


const handleWithdraw = async () => {
  try {
   
    if (walletData.value.balance === 0) {  
      throw new Error('账号余额不足')
    } else {
      const res = await request({
        url: '/app-api/weixin/pay/payouts',
        method: 'POST',
        data: { amount: walletData.value.balance },
        showLoading: true,
       
      })
      
      if (res.code === 0 || res.code === 200) {
        uni.showToast({
          title: '提现申请已提交',
          icon: 'success'
        });
        await getWalletInfo()
      } else {
        throw new Error(res.msg || '提现失败')
      }
    }
  } catch (err) {
    console.error('提现失败:', err)
    uni.showToast({
      title: err.message || '提现失败',
      icon: 'error'
    });
  } finally {
    popup.value.close()
  }
};
const showCashWithdraw = () => {
  popup.value.open();
};

</script>









<style lang="scss" scoped>
.container {
  padding: 20rpx;
  
  .top-card, .bottom-card {
    border-radius: 16rpx;
    padding: 50rpx;
    margin-bottom: 20rpx;
    height: 230rpx;
    
    .amount {
          font-size: 48rpx;
          font-weight: bold;
          color: #fff;
        }
    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
     
   
        
        
        
        .label {
          font-size: 28rpx;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 10rpx;
        }
      
      
      .right-content {
        display: flex;
        align-items: center;
        
        .withdraw-text {
          font-size: 28rpx;
          color: #fff;
          margin-left: 10rpx;
        }
        
        .arrow-icon {
          width: 24rpx;
          height: 24rpx;
          margin-left: 10rpx;
        }
      }
      
      .honey-icon {
        width: 60rpx;
        height: 60rpx;
      }
    }
  }
  
  .black-bg {
    background: linear-gradient(to bottom, #3b3b3b, #060608);
  }
  
  .orange-bg {
    background: #ff7f27;
  }
  
  .withdraw-btn {
    background: #fff;
    color: #000;
    border-radius: 40rpx;
    padding: 0 30rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 28rpx;
  }
  
  .popup-content {
    background: #fff;
    padding: 40rpx;
    border-radius: 20rpx ;
    
    .title {
      font-size: 36rpx;
      font-weight: bold;
      display: block;
      margin-bottom: 30rpx;
    }
    
    .balance {
      font-size: 32rpx;
      display: block;
      margin-bottom: 40rpx;
    }
    
    .confirm-btn {
      background: #ff6f0e;
      color: #fff;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      font-size: 32rpx;
    }
  }
}
.center-popup {
  width: 600rpx;
  min-height: 400rpx;
  margin: 0 auto;
  border-radius: 30rpx;
  padding: 50rpx;
  background: linear-gradient(180deg #fff2da, #ffffff 57%);
  
  
  .title {
    font-size: 40rpx;
    font-weight: bold;
    display: block;
    text-align: center;
    margin-bottom: 40rpx;
    color: #000; /* 标题保持黑色 */
  }
  
  .balance {
    font-size: 36rpx;
    display: block;
    text-align: center;
    margin-bottom: 30rpx;
    color: #000; /* 整体文字为黑色 */
  }
  
  .amount-highlight {
    color: #ff6f0e; /* 仅金额数字为橙色 */
  }
  
  .notice {
    font-size: 28rpx;
    color: #999;
    display: block;
    text-align: center;
    margin-bottom: 50rpx;
  }
  
  .confirm-btn {
    width: 100%;
    background: #ff6f0e;
    color: #fff;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    font-size: 34rpx;
  }
}
</style>
