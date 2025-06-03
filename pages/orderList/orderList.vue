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
        <image class="pet-image" :src="item.image ?item.image  :'/static/images/养蜂.png'" mode="aspectFill"></image>
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
</template>

<script setup>
import { ref, computed , onMounted} from 'vue';
import { request } from '@/utils/request'
import { useTokenStorage } from '../../utils/storage'
const { getAccessToken} = useTokenStorage()

const tabs = [
  { label: '全部订单', value: '' },
  { label: '待发货', value: 1 },
  { label: '已发货', value: 2 },
  { label: '已取消', value: 3 },
  { label: '已完成', value: 4 }
];

const activeTab = ref('');

// 模拟数据
const records = ref([
  {
    adoptCircle: 3,
adoptType: 2,
beehiveId: 24989,
id: 6,
price: 473,
sharedPrice: 279,
status: 2,
userId: 23038,
     image: '/static/images/养蜂.png'
  },

]);

const filteredList = computed(() => {
  if (activeTab.value === '') return records.value;
  return records.value.filter(item => item.status === activeTab.value);
});

const getStatusColor = (status) => {
  const colors = {
    1: '#ff6f0e', // 待发货 - 橙色
    2: '#1989fa', // 已发货 - 蓝色 
    3: '#909399', // 已取消 - 灰色
    4: '#67c23a'  // 已完成 - 绿色
  };
  return colors[status] || '#1989fa';
};

const getStatusText = (status) => {
  const texts = {
    1: '待发货',
    2: '已发货', 
    3: '已取消',
    4: '已完成'
  };
  return texts[status] || '未知状态';
};

onMounted(() => {
  getRecordsList()
 

})
//获取认养记录记录
const getRecordsList= async () => {
	try {
    const res = await request({
      url: '/app-api/weixin/order/get/my',
      showLoading: true, 
    
    })
    
    if (res.code === 0 || res.code === 200) {
      records.value = res.data || [];
      
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取认养记录失败:', err)
   
  }
}
// 时间戳转换
const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}
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