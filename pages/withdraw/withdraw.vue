<template>
  <view>
    <TransNavVue title="我的钱包" />
    <view class="container">

      <view class="top-card black-bg">
        <text class="amount">{{ commissionData.currentEarnings || 0 }}</text>
        <view class="card-content">
          <text class="label">账号余额</text>
          <view class="right-content" @click="showCashWithdraw">
            <image src="/static/images/myPage/crownIcon.png" class="arrow-icon"></image>
            <text class="withdraw-text">余额提现</text>
            <image src="/static/images/rightBtn.png" class="arrow-icon"></image>
          </view>
        </view>
      </view>

      <view class="bottom-card orange-bg">
        <view class="card-content">
          <view class="left-content">
            <text class="amount">{{ commissionData.coin || 0 }}</text>
            <view class="label">M币使用
              <image style="width:24rpx;height:24rpx;display:inline-block" src="/static/images/rightBtn.png"></image>
            </view>

          </view>
          <image style="width: 150rpx; height:150rpx" src="/static/images/myPage/Mbg.png" class="honey-icon"></image>
        </view>
      </view>


    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { request } from '@/utils/request'
import TransNavVue from '../../components/TransNav.vue'
import { onShow } from '@dcloudio/uni-app';


const commissionData = ref({})

onShow(() => {
  getCommissionDetail()
})

// 获取提现详情
const getCommissionDetail = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/distribution/get/commission/info',
      showLoading: true,
    })
    if (res.code === 0) {
      commissionData.value = res.data || {};

    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)

  }
}

// 跳转提现
const showCashWithdraw = () => {
  uni.navigateTo({
    url: '/pages/cashWithdrow/cashWithdrow',
    success: (res) => {
      res.eventChannel.emit('withdrawAmount', {
        amount: commissionData.value.currentEarnings
      })
    }
  })
};

</script>









<style lang="scss" scoped>
.container {
  padding: 20rpx;

  .top-card,
  .bottom-card {
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
    border-radius: 20rpx;

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
    color: #000;
    /* 标题保持黑色 */
  }

  .balance {
    font-size: 36rpx;
    display: block;
    text-align: center;
    margin-bottom: 30rpx;
    color: #000;
    /* 整体文字为黑色 */
  }

  .amount-highlight {
    color: #ff6f0e;
    /* 仅金额数字为橙色 */
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
