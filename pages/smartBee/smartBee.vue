<template>
  <view class="container">
    <scroll-view scroll-y class="content">
      <!-- 使用v-for遍历后端数据 -->
      <view 
        v-for="(item, index) in smartBeeList" 
        :key="index" 
        class="question-item"
      >
        <text class="question-title">{{ index + 1 }}. {{ item.title }}</text>
        <text class="question-content">
          {{ item.content }}
        </text>
        <view class="divider"></view>
      </view>
      
      <!-- 空状态提示 -->
      <view v-if="smartBeeList.length === 0" class="empty-state">
       
        <text class="empty-text">暂无相关内容</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref,  onMounted} from 'vue';
import { request } from '@/utils/request'

const smartBeeList=ref([])

onMounted(() => {
  getSmartBeeList()
 

})
//获取智能养蜂内容

const getSmartBeeList= async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/bee-keeping/get/list',
      showLoading: true,
    })
    
    if (res.code === 0 || res.code === 200) {
      smartBeeList.value = res.data || [] // 确保数据为数组
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取智能养蜂内容:', err)
    uni.showToast({
      title: '获取内容失败',
      icon: 'error'
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  
  .content {
    height: calc(100vh - 40rpx);
    
    .question-item {
      margin-bottom: 40rpx;
      padding: 20rpx;
      background: #fff;
      border-radius: 16rpx;
      
      .question-title {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        color: #000;
        margin-bottom: 20rpx;
      }
      
      .question-content {
        display: block;
        font-size: 28rpx;
        color: #999;  // 灰色字体
        line-height: 1.6;
        margin-bottom: 20rpx;
      }
      
      .divider {
        height: 1rpx;
        background: #eee;
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