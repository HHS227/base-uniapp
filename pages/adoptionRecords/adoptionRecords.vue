<template>
  <view class="container">
    <!-- 导航栏 -->
    <view class="nav-tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="['tab-item', {active: activeTab === tab.value}]"
        @click="activeTab = tab.value"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>
    
    <!-- 列表内容 -->
    <scroll-view scroll-y class="list-container">
      <view 
        v-for="item in filteredList" 
        :key="item.id" 
        class="record-item"
      >
        <image class="pet-image" :src="item.image" mode="aspectFill"></image>
        <view class="info-content">
          <text class="pet-name">{{ item.name }}</text>
          <text class="pet-date">{{ item.date }}</text>
          <text class="pet-amount">¥{{ item.amount }}</text>
        </view>
        <text class="status" :style="{color: getStatusColor(item.status)}">
          {{ item.status }}
        </text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const tabs = [
  { label: '全部认养', value: 'all' },
  { label: '已认养', value: 'adopted' },
  { label: '已发货', value: 'delivered' },
  { label: '已完成', value: 'completed' }
];

const activeTab = ref('all');

// 模拟数据
const records = ref([
  {
    id: 1,
    name: '小蜜蜂001号',
    date: '2023-05-10',
    amount: '299.00',
    status: '已认养',
    image: '/static/images/蜜蜂.png'
  },
  {
    id: 2,
    name: '小蜜蜂002号',
    date: '2023-06-15',
    amount: '399.00',
    status: '已发货',
    iimage: '/static/images/蜜蜂.png'
  },
  {
    id: 3,
    name: '小蜜蜂003号',
    date: '2023-07-20',
    amount: '499.00',
    status: '已完成',
    image: '/static/images/蜜蜂.png'
  },
  {
    id: 4,
    name: '小蜜蜂004号',
    date: '2023-08-05',
    amount: '599.00',
    status: '已认养',
    image: '/static/images/蜜蜂.png'
  },
  {
    id: 5,
    name: '小蜜蜂005号',
    date: '2023-09-12',
    amount: '699.00',
    status: '已发货',
   image: '/static/images/蜜蜂.png'
  }
]);

const filteredList = computed(() => {
  if (activeTab.value === 'all') return records.value;
  
  // 将导航栏状态值映射到数据状态值
  const statusMap = {
    'adopted': '已认养',
    'delivered': '已发货', 
    'completed': '已完成'
  };
  
  return records.value.filter(item => item.status === statusMap[activeTab.value]);
});

const getStatusColor = (status) => {
  const colors = {
    '已认养': '#ff6f0e',
    '已发货': '#1989fa',
    '已完成': '#67c23a'
  };
  return colors[status] || '#909399';
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  padding: 0 20rpx;
  height:100vh ;
  .nav-tabs {
    display: flex;
    justify-content: space-around;
    background-color: #fff;
    margin: 0 -20rpx;
    padding: 20rpx 0;
    position: relative;
    border-bottom: 1rpx solid #eee;
    
    .tab-item {
      padding: 10rpx 20rpx;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      &.active {
        font-weight: bold;
        color: #ff6f0e;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -10rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 60rpx;
          height: 6rpx;
          background: #ff6f0e;
          border-radius: 3rpx;
        }
      }
    }
  }
  border-bottom: 1rpx solid #eee;
    padding-bottom: 20rpx;
    background-color: #fff;  // 导航栏白色背景
    margin: 0 -20rpx;
    padding: 20rpx;
  }
  
  .list-container {
    margin-top: 20rpx;
    background-color: #f7f7f7;
    
    
    .record-item {
      display: flex;
      padding: 30rpx;
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 16rpx;
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
        justify-content: center;
        
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
        font-size: 28rpx;
        min-width: 100rpx;
        text-align: right;
      }
    }
  }
}
</style>