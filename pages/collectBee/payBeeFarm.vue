
<template>
  <view>
    <TransNavVue title="认养一箱蜂"/>
    <view class="container">
      <view >
        <video style="width: 100%; height: 300rpx;" src=""></video>
      </view>
      <view class="collect-box" v-for="item in beehiveList" :key="item.id">
          <view class="collect-img">
            <image style="width: 100%; height: 100%; border-radius: 10rpx;"  :src="item.images" mode="aspectFill"></image>
          </view>
          <view class="collect-info">
            <view class="info-title">
              {{ item.name }}
              <view class="info-format">蜂箱类型：<text class="info-weight">{{ getBeehiveTypeName(item.beehiveType) }}</text>
              </view>
            </view>
            <view class="pddBtn" v-if="item.adoptionType == 2" @click="handleBuy(item)">￥{{ item.sharePrice }}拼团</view>
            <view class="pddBtn" v-else @click="handleBuy(item)">￥{{ item.price }}购买</view>
          </view>
      </view>
      <view class="empty-box" v-if="beehiveList.length === 0">
        <text class="empty-text">暂无蜂箱</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight, getNarBarHeight } from '../../utils/system';
import { ref} from 'vue'
import TransNavVue from '../../components/TransNav.vue';
import { request,processPayment } from '@/utils/request'
import { onShow } from '@dcloudio/uni-app'

const beehiveList = ref([])
const videoUrl=ref('')

// 初始化数据
onShow(() => {
	  const pages = getCurrentPages()
	  const currentPage = pages[pages.length - 1]
	  const options = currentPage.$page.options || currentPage.options
	  if (options.id) {
      console.log(options,'1213')
      videoUrl.value=options.videoUrl
	    getBeehiveList(options.id)
	  } else {
	    console.error('蜂场ID 缺失')
	  }
	})

//获取蜂箱数据
const getBeehiveList = async (id) => {
  try {
    const res = await request({
      url: `/app-api/front/beehive/list?beeFarmId=${id}`,
    
    })

    if (res.code === 0) {
      beehiveList.value = res.data || []
    } else {
      throw new Error(res.msg || '获取蜂箱列表失败')
    }
  } catch (err) {
    console.error('获取蜂箱列表失败:', err)
    
  }
}
//判断蜂箱类型
const getBeehiveTypeName = (type) => {
  const typeMap = {
    1: '基础蜂箱',
    2: '智慧蜂箱',
    3: '超级蜂巢',
    4: '未来蜂巢'
  }
  return typeMap[type] || '未知类型'
}
//创建订单
const handleBuy = async (item) => {
  const dataPamas = {
    beehiveId: item.id,
    beehiveName: item.name,
    adoptType: item.adoptionType,
    price: item.price,
    sharedPrice: item.sharePrice
  }
  const adoptUrl = item.adoptionType === 1  ? '/app-api/front/beehive/adopt/alone'  : '/app-api/front/beehive/adopt/shared';
  const res = await request({
      url: adoptUrl,
      data: dataPamas,
      method: 'post',
      showLoading: true,
    });
    if (res.code === 0 && res.data.payOrderId) {
    const options={orderId : res.data.payOrderId, successToUrl :'/pages/adoptionRecords/adoptionRecords'}
    processPayment(options)
    } else {
      throw new Error(orderRes.msg || '订单创建失败');
    }
  } 


</script>

<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  height: 100vh;
  display: flex;
  flex-direction: column;

    .collect-box {
      margin: 20rpx 30rpx;
      height: 500rpx;
      background-color: #fff;
      border-radius: 10rpx;
    }

    .collect-img {
      height: 350rpx;
      background-color: #ddd;
      border-radius: 10rpx;
    }

    .collect-info {
      margin: 20rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info-title {
      font-weight: 500;
      color: #333333;

      .info-weight {
        font-size: 24rpx;
        color: #333333;
        margin-left: 20rpx;
      }

      .info-format {
        margin-top: 20rpx;
        color: #999999;
        font-size: 24rpx;
      }
    }

    .pddBtn {
      width: 200rpx;
      height: 70rpx;
      line-height: 70rpx;
      background-color: #FF6F0E;
      text-align: center;
      color: #fff;
      border-radius: 30rpx;
    }
  

}

// 新增空状态样式
.empty-box {
  padding: 100rpx 0;
  text-align: center;

  .empty-img {
    width: 300rpx;
    height: 300rpx;
    opacity: 0.6;
  }

  .empty-text {
    display: block;
    color: #999;
    font-size: 28rpx;
    margin-top: 20rpx;
  }
}
</style>
