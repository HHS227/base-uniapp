<template>
  <view>
    <TransNavVue title="认养记录" />
    <view class="container">
      <view class="nav-tabs">
        <view v-for="tab in tabs" :key="tab.value" :class="['tab-item', { active: activeTab === tab.value }]"
          @click="activeTab = tab.value">
          <text>{{ tab.label }}</text>
        </view>
      </view>
      <scroll-view scroll-y class="list-container">
        <view v-for="item in filteredList" :key="item.id" class="record-item">
          <image class="pet-image" :src="item.image ? item.image : '/static/images/apiculture.png'" mode="aspectFill">
          </image>
          <view class="info-content">
            <text class="pet-name">{{ item.beehiveName }}</text>
            <text class="pet-date">{{ formatDateTime(item.createTime) }}</text>
            <text class="pet-amount">¥{{ item.adoptType == 1 ? item.price : item.sharedPrice }}</text>
          </view>
          <text class="status" :style="{ color: getStatusColor(item.status), borderColor: getStatusColor(item.status) }"
            @click="payBtn(item)">
            {{ getStatusText(item.status) }}
          </text>
        </view>
        <view v-if="filteredList.length === 0" class="empty-state">
          <text class="empty-text">暂无认养记录</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed} from 'vue';
import { request } from '@/utils/request'
import TransNavVue from '../../components/TransNav.vue';
import { getNarBarHeight, formatDateTime } from '../../utils/system';
import { onShow } from '@dcloudio/uni-app'

const activeTab = ref('');
const records = ref([]);
const tabs = [{ label: '全部认养', value: '' }, { label: '已认养', value: 0 }, { label: '已完成', value: 1 }, { label: '已取消', value: 2 }];

// 筛选
const filteredList = computed(() => {
  if (activeTab.value === '') return records.value;
  return records.value.filter(item => item.status === activeTab.value);
});

// 不同的状态颜色
const getStatusColor = (status) => {
  const colors = {
    0: '#ff6f0e', // 已认养
    1: '#67c23a', // 已完成
    2: '#909399', // 已取消
    3: '#f50101', // 待支付
  };
  return colors[status] || '#1989fa';
};
const getStatusText = (status) => {
  const texts = {
    0: '已认养',
    1: '已完成',
    2: '已取消',
    3: '继续支付'
  };
  return texts[status] || '未知状态';
};
// 待支付的状态可以继续支付
const payBtn = async (item) => {
  if (item.status === 3) {
    const options = { orderId: item.payOrderI, }
    processPayment(options)
  }
}

onShow(() => {
  getRecordsList()
})
//获取认养记录
const getRecordsList = async () => {
  try {
    const res = await request({
      url: '/app-api/front/beehive/get/records/list',
      showLoading: true,
    })
    if (res.code === 0) {
      records.value = res.data || [];

    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取认养记录失败:', err)

  }
}

</script>

<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .nav-tabs {
    position: absolute;
    top: getNarBarHeight();
    left: 0;
    right: 0;
    z-index: 1;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    border-bottom: 1rpx solid #eee;
    padding-bottom: 20rpx;

    .tab-item {
      padding: 10rpx 0;
      position: relative;

      &.active {
        font-weight: bold;

        &::after {
          content: '';
          position: absolute;
          bottom: -20rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 80rpx;
          height: 4rpx;
          background: #ff6f0e;
        }
      }
    }
  }

  .list-container {
    margin-top: 100rpx;
    height: calc(100vh - 100rpx);
    background-color: #f7f7f7; // 整体背景色



    .record-item {
      display: flex;
      padding: 30rpx;
      border-radius: 10rpx; // 圆角
      background-color: #fff; // 列表项背景色
      margin: 20rpx; // 列表项间距
      align-items: center;


      .pet-image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
      }

      .info-content {
        flex: 1;
        display: flex;
        flex-direction: column;

        .pet-name {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 10rpx;
        }

        .pet-date {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 10rpx;
        }

        .pet-amount {
          font-size: 28rpx;
          color: #ff6f0e;
        }
      }

      .status {
        font-size: 24rpx;
        width: 120rpx;
        border: 1px solid #ddd;
        border-radius: 10rpx;
        text-align: center;
        height: 50rpx;
        line-height: 50rpx;
        border-radius: 46rpx;
        border: 2rpx solid rgba(153, 153, 153, 0.7);
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;



  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>