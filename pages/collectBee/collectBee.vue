<template>
  <view>
    <TransNavVue title="蜂场列表"></TransNavVue>
    <view class="container">
      <view class="query-box">
        <picker class="select" @change="onProvinceChange" :value="selectedProvinceIndex" :range="provinceList" range-key="name">
          <view class="picker-text">
            {{ selectedProvinceIndex  ? provinceList[selectedProvinceIndex].name : '请选择地区' }}
          </view>
        </picker>
        
        <picker class="select" @change="onFarmChange" :value="selectedFarmIndex" :range="nectarList" range-key="name">
          <view class="picker-text">
            {{ selectedFarmIndex ? nectarList[selectedFarmIndex].name : '选择蜜源' }}
          </view>
        </picker>
        
        <view class="query-btn" @click="handleQuery">查询</view>
        <view class="reset-btn" @click="handleReset">重置</view>
      </view>
      <view class="collect-container">
        <view class="collect-box" v-for="item in beehiveList" :key="item.id">
          <view class="collect-img">
            <image style="width: 100%; height: 100%; border-radius: 10rpx;"  :src="item.imgUrl" mode="aspectFill"></image>
          </view>
          <view class="collect-info">
            <view class="info-title">
              {{ item.name }}
              <view class="info-format">蜜源类型：<text class="info-weight">{{item.honeySeeds }}</text>
              </view>
            </view>
            <view class="pddBtn"  @click="goToPayBeeFarm(item)">认养一箱蜂</view>
           
          </view>
        </view>
      </view>
      <view class="empty-box" v-if="beehiveList.length === 0">
        <text class="empty-text">暂无蜂场</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight, getNarBarHeight } from '../../utils/system';
import { ref } from 'vue'
import TransNavVue from '../../components/TransNav.vue';
import { request, } from '@/utils/request'
import { onShow } from '@dcloudio/uni-app'

// 定义响应式数据
const selectedProvinceIndex = ref('');  
const selectedFarmIndex = ref('');    
const beehiveList = ref([]);
const nectarList=ref([])
const fromData = ref({  
  region: '',  
  honeySeeds: ''  
});


const provinceList = ref([
  { id: '110000', name: '北京市' },
  { id: '120000', name: '天津市' },
  { id: '310000', name: '上海市' },
  { id: '500000', name: '重庆市' },
  { id: '130000', name: '河北省' },
  { id: '140000', name: '山西省' },
  { id: '150000', name: '内蒙古' },
  { id: '210000', name: '辽宁省' },
  { id: '220000', name: '吉林省' },
  { id: '230000', name: '黑龙江省' },
  { id: '320000', name: '江苏省' },
  { id: '330000', name: '浙江省' },
  { id: '340000', name: '安徽省' },
  { id: '350000', name: '福建省' },
  { id: '360000', name: '江西省' },
  { id: '370000', name: '山东省' },
  { id: '410000', name: '河南省' },
  { id: '420000', name: '湖北省' },
  { id: '430000', name: '湖南省' },
  { id: '440000', name: '广东省' },
  { id: '450000', name: '广西' },
  { id: '460000', name: '海南省' },
  { id: '510000', name: '四川省' },
  { id: '520000', name: '贵州省' },
  { id: '530000', name: '云南省' },
  { id: '540000', name: '西藏' },
  { id: '610000', name: '陕西省' },
  { id: '620000', name: '甘肃省' },
  { id: '630000', name: '青海省' },
  { id: '640000', name: '宁夏' },
  { id: '650000', name: '新疆' },
  { id: '710000', name: '台湾省' },
  { id: '810000', name: '香港' },
  { id: '820000', name: '澳门' }
]);

// 页面显示时加载数据
onShow(() => {
  getAllNectarList()
  getAllBeehiveList();
});

// 获取所有蜜源
const getAllNectarList = async () => {
  try {
    const res = await request({
      url: '/app-api/weixin/nectar/get/list',
    });
    if (res.code === 0) {
      nectarList.value = res.data || [];
    } else {
      throw new Error(res.msg || '获取蜜源种类失败');
    }
  } catch (err) {
    console.error('获取蜜源种类失败:', err);
  }
};

// 获取所有蜂场
const getAllBeehiveList = async () => {
  try {
    const res = await request({
      url:`/app-api/front/bee-farm/get/list?region=${fromData.value.region}&honeySeeds=${fromData.value.honeySeeds}`,
    });
    if (res.code === 0) {
      beehiveList.value = res.data || [];
    } else {
      throw new Error(res.msg || '获取蜂箱列表失败');
    }
  } catch (err) {
    console.error('获取蜂箱列表失败:', err);
  }
};



// 选择蜜源
const onFarmChange = (e) => {
  selectedFarmIndex.value = e.detail.value;
  fromData.value.honeySeeds=nectarList.value[selectedFarmIndex.value].name

};

//跳转到认养界面
const goToPayBeeFarm = (item) => {
  uni.navigateTo({
        url:`/pages/collectBee/payBeeFarm?id=${item.id}`
    })

};




// 选择省份
const onProvinceChange = (e) => {
  selectedProvinceIndex.value = e.detail.value;
  fromData.value.region=provinceList.value[selectedProvinceIndex.value].name
};

// 查询
const handleQuery = () => {
  getAllBeehiveList();
};

// 重置
const handleReset = () => {
  selectedProvinceIndex.value ='';
  selectedFarmIndex.value = '';
  fromData.value = { region: '', honeySeeds: '' };
  getAllBeehiveList();
};
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