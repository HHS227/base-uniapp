<template>
  <view class="container">
    <scroll-view scroll-y class="content">
      <view class="survey-list">
        <view 
          class="survey-item" 
          v-for="(survey, index) in surveyList" 
          :key="index"
          @click="handleSurveyClick"
        >
          <image class="survey-icon" :src="survey.icon"></image>
          <view class="survey-info">
            <text class="survey-title">{{ survey.title }}</text>
          </view>
          <view class="survey-action">
            <text class="action-text">立即参与</text>
            <image class="arrow" src="/static/images/myPapeImages/向右箭头.png"></image>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const surveyList = ref([
  {
    icon: '/static/images/养蜂.png',
    title: '蜂蜜产品满意度调查'
  },
  {
    icon: '/static/images/养蜂.png',
    title: '养蜂体验反馈问卷'
  },
  {
    icon: '/static/images/养蜂.png',
    title: '会员服务评价调查'
  }
]);

const handleSurveyClick = () => {
  console.log('问卷点击事件');
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  height: 100vh;
  
  .content {
    height: 100%;
    padding: 20rpx;
    
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
</style>