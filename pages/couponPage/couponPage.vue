<template>
  <view class="container">
    <TransNavVue title="领取优惠"/>
    <view class="coupon-list">
      <view v-for="item in couponList" :key="item.id" class="coupon-item">
        <view class="content">
          <view class="left">
            <view class="amount">
              <text v-if="item.couponType === 0">{{ item.couponName }}</text>
              <text v-else>{{ item.couponName }}</text>
            </view>
         
          </view>
          <view class="right">
            <button 
              class="get-btn" 
              :class="{ 'disabled': item.status === 0 }"
              @click="handleGetCoupon(item.id)"
            >
              {{ item.status === 1 ? '立即领取' : '已领取' }}
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '@/utils/request'
import { useTokenStorage } from '../../utils/storage'
import TransNavVue from '../../components/TransNav.vue'

const { getAccessToken } = useTokenStorage()
const couponList = ref([])

// 获取优惠券列表
const getCouponList = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/coupons/get/list',
      showLoading: true
    })
    if (res.code === 0) {
      couponList.value = res.data.map(item => ({
        ...item,
        status: item.status || 1 // 1可领取 0已领取
      }))
    }
  } catch (err) {
    console.error('获取优惠券失败:', err)
  }
}

// 领取优惠券
const handleGetCoupon = async (couponId) => {
  if (!getAccessToken()) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }

  try {
    const res = await request({
      url: `/app-api/weixin/coupons/receive?couponId=${couponId}`,
      method: 'POST',
      
      showLoading: true
    })
    
    if (res.code === 0) {
      uni.showToast({ title: '领取成功' })
      // 更新状态
      const index = couponList.value.findIndex(item => item.id === couponId)
      if (index !== -1) {
        couponList.value[index].status = 0
      }
    }
  } catch (err) {
    console.error('领取失败:', err)
  }
}

onShow(() => {
  getCouponList()
})
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  background-color: #f7f7f7;
  min-height: 100vh;
}

.coupon-item {
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      .amount {
        font-size: 48rpx;
        color: #FF6F0E;
        font-weight: bold;
      }
      
      .condition {
        font-size: 24rpx;
        color: #999;
        margin-top: 10rpx;
      }
    }

    .right {
      .get-btn {
        width: 160rpx;
        height: 60rpx;
        line-height: 60rpx;
        background: #FF6F0E;
        color: #fff;
        border-radius: 30rpx;
        font-size: 26rpx;
        border: none;

        &.disabled {
          background: #ccc;
          color: #666;
        }
      }
    }
  }
}
</style>