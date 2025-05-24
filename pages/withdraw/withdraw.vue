<template>
  <view class="container">
    <!-- 顶部黑色背景区域 -->
    <view class="top-card black-bg">
      <view class="card-content">
        <view class="left-content">
          <text class="amount">{{ cashBalance }}</text>
          <text class="label">账号余额</text>
        </view>
        <view class="right-content" @click="showCashWithdraw">
          <text class="withdraw-text">余额提现</text>
          <image src="/static/images/myPapeImages/向右箭头.png" class="arrow-icon"></image>
        </view>
      </view>
    </view>
    
    <!-- 下方橙色背景区域 -->
    <view class="bottom-card orange-bg">
      <view class="card-content">
        <view class="left-content">
          <text class="amount">{{ mCoinBalance }}</text>
          <text class="label">M币</text>
        </view>
        <image src="/static/images/myPapeImages/采蜜图标.png" class="honey-icon"></image>
      </view>
    </view>
    
    <!-- 提现弹窗 -->
   
    <uni-popup ref="popup" type="center">
      <view class="popup-content center-popup">
        <text class="title">现金提现</text>
        <text class="balance">当前有<text class="amount-highlight">{{ cashBalance }}</text>可提现</text>
        <text class="notice">提现3-5分钟到账</text>
        <button class="confirm-btn" @click="handleWithdraw">立即提现</button>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const cashBalance = ref('8239.32');
const mCoinBalance = ref('682');
const popup = ref(null);

const showCashWithdraw = () => {
  popup.value.open();
};

const handleWithdraw = () => {
  // 处理提现逻辑
  uni.showToast({
    title: '提现申请已提交',
    icon: 'success'
  });
  popup.value.close();
};

onLoad(() => {
  // 可以在这里加载用户资产数据
});
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  
  .top-card, .bottom-card {
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .left-content {
        display: flex;
        flex-direction: column;
        
        .amount {
          font-size: 48rpx;
          font-weight: bold;
          color: #fff;
        }
        
        .label {
          font-size: 28rpx;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 10rpx;
        }
      }
      
      .right-content {
        display: flex;
        align-items: center;
        
        .withdraw-text {
          font-size: 28rpx;
          color: #fff;
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
    background: #000;
  }
  
  .orange-bg {
    background: #ff6f0e;
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