<template>
  <view>
    <TransNavVue title="溯源管理" />
    <view class="container">
      <scroll-view scroll-y class="list">
        <view class="item" v-for="item in traceabilityList" :key="item.id">
          <view class="info">
            <view class="info-left">
              <image style="width:180rpx;height:180rpx" :src="item.imgUrl"></image>
              <view class="info-detail">
                <text class="name">{{ item.name }}</text>
                <text class="status" :class="getStatusClass(item.status)">{{ statusMap[item.status] }}</text>
                <text class="price">¥{{ item.price }}</text>
              </view>
            </view>
            <view class="editbtn" :class="{
              'orange-btn': item.status == 2,
              'black-btn': item.status == 1,
              'empty-btn': item.status == 0
            }">
              <image v-if="item.status !== 0" style="width:25rpx; height:25rpx;"
                src="/static/images/myPage/editIcon.png"></image>
              <view v-if="item.status == 2" @click="editTraceability(item)">修改</view>
              <view v-if="item.status == 1" :class="{ 'claimed-btn': item.isClaimed }"
                @click="!item.isClaimed && traceCode(item)">
                {{ item.isClaimed ? '已领取' : '领取' }}
              </view>
              <view v-if="item.status == 0">&nbsp;</view>
            </view>
          </view>
        </view>
        <view v-if="traceabilityList.length === 0" class="empty-state">
       
          <text class="empty-text">暂无商品</text>
        </view>
      </scroll-view>

      <view class="footer">
        <button class="add-btn" @click="addTraceability">新增商品</button>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, onMounted, } from 'vue'
import { request } from '@/utils/request'
import { onShow } from '@dcloudio/uni-app';
import TransNavVue from '../../components/TransNav.vue'

const traceabilityList = ref([])
const statusMap = ref({ 0: '审核中', 1: '审核通过', 2: '已拒绝' })
const beeFarmId = ref({})

// 获取溯源商品的列表
const getTraceabilityList = async () => {
  try {
    const res = await request({
      url: `/app-api/weixin/traceability/get/list?beeFarmId=${beeFarmId.value.id}`,
      showLoading: true
    })

    if (res.code === 0) {
      traceabilityList.value = (res.data || []).map(item => ({
        ...item,
        isClaimed: item.status === 1 ? false : undefined // 初始化领取状态
      }));
    } else {
      throw new Error(res.msg || '溯源商品列表失败')
    }
  } catch (err) {
    console.error('溯源商品列表失败:', err)
    uni.showToast({
      title: err.message || '溯源商品列表失败',
      icon: 'none'
    })
  }
}

//领取溯源码

const traceCode = async (item) => {
  try {
    const res = await request({
      url: `/app-api/weixin/traceability/get/traceCode?id=${item.id}`,
      showLoading: true
    })

    if (res.code === 0) {
      // 更新领取状态
      traceabilityList.value = traceabilityList.value.map(i =>
        i.id === item.id ? { ...i, isClaimed: true } : i
      );

      uni.showToast({
        title: '成功领取溯源码',
        icon: 'none'
      })
    }
    else {
      throw new Error(res.msg || '领取溯源码失败')
    }
  } catch (err) {
    console.error('领取溯源码失败:', err)
    uni.showToast({
      title: err.message || '领取溯源码失败',
      icon: 'none'
    })
  }
}


// 新增商品
const addTraceability = () => {
  uni.navigateTo({
    url: `/pages/traceabilityManagement/addProduct?id=${beeFarmId.value.id}`
  })
}

// 编辑商品
const editTraceability = (item) => {
  uni.navigateTo({
    url: `/pages/traceabilityManagement/addProduct?id=${beeFarmId.value.id}`,
    success: (res) => {
      res.eventChannel.emit('addProduct', {
        data: item
      })

    }
  })

}


onMounted(() => {

})

onShow(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  beeFarmId.value = currentPage.$page.options || currentPage.options
  if (beeFarmId.value.id) {
    getTraceabilityList()
  } else {
    console.error(' 蜂场id 缺失')
  }
})

//动态添加样式
const getStatusClass = (status) => {
  return {
    'status-pending': status == '0',
    'status-rejected': status == '2',
    'status-approved': status == '1'
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  padding-bottom: 120rpx;

  .list {
    flex: 1;

    .item {
      background: #fff;
      border-radius: 10rpx;
      margin: 20rpx;
      position: relative;


      .info {
        height: 231rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .info-left {
          display: flex;
          padding: 20rpx;

          .info-detail {
            margin-left: 20rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .name {
              font-size: 32rpx;
              font-weight: bold;
              color: #000;
            }

            .status {
              padding: 4rpx 12rpx;
              border-radius: 8rpx;
              font-size: 24rpx;

              &-pending {
                background-color: rgba(253, 208, 0, 0.12);
                color: #fd9c00;
              }

              &-rejected {
                background-color: rgba(253, 76, 0, 0.12);
                color: #eb5c20;
              }

              &-approved {
                background-color: rgba(235, 235, 235, 0.8);
                color: #666666;
              }
            }

            .price {
              font-size: 40rpx;
              color: #fa4b46;
              font-weight: bold;
            }
          }



        }

        .editbtn {
          width: 120rpx;
          height: 100%; // 改为100%以匹配父容器高度
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border-radius: 0 10rpx 10rpx 0;
          font-size: 24rpx;

          &.orange-btn {
            background-color: #ff6f0e;
            color: #fff;
          }

          &.black-btn {
            background-color: #000;
            color: #fff;
          }

          &.empty-btn {
            background-color: transparent;
          }
        }
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    padding: 20rpx;
    background: #fff;

    .add-btn {
      background: #ff6f0e;
      color: #fff;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      font-size: 32rpx;
    }
  }

  .black-btn.claimed-btn {
    background-color: #888 !important;
    cursor: not-allowed;
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