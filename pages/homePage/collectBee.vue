<template>
  <view>
    <TransNavVue title="认养一箱蜂"></TransNavVue>
    <view class="container">
      <view class="query-box">
        <picker class="select" @change="onFarmChange" :value="selectedFarmId" :range="dataList" range-key="name">
          <view class="picker-text">{{selectedFarmId ? dataList.find(f => f.id === selectedFarmId)?.name : '选择蜂场'}}</view>
        </picker>
        <picker class="select" @change="onTypeChange" :value="selectedType" :range="typeOptions" range-key="label">
          <view class="picker-text">{{ selectedType !== '' ? typeOptions[selectedType -1].label : '选择类型' }}</view>
        </picker>
        <view class="query-btn" @click="handleQuery">查询</view>
        <view class="reset-btn" @click="handleReset">重置</view>
      </view>
      <view class="collect-container">
        <view class="collect-box" v-for="item in beehiveList" :key="item.id">
          <view class="collect-img">
            <image style="width: 100%; height: 100%; border-radius: 10rpx;"  :src="item.images[0]" mode="aspectFill"></image>
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
      </view>

      <view class="empty-box" v-if="beehiveList.length === 0">
        <text class="empty-text">暂无蜂箱</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TransNavVue from '../../components/TransNav.vue';
import { request } from '@/utils/request'
import { getStatusBarHeight, getTitleBarHeight, getNarBarHeight } from '../../utils/system';
import { useTokenStorage } from '../../utils/storage';

const { getAccessToken, getOpenId } = useTokenStorage();

const beehiveList = ref([])

const dataList = ref([])
const fromData = ref({
  BeeFarmId: '',
  adoptionType: ''
})

onMounted(() => {
  getBeehiveList()
  getInfoDataList()
})

const getBeehiveList = async () => {
  try {
    const res = await request({
      url: '/app-api/front/beehive/by/condition',
      showLoading: true,
      method: 'POST',
      data: fromData.value
    })

    if (res.code === 0) {
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

//获取所有的蜂场列表
const getInfoDataList = async () => {
  try {
    const res = await request({
      url: '/app-api/front/bee-farm/get/list',


    })
    if (res.code === 0) {
      dataList.value = res.data || []
    } else {
      throw new Error(res.msg || '数据异常')
    }
  }
  catch (err) {
    console.error('获取数据失败:', err)

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
    if (res.code === 0) {
      const payOrderId = res.data.payOrderId;
      // 2. 提交支付请求
      const paylist = await request({
        url: '/app-api/pay/order/submit',
        data: {
          id: payOrderId,
          channelCode: 'wx_lite',
          channelExtras: {
            openid: getOpenId() // 实际环境应从用户信息中获取
          }
        },
        method: 'post',
        showLoading: true,
      });

      if (paylist.code === 0) {
        // 解析支付参数
        const payParams = JSON.parse(paylist.data.displayContent);
        // 3. 调用微信支付API
        const payRes = await uni.requestPayment({
          provider: 'wxpay',
          timeStamp: String(payParams.timeStamp),  
          nonceStr: String(payParams.nonceStr),   
          package: payParams.packageValue || payParams.package,
          signType: payParams.signType || 'MD5',   
          paySign: String(payParams.paySign),      

          success: async (res) => {
            uni.showToast({
              title: '支付成功',
              icon: 'success'
            });


            // 4. 跳转到订单详情页
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/adoptionRecords/adoptionRecords'
              });
            }, 1500);
          },

          fail: async (err) => {
            getBeehiveList()
            if (err.errMsg.includes('cancel')) {
              uni.showToast({
                title: '支付已取消',
                icon: 'none'
              });
             
            }
          }
        });
      } else {
        throw new Error(paylist.msg || '支付请求失败');
      }
    } else {
      throw new Error(orderRes.msg || '订单创建失败');
    }
  } 






const selectedFarmId = ref('')
const selectedType = ref('')
const typeOptions = ref([{ label: '独享', value: '1'},{ label: '拼团', value: '2' }])

const onFarmChange = (e) => {
  selectedFarmId.value = dataList.value[e.detail.value]?.id || ''
}

const onTypeChange = (e) => {
  selectedType.value = typeOptions.value[e.detail.value].value
}

const handleQuery = () => {
  fromData.value = {
    BeeFarmId: selectedFarmId.value,
    adoptionType: selectedType.value
  }
  getBeehiveList()
}

const handleReset = () => {
  selectedFarmId.value = ''
  selectedType.value = ''
  fromData.value = {
    BeeFarmId: '',
    adoptionType: ''
  }
  getBeehiveList()
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .query-box {
    position: fixed;
    top: getNarBarHeight();
    left: 0;
    right: 0;
    padding: 20rpx 30rpx;
    background: #fff;
    display: flex;
    align-items: center;
    gap: 20rpx;

    .select {
      flex: 1;
      height: 70rpx;
      border: 1rpx solid #eee;
      border-radius: 10rpx;
      padding: 0 20rpx;

      .picker-text {
        line-height: 70rpx;
        color: #333;
        font-size: 28rpx;
      }
    }

    .query-btn {
      width: 100rpx;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      background: #FF6F0E;
      color: #fff;
      border-radius: 10rpx;
      font-size: 30rpx;
    }

    .reset-btn {
      width: 100rpx;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      background: #eee;
      color: #666;
      border-radius: 10rpx;
      font-size: 30rpx;
    }
  }

  .collect-container {
    margin-top: 130rpx;

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
