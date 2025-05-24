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
    { label: '全部订单', value: 'all' },
    { label: '已购买', value: 'adopted' },
    { label: '已发货', value: 'delivered' },
    { label: '已完成', value: 'completed' }
  ];
  
  const activeTab = ref('all');
  
  // 模拟数据
  const records = ref([
    {
      id: 1,
      name: '蜜汁蜂蜜',
      date: '2023-05-10',
      amount: '299.00',
      status: '已购买',
       image: '/static/images/蜜蜂.png'
    },
    {
      id: 2,
      name: '蜂王浆A    ',
      date: '2023-06-15',
      amount: '399.00',
      status: '已发货',
      image: '/static/images/蜜蜂.png'
    },
    {
      id: 3,
      name: '蜂王浆B',
      date: '2023-07-20',
      amount: '499.00',
      status: '已完成',
      image: '/static/images/蜜蜂.png'
    },
    {
      id: 4,
      name: '蜜蜂2号',
      date: '2023-08-05',
      amount: '599.00',
      status: '已购买',
      image: '/static/images/蜜蜂.png'
    },
    {
      id: 5,
      name: '蜂蜜1号',
      date: '2023-09-12',
      amount: '699.00',
      status: '已发货',
       image: '/static/images/蜜蜂.png'
    }
  ]);
  
  const filteredList = computed(() => {
    if (activeTab.value === 'all') return records.value;
    
    // 将导航栏value值与数据status字段对应
    const statusMap = {
      'adopted': '已购买',
      'delivered': '已发货',
      'completed': '已完成'
    };
    
    return records.value.filter(item => item.status === statusMap[activeTab.value]);
  });
  
  const getStatusColor = (status) => {
    const colors = {
      '已购买': '#ff6f0e',
      '已发货': '#1989fa',
      '已完成': '#67c23a'
    };
    return colors[status] || '#909399';
  };
  </script>
  
  <style lang="scss" scoped>
  .container {
   
    
    .nav-tabs {
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
      height: calc(100vh - 100rpx);
      background-color: #f7f7f7; // 整体背景色
      // padding: 20rpx; // 添加内边距
      
      
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
          border: 2rpx solid rgba(153,153,153,0.7);
        }
      }
    }
  }
  </style>