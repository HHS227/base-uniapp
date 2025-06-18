<template>
	<view>
		<TransNavVue title="推广佣金"></TransNavVue>
	<view class="container">
		<image src="/static/images/myPage/yjng.png" mode="" class="bg-image"></image>
		
		<view class="top-box">
			<view>邀好友 得现金</view>
			<text>邀请越多 奖励越多</text>
		</view>
		<view class="data-panel">
			<image class="panel-bg" src="/static/images/homePage/data-bg.png" mode=""></image>
			<view class="data-content">
				<view class="title">佣金详情</view>
				<view class="data-row">
					<view class="data-item">
						<image class="data-icon" src="/static/images/myPage/todaySEarnings.png"></image>
						<text class="data-label">今日佣金</text>
						<text class="data-value">{{ commissionData.todaySEarnings||0}}</text>
					</view>
					<view class="data-item">
						<image class="data-icon" src="/static/images/myPage/cumulativeEarnings.png"></image>
						<text class="data-label">累计佣金</text>
	
						<text class="data-value">{{ commissionData.cumulativeEarnings||0 }}</text>
					</view>
					<view class="data-item">
						<image class="data-icon" src="/static/images/myPage/currentEarnings.png"></image>
						<text class="data-label">累计邀请人数</text>
						<text class="data-value">{{ commissionData.countNumber||0 }}</text>
					</view>
				</view>
			
			</view>
		</view>
      <view style="display: flex; justify-content: space-between;">  
		<view class="withdraw-btn" @click="goToWithdraw">提现</view>
		<button class="withdraw-btn" open-type="share" >邀请</button>
	</view>
		<view class="withdraw-box">
            <view class="withdraw-header">
                <image style="width:100rpx;height:20rpx" src="/static/images/myPage/left-icon.png" class="withdraw-icon"></image>
                <text>提现佣金</text>
                <image style="width:100rpx;height:20rpx" src="/static/images/myPage/right-icon.png" class="withdraw-icon"></image>
            </view>
            <view class="withdraw-record">
                <view 
                    class="record-item" 
                    v-for="(item, index) in records" 
                    :key="index"
                >
                    <text class="record-time">{{ item.createTime }}</text>
                    <view>
                        <text>收益</text> 
                        <text class="record-amount">+{{ item.amount }}</text>
                    </view>   
                </view>
            </view>
		</view>
		
	</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import TransNavVue from '../../components/TransNav.vue';
import { request } from '@/utils/request'
import { onShow } from '@dcloudio/uni-app';

const records = ref([])
const commissionData = ref({})

// 跳转提现
const goToWithdraw = ()=>{
    uni.navigateTo({
        url:'/pages/cashWithdrow/cashWithdrow',
        success: (res) => {
            res.eventChannel.emit('withdrawAmount', {
                amount: commissionData.value.currentEarnings
            })
        }
    })
}
// 获取佣金详情
const getCommissionDetail = async () => {
	try {
    const res = await request({
      url: '/app-api/weixin/distribution/get/commission/info',
      showLoading: true, 
    })
    if (res.code === 0 ) {
     commissionData.value=res.data || {};
      
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
   
  }
}
// 获取佣金记录
const getCommissionDetailList = async () => {
	try {
    const res = await request({
      url: '/app-api/weixin/commission-records/get/list',
      showLoading: true, 
    })
    if (res.code === 0 ) {
		records.value=res.data||{}
      
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    console.error('获取分佣记录失败:', err)
   
  }
}
onShow(() => {
	getCommissionDetail()
	getCommissionDetailList()
})
</script>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	height: 100vh;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;

	.bg-image {
		width: 100%;
		height: 548rpx;
		position: absolute;
		z-index: -1;
	}
	.top-box{
		margin: 70rpx 40rpx;
		color: #ffffff;
		view{
			font-size: 58rpx;
			margin-bottom: 20rpx;
		}
	}
	.data-panel {
		margin: 0 auto;
		margin-top: 18rpx;
		width: 702rpx;
		height: 350rpx;
		position: relative;
		z-index: 1;
		.panel-bg {
			height: 100%;
			width: 100%;
			position: absolute;
			z-index: -1;
		}
		.data-content {
			width: 100%;
			padding: 30rpx;
			.title {
				font-size: 36rpx;
				font-weight: bold;
				text-align: center;
				margin-bottom: 70rpx;
				position: relative;
				
				&::after {
					content: '';
					position: absolute;
					bottom: -10rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 80rpx;
					height: 6rpx;
					background-color: #FF7D00;
					border-radius: 3rpx;
				}
			}
			.data-row {
				display: flex;
				justify-content: space-between;
				margin-bottom: 40rpx;
				.data-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					.data-icon {
						width: 60rpx;
						height: 60rpx;
						margin-bottom: 20rpx;
					}
					.data-label {
						font-size: 28rpx;
						color: #666;
						margin-bottom: 10rpx;
					}
					.data-value {
						font-size: 32rpx;
						font-weight: bold;
						color: #333;
					}
				}
			}
			
		}
	}
    .withdraw-btn {
		width: 50%;
        height: 90rpx;
        line-height: 90rpx;
        background-color: #FF7D00;
        color: white;
        font-size: 32rpx;
        border-radius: 35rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 40rpx 30rpx;
    }
    
    .withdraw-box {
        background-color: #fff;
        border-radius: 16rpx;
        margin: 30rpx;
        padding: 20rpx;
        margin-bottom: 0;
        
        .withdraw-header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30rpx;
            
            text {
                font-size: 32rpx;
                font-weight: bold;
                margin: 0 20rpx;
            }
            
            .withdraw-icon {
                width: 100rpx;
                height: 20rpx;
            }
        }
        
        .withdraw-record {
            max-height: 500rpx;
            overflow-y: auto;
            
            .record-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 30rpx 0;
                
                &:not(:last-child) {
                    margin-bottom: 20rpx;
                }
                
                .record-time {
                    font-size: 28rpx;
                    color: #666;
                }
                
                .record-amount {
                    font-size: 28rpx;
                    color: #FF7D00;
                    font-weight: bold;
                    margin-left: 10rpx;
                }
            }
        }
    }
}
</style>
