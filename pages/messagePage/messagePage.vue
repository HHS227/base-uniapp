<template>
		<view>
			<TransNavVue title="我的消息"/>

		<uni-popup ref="popup" type="center">
		<view class="popup-content">
			<view class="popup-title">{{ currentMessage.templateNickname }}</view>
			<view class="popup-time">{{ formatDateTime(currentMessage.createTime) }}</view>
			<view class="popup-body">{{ currentMessage.templateContent }}</view>
			<button class="popup-btn" @click="closePopup">确定</button>
		</view>
	</uni-popup>
	<view class="container">
		<scroll-view scroll-y="true" class="scroll-content">
			<view v-if="messageList.length === 0" class="empty-tip">
				
				<text>暂无消息数据</text>
			</view>
			<view 
				v-else
				v-for="(item, index) in messageList" 
				:key="index" 
				class="message-item" 
				@click="showMessageDetail(item)"
			>
				<view class="item-left">
					<image src="/static/images/myPage/message-icon.png" mode=""></image>
					<view class="item-info">
						<view class="item-title">{{ item.templateNickname }}</view>
						<view class="item-time">{{formatDateTime(item.createTime) }}</view>
					</view>
				</view>
				<view class="item-right read" v-if="item.readStatus">已读</view>
				<view class="item-right unread" v-else>未读</view>
			</view>
		</scroll-view>
		<view class="safe-view"></view>
	</view>
	
		</view>
</template>

<script setup>
import { ref ,onMounted} from 'vue';
import { request } from '@/utils/request'
import TransNavVue from '../../components/TransNav.vue';



const popup = ref(null);
const messageList = ref([]);
const currentMessage = ref({});

const showMessageDetail = (item) => {
  currentMessage.value = {
    ...item,
    id: item.id // 确保使用正确的ID字段
  };
  popup.value.open();
};

const closePopup = async () => {
  // 如果已经是已读状态，直接关闭弹窗
  if (currentMessage.value.readStatus) {
    popup.value.close()
    return
  }

  const ids = [currentMessage.value.id]
  try {
    // 调用已读接口
    await request({
      url: `/app-api/WeiXinMini/index/read?ids=${ids}`,
      method: 'POST'
    })
    
    // 更新本地数据状态
    const index = messageList.value.findIndex(item => item.id === currentMessage.value.id)
    if (index !== -1) {
      messageList.value[index].readStatus = true
    }
  } catch (err) {
    console.error('更新已读状态失败:', err)
  } finally {
    popup.value.close()
  }
}
onMounted(() => {
	getCurrentMessage()
 

})
// 获取当前消息
const getCurrentMessage = async () => {
	try {
    const res = await request({
      url: '/app-api/WeiXinMini/index/get/myMessageList',
      showLoading: true, 
     
    })
    
    if (res.code === 0 || res.code === 200) {
     messageList.value = res.data || []; 
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取消息失败:', err)
   
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
.popup-content {
	width: 600rpx;
	background: #fff;
	border-radius: 24rpx;
	padding: 40rpx;

	.popup-title {
		font-weight: bold;
		font-size: 40rpx;
		color: #0a0b0f;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.popup-time {
		font-weight: 400;
		font-size: 22rpx;
		color: #999999;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.popup-body {
		font-weight: 400;
		font-size: 27rpx;
		color: #323232;
		line-height: 1.6;
		margin-bottom: 40rpx;
	}

	.popup-btn {
		width: 100%;
		height: 80rpx;
		background: #ff6f0e;
		color: #fff;
		border-radius: 40rpx;
		font-size: 30rpx;
	}
}
.container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f6f6f6;

	.scroll-content {
		margin-top: 24rpx;
		flex: 1;
		height: 720rpx;

		.message-item {
			width: 702rpx;
			height: 200rpx;
			background: #ffffff;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			margin: auto;
			margin-bottom: 16rpx;
			display: flex;
			justify-content: space-between;
			padding: 24rpx;

			.item-left {
				display: flex;

				image {
					width: 152rpx;
					height: 152rpx;
				}

				.item-info {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 24rpx;

					.item-title {
						font-weight: bold;
						font-size: 30rpx;
						color: #1e1e1e;
						line-height: 46rpx;
					}

					.item-time {
						font-weight: 400;
						font-size: 26rpx;
						color: #999999;
						line-height: 40rpx;
					}
				}
			}

			.item-right {
				font-weight: 500;
				font-size: 28rpx;
			}

			.unread {
				color: #ff6f0e;
			}

			.read {
				color: #999999;
			}
		}
	}
	.empty-tip {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 500rpx;
		
		
		
		text {
			font-size: 28rpx;
			color: #999;
		}
	}
}
</style>
