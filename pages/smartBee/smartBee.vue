<template>
  <view>
    <TransNavVue title="智能养蜂" />
  <view class="container">
    <scroll-view scroll-y class="content">
      <!-- 使用v-for遍历后端数据 -->
      <view 
        v-for="(item, index) in smartBeeList" 
        :key="index" 
        class="question-item"
        @click="showDetail(item.content)"
      >
        <text class="question-title">{{ index + 1 }}. {{ item.title }}</text>
        <text class="question-content">
          {{ item.content }}
        </text>
        <view class="divider"></view>
      </view>
      
      <!-- 弹窗组件 -->
      <uni-popup ref="popup" type="center">
        <view class="popup-content">
          <view class="popup-title">详情</view>
          <scroll-view scroll-y class="detail-scroll">
            <text class="detail-text">{{ currentContent }}</text>
          </scroll-view>
          <button class="close-btn" @click="closeDetail">关闭</button>
        </view>
      </uni-popup>
      
      <!-- 空状态提示 -->
      <view v-if="smartBeeList.length === 0" class="empty-state">
       
        <text class="empty-text">暂无相关内容</text>
      </view>
    </scroll-view>
  </view>
  </view>
</template>

<script setup>
import { ref} from 'vue';
import { request } from '@/utils/request'
import TransNavVue from '../../components/TransNav.vue'
import { onShow } from '@dcloudio/uni-app'
const smartBeeList=ref([])
const popup=ref(null)

onShow(() => {
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

const currentContent = ref('')

const showDetail = (content) => {
  currentContent.value = content
  popup.value.open()
}

const closeDetail = () => {
  popup.value.close()
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

.question-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popup-content {
	width: 600rpx;
	background: #fff;
	border-radius: 24rpx;
  padding: 20rpx;
	
  .detail-scroll {
    max-height: 60vh;
    
    .detail-text {
      font-size: 28rpx;
      line-height: 1.6;
      color: #333;
    }
  }
	

	.popup-title {
		font-weight: bold;
		font-size: 40rpx;
		color: #ff7f00;
		text-align: center;
		margin-bottom: 20rpx;
	}


	.close-btn {
		
		height: 80rpx;
		background: #ff6f0e;
		color: #fff;
		border-radius: 40rpx;
		font-size: 30rpx;
	}
}

</style>