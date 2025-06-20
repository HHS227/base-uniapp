<template>
 <view>
  <TransNavVue title="订单列表" />
  <view class="container">

    <view class="nav-tabs">
      <view   v-for="tab in tabs"  :key="tab.value" :class="['tab-item', {active: activeTab === tab.value}]" @click="activeTab = tab.value">
        <text>{{ tab.label }}</text>
      </view>
    </view>
    
    <scroll-view scroll-y class="list-container">
      <view 
        v-for="item in filteredList" 
        :key="item.id" 
        class="record-item"
        @click="orderDetail(item.id)"
      >
        <image class="pet-image" :src="'/static/images/apiculture.png'" mode="aspectFill"></image>
        <view class="info-content">
          <text class="pet-name">{{ item.productName }}</text>
          <text class="pet-date">{{ formatDateTime(item.createTime) ||'2025-05-25'}}</text>
          <text class="pet-amount">¥{{ item.amount||0 }}</text>
        </view>
        <text class="status" :style="{
          color: getStatusColor(item.status),
          borderColor: getStatusColor(item.status)
        }">
          {{ getStatusText(item.status) }}
        </text>
      </view>
      
      <!-- 添加空状态展示 -->
      <view v-if="filteredList.length === 0" class="empty-state">
       
        <text class="empty-text">暂无订单记录</text>
      </view>
    </scroll-view>
  </view>
 </view>
</template>

<script setup>
import { ref, computed , } from 'vue';
import { request } from '@/utils/request'
import TransNavVue from '../../components/TransNav.vue';
import { getNarBarHeight,formatDateTime } from '../../utils/system';
import { onShow } from '@dcloudio/uni-app'

const tabs = [
  { label: '全部订单', value: '' },
  { label: '待发货', value: 1 },
  { label: '已发货', value: 2 },
  { label: '已取消', value: 3 },
  { label: '已完成', value: 4 }
];

const activeTab = ref('');
// 模拟数据
const records = ref([]);

const filteredList = computed(() => {
  if (activeTab.value === '') return records.value;
  return records.value.filter(item => item.status === activeTab.value);
});


const getStatusColor = (status) => {
  const colors = {
    0:  '#f50101',  //待支付
    1: '#ff6f0e', // 待发货 - 橙色
    2: '#1989fa', // 已发货 - 蓝色 
    3: '#909399', // 已取消 - 灰色
    4: '#67c23a'  // 已完成 - 绿色
  };
  return colors[status] || '#1989fa';
};
const getStatusText = (status) => {
  const texts = {
    0:'未支付',
    1: '待发货',
    2: '已发货', 
    3: '已取消',
    4: '已完成',
    5:  '已退款',
   
  };
  return texts[status] || '未知状态';
};

onShow(() => {
  getRecordsList()
 
})
//获取认养记录记录
const getRecordsList= async () => {
	try {
    const res = await request({
      url: '/app-api/weixin/order/get/my',
      showLoading: true, 
    
    })
    
    if (res.code === 0 ) {
      records.value = res.data || [];
      
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取订单记录失败:', err)
   
  }
}

// 跳转到订单详情
const orderDetail=(id)=>{
  uni.navigateTo({
    url: `/pages/orderList/orderDetail?id=${id}`
  })
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
    padding-bottom: 20rpx; // 添加内边距
	
    
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