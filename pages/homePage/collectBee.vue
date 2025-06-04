<template>
	<view>
		<TransNavVue title="认养一箱蜂"></TransNavVue>
  <view class="container">
    
    <view class="collect-box" v-for="item in beehiveList" :key="item.id">
      <view class="collect-img"></view>
      <view class="collect-info">
        <view class="info-title">
          {{item.name}}
          <view class="info-format">蜂箱类型：<text class="info-weight">{{getBeehiveTypeName(item.beehiveType)}}</text></view>
        </view>
        <view class="pddBtn" v-if="item.adoptionType == 2" @click="handleBuy(item)">￥{{item.sharePrice}}拼团</view>
        <view class="pddBtn" v-else @click="handleBuy(item)">￥{{item.price}}购买</view>
      </view>
    </view>
  </view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TransNavVue from '../../components/TransNav.vue';
import { request } from '@/utils/request'

const beehiveList = ref([])

onMounted(() => {
  getBeehiveList()
})

const getBeehiveList = async () => {
  try {
    const res = await request({
      url: '/app-api/front/beehive/all/list',
      showLoading: true
    })
    
    if (res.code === 0 ) {
      beehiveList.value = res.data || []
    } else {
      throw new Error(res.msg || '获取蜂箱列表失败')
    }
  } catch (err) {
    console.error('获取蜂箱列表失败:', err)
    uni.showToast({
      title: '获取蜂箱列表失败',
      icon: 'none'
    })
  }
}

const getBeehiveTypeName = (type) => {
  const typeMap = {
    1: '基础蜂箱',
    2: '智慧蜂箱', 
    3: '超级蜂巢',
    4: '未来蜂巢'
  }
  return typeMap[type] || '未知类型'
}

const handleBuy = (item) => {
  uni.showToast({
    title: `购买了${item.name}蜂箱`,
    icon: 'none'
  })
  
  // 这里可以添加后续的购买逻辑
  // 比如跳转到支付页面或调用购买接口
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	height: 100vh;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	.collect-box{
		margin: 20rpx 30rpx;
		height: 500rpx;
		background-color: #fff;
		border-radius: 10rpx;
		
		
	}
	.collect-img{
		height: 350rpx;
		background-color: #ddd;
		border-radius: 10rpx;
	}
	.collect-info{
		margin: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.info-title{
		font-weight: 500;
		color: #333333;
		.info-weight{
			font-size: 24rpx;
			color: #333333;
			margin-left: 20rpx;
		}
		.info-format{
			margin-top: 20rpx;
			color: #999999;
			font-size: 24rpx;
		}
	}
	
	.pddBtn{
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #FF6F0E;
		text-align: center;
		color: #fff;
		border-radius: 30rpx;
	}
	}
</style>
