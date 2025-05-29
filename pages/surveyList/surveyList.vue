<template>
  <view class="container">
    <scroll-view scroll-y class="content">
      <view class="survey-list">
        <view 
          class="survey-item" 
          v-for="(survey, index) in surveyList" 
          :key="survey.id || index"  
          @click="handleSurveyClick(survey.id)" 
        >
          <image class="survey-icon" :src="survey.icon?survey.icon:'/static/images/养蜂.png'"></image>
          <view class="survey-info">
            <text class="survey-title">{{ survey.templateName || survey.title }}</text>  <!-- 兼容原数据结构 -->
          </view>
          <view class="survey-action">
            <text class="action-text">立即参与</text>
            <image class="arrow" src="/static/images/myPapeImages/向右箭头.png"></image>
          </view>
        </view>
      </view>
      
      <!-- 空状态提示 -->
      <view v-if="surveyList.length === 0" class="empty-state">
        <image src="/static/images/empty.png" class="empty-image"></image>
        <text class="empty-text">暂无问卷调查</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'


const surveyList = ref([
  {
    id: 1,  // 添加ID字段
    icon: '/static/images/养蜂.png',
    title: '蜂蜜产品满意度调查'
  },
  {
    id: 2,  // 添加ID字段
    icon: '/static/images/养蜂.png',
    title: '养蜂体验反馈问卷'
  },
  {
    id: 3,  // 添加ID字段
    icon: '/static/images/养蜂.png',
    title: '会员服务评价调查'
  }
])

// 处理问卷点击事件，跳转到详情页
const handleSurveyClick = (id) => {
  uni.navigateTo({
    url: `/pages/surveyList/surveyDetail?id=${id}`  // 携带问卷ID跳转
  })
}

onMounted(() => {
  getQuestionList()
})

// 获取问卷列表
const getQuestionList = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/questionnaire/get/list',
      showLoading: true
    })
    
    if (res.code === 0 || res.code === 200) {
      surveyList.value = res.data || []
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取问卷列表失败:', err)
  }
}
</script>


<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  height: 100vh;
  padding: 20rpx;
  
  .content {
    height: 100%;
    
    
    .survey-list {
      .survey-item {
        display: flex;
        align-items: center;
        padding: 30rpx;
        margin-bottom: 20rpx;
        background-color: #fff;
        border-radius: 16rpx;
        
        .survey-icon {
          width: 80rpx;
          height: 80rpx;
          margin-right: 20rpx;
        }
        
        .survey-info {
          flex: 1;
          .survey-title {
            font-size: 30rpx;
            color: #333;
          }
        }
        
        .survey-action {
          display: flex;
          align-items: center;
          .action-text {
            font-size: 26rpx;
            font-weight: bold;  // 加粗
            color: #000;        // 改为黑色
            margin-right: 10rpx;
          }
          .arrow {
            width: 24rpx;
            height: 24rpx;
          }
        }
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
  
  .empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>