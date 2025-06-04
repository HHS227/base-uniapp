<template>
 <view>
  <TransNavVue title="问卷详情" />
  <view class="container">
    <scroll-view scroll-y class="content">
      <!-- 问卷标题 -->
      <view class="survey-header">
        <text class="survey-title">{{ surveyData.questionnaireName }}</text>
      </view>

      <!-- 问卷问题列表 -->
      <view class="question-list">
        <view 
          v-for="(question, index) in surveyData.questionList" 
          :key="question.questionId" 
          class="question-item"
        >
          <text class="question-title">{{ index + 1 }}. {{ question.questionText }}</text>
          
          <!-- 单选题 -->
          <view v-if="question.questionType === '0'" class="option-list">
            <radio-group @change="(e) => handleRadioChange(question.questionId, e)">
              <label 
                v-for="option in question.questionChoice" 
                :key="option.optionId" 
                class="option-item"
              >
                <radio :value="option.optionId" :checked="answers[question.questionId] === option.optionId" />
                <text>{{ option.optionText }}</text>
              </label>
            </radio-group>
          </view>

          <!-- 多选题 -->
          <view v-else-if="question.questionType === '1'" class="option-list">
            <checkbox-group @change="(e) => handleCheckboxChange(question.questionId, e)">
              <label 
                v-for="option in question.questionChoice" 
                :key="option.optionId" 
                class="option-item"
              >
                <checkbox :value="option.optionId" :checked="answers[question.questionId]?.includes(option.optionId)" />
                <text>{{ option.optionText }}</text>
              </label>
            </checkbox-group>
          </view>

          <!-- 文本题 -->
          <view v-else-if="question.questionType === '2'" class="text-input">
            <textarea 
              v-model="answers[question.questionId]" 
              placeholder="请输入您的回答" 
              auto-height
            />
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" @click="submitSurvey">提交问卷</button>
    </scroll-view>
  </view>
 </view>
</template>

<script setup>
import { ref } from 'vue'
import { request } from '@/utils/request'
import { onLoad } from '@dcloudio/uni-app'
import TransNavVue from '../../components/TransNav.vue'

const surveyId = ref('')
const surveyData = ref({
  questionnaireId: '',
  questionnaireName: '',
  questionList: []
})
const answers = ref({})

// 获取URL参数
onLoad((options) => {
  surveyId.value = options.id
  getSurveyDetail()
})

// 获取问卷详情
const getSurveyDetail = async () => {
  try {
    const res = await request({
      url: `/app-api/weixin/questionnaire/get/info?id=${surveyId.value}`,
      showLoading: true
    })
    
    if (res.code === 0 || res.code === 200) {
      surveyData.value = res.data
    } else {
      throw new Error(res.msg || '获取问卷详情失败')
    }
  } catch (err) {
    console.error('获取问卷详情失败:', err)
    uni.showToast({
      title: '获取问卷详情失败',
      icon: 'error'
    })
  }
}

// 处理单选题选择
const handleRadioChange = (questionId, e) => {
  answers.value[questionId] = e.detail.value
}

// 处理多选题选择
const handleCheckboxChange = (questionId, e) => {
  if (!answers.value[questionId]) {
    answers.value[questionId] = []
  }
  answers.value[questionId] = e.detail.value
}

// 提交问卷
const submitSurvey = async () => {
  if (!validateAnswers()) return
  
  try {
    // 转换答案格式
    const questionAnswers = surveyData.value.questionList.map(question => {
      let answerValue = answers.value[question.questionId]
      
      // 处理多选题答案格式
      if (question.questionType === '1' && Array.isArray(answerValue)) {
        answerValue = answerValue.join(',')
      }
      
      return {
        questionId: question.questionId,
        questionType: question.questionType,
        answer: answerValue?.toString() || ''
      }
    })

    const res = await request({
      url: '/app-api/weixin/questionnaire/submit',
      method: 'POST',
      data: {
        templateId: surveyId.value,
        questionAnswers: questionAnswers
      },
      showLoading: true
    })
    
    if (res.code === 0 || res.code === 200) {
      uni.showToast({
        title: '提交成功',
        icon: 'success'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      throw new Error(res.msg || '提交失败')
    }
  } catch (err) {
    console.error('提交问卷失败:', err)
    uni.showToast({
      title: '提交失败',
      icon: 'error'
    })
  }
}

// 验证答案是否完整
const validateAnswers = () => {
  for (const question of surveyData.value.questionList) {
    if (!answers.value[question.questionId]) {
      uni.showToast({
        title: `请完成第${question.questionId}题`,
        icon: 'none'
      })
      return false
    }
  }
  return true
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  .content {
   width: 100%  ;
  }
  
  .survey-header {
    
    padding: 30rpx;
    margin-bottom: 20rpx;
    text-align: center;  // 标题居中
    
    .survey-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      display: block;
      margin-bottom: 16rpx;
    }
  }
  
  .question-list {
    .question-item {
      background-color: transparent;  // 移除背景色
      border-radius: 0;
      padding: 30rpx 0;  // 调整上下间距
      margin-bottom: 20rpx;
      border-bottom: 1rpx solid #eee;  // 添加分割线
      
      .question-title {
        font-size: 32rpx;
        color: #333;
        margin-bottom: 24rpx;
        display: block;
      }
      
      .option-list {
        .option-item {
          display: flex;
          align-items: center;
          padding: 16rpx 0;
          font-size: 28rpx;
          
          radio, checkbox {
            margin-right: 16rpx;
          }
        }
      }
      
      .text-input {
        margin-top: 16rpx;
        
        textarea {
          width: 100%;
          min-height: 160rpx;
          background-color: #f5f5f5;
          border-radius: 8rpx;
          font-size: 28rpx;
        }
      }
    }
  }
  
  .submit-btn {
    margin-top: 40rpx;
    background-color: #ffcc00;
    color: #333;
    font-weight: bold;
    border-radius: 50rpx;
  }
}
</style>