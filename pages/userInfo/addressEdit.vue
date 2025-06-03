<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="label">联系人</text>
        <input class="input" v-model="form.consigneeName" placeholder="请输入联系人姓名" />
      </view>
      
      <view class="form-item">
        <text class="label">手机号码</text>
        <input class="input" v-model="form.phoneNumber" placeholder="请输入手机号码" type="number" />
      </view>
      
      <view class="form-item" @click="showRegionPicker">
        <text class="label">所在地区</text>
        <view class="input">
          <text>{{form.province || '请选择'}}{{form.city ? ' ' + form.city : ''}}{{form.region ? ' ' + form.region : ''}}</text>
        </view>
        <image src="/static/images/rightBtn.png" class="arrow"></image>
      </view>
      
      <view class="form-item">
        <text class="label">详细地址</text>
        <input class="input" v-model="form.addressDetail" placeholder="请输入详细地址" />
      </view>
      
     
    </view>
    
    <view class="footer">
      <button class="save-btn" @click="save">保存</button>
    </view>
    
    <!-- 地区选择器弹窗 -->
    <view class="region-picker" v-if="regionPickerVisible">
      <view class="region-header">
        <text @click="closeRegionPicker">取消</text>
        <text class="title">选择地区</text>
        <text @click="confirmRegion">确定</text>
      </view>
      
      <view class="region-tabs">
        <text :class="{ active: currentTab === 0 }" @click="switchTab(0)">省份</text>
        <text :class="{ active: currentTab === 1 }" @click="switchTab(1)">城市</text>
        <text :class="{ active: currentTab === 2 }" @click="switchTab(2)">区县</text>
      </view>
      
      <view class="region-content">
        <scroll-view scroll-y class="region-list">
          <view class="region-item" 
                v-for="(item, index) in currentRegionList" 
                :key="index"
                :class="{ selected: isItemSelected(item) }"
                @click="selectRegion(item)">
            {{ item.name }}
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { request } from '@/utils/request'

const areaList = ref([])
const regionPickerVisible = ref(false)
const currentTab = ref(0)
const selectedProvince = ref(null)
const selectedCity = ref(null)
const selectedRegion = ref(null)
const isEditMode = ref(false)
const addressId = ref(null)
const form = ref({
  consigneeName: '',
  phoneNumber: '',
  province: '',  // 省份名称
  city: '',      // 城市名称
  region: '',    // 区县名称
  addressDetail: '',
  isDefault: false
})


onMounted(() => {
  getAreaList()
  //判断是否编辑模式
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage && currentPage.$vm) {
    const eventChannel = currentPage.$vm.getOpenerEventChannel()
    eventChannel.on('acceptAddressData', (data) => {
      // 检查是否有id，确定编辑模式
      if (data && data.address.id) {
        isEditMode.value = true
        addressId.value = data.address.id
         // 复制数据到表单
      form.value = {
        consigneeName: data.address.consigneeName || '',
        phoneNumber: data.address.phoneNumber || '',
        province: data.address.province || '',
        city: data.address.city || '',
        region: data.address.region || '',
        addressDetail: data.address.addressDetail || '',
        isDefault: data.address.isDefault || false
      }
      // 回显地址信息
      if (form.value.province) {
          selectedProvince.value = findRegionByName(areaList.value, form.value.province)
        }
        if (form.value.city && selectedProvince.value) {
          selectedCity.value = findRegionByName(selectedProvince.value.children, form.value.city)
        }
        if (form.value.region && selectedCity.value) {
          selectedRegion.value = findRegionByName(selectedCity.value.children, form.value.region)
        }
      } else {
        isEditMode.value = false
      }
    })
  }
   
})
//获取地址树
const getAreaList = async () => {
  try {
    const res = await request({
      url: '/app-api/system/area/tree',
      showLoading: true, 
    })
    if (res.code === 0 ) {
      areaList.value = res.data
    } else {
      throw new Error(res.msg || '数据异常')
    }
  } catch (err) {
    
    uni.showToast({
      title: '获取地区数据失败，请稍后重试',
      icon: 'none'
    })
  }
}

// 显示地区选择器
const showRegionPicker = () => {
  if (areaList.value.length === 0) {
    uni.showToast({
      title: '地区数据加载中，请稍后再试',
      icon: 'none'
    })
    return
  }
  
  regionPickerVisible.value = true
}

// 关闭地区选择器
const closeRegionPicker = () => {
  regionPickerVisible.value = false
}

// 切换选项卡
const switchTab = (tabIndex) => {
  currentTab.value = tabIndex
}

// 获取当前区域列表
const currentRegionList = computed(() => {
  if (currentTab.value === 0) {
    return areaList.value
  } else if (currentTab.value === 1 && selectedProvince.value) {
    return selectedProvince.value.children || []
  } else if (currentTab.value === 2 && selectedCity.value) {
    return selectedCity.value.children || []
  }
  return []
})

// 选择区域
const selectRegion = (region) => {
  if (currentTab.value === 0) { // 选择省份
    selectedProvince.value = region
    selectedCity.value = null
    selectedRegion.value = null
    currentTab.value = 1
  } else if (currentTab.value === 1) { // 选择城市
    selectedCity.value = region
    selectedRegion.value = null
    currentTab.value = 2
  } else if (currentTab.value === 2) { // 选择区县
    selectedRegion.value = region
  }
}

// 确认选择地区
const confirmRegion = () => {
  if (!selectedProvince.value) {
    uni.showToast({
      title: '请选择省份',
      icon: 'none'
    })
    return
  }
  
  if (!selectedCity.value) {
    uni.showToast({
      title: '请选择城市',
      icon: 'none'
    })
    return
  }
  
  // 更新表单数据
  form.value.province = selectedProvince.value.name
  form.value.city = selectedCity.value.name
  form.value.region = selectedRegion.value ? selectedRegion.value.name : ''
  
  regionPickerVisible.value = false
}

// 检查区域是否被选中
const isItemSelected = (item) => {
  if (currentTab.value === 0) {
    return selectedProvince.value && selectedProvince.value.id === item.id
  } else if (currentTab.value === 1) {
    return selectedCity.value && selectedCity.value.id === item.id
  } else if (currentTab.value === 2) {
    return selectedRegion.value && selectedRegion.value.id === item.id
  }
  return false
}

// 根据名称查找区域
const findRegionByName = (list, name) => {
  if (!list || !list.length) return null
  for (const item of list) {
    if (item.name === name) return item
    if (item.children) {
      const found = findRegionByName(item.children, name)
      if (found) return found
    }
  }
  return null
}

// 保存地址
const save = async () => {
  // 表单验证
  if (!form.value.consigneeName) {
    uni.showToast({
      title: '请输入联系人姓名',
      icon: 'none'
    })
    return
  }
  
  if (!form.value.phoneNumber) {
    uni.showToast({
      title: '请输入手机号码',
      icon: 'none'
    })
    return
  }
  
  // 手机号码格式验证
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(form.value.phoneNumber)) {
    uni.showToast({
      title: '手机号码格式不正确',
      icon: 'none'
    })
    return
  }
  
  if (!form.value.province || !form.value.city) {
    uni.showToast({
      title: '请选择所在地区',
      icon: 'none'
    })
    return
  }
  
  if (!form.value.addressDetail) {
    uni.showToast({
      title: '请输入详细地址',
      icon: 'none'
    })
    return
  }
  
  // 准备提交的数据
  const submitData = {
    consigneeName: form.value.consigneeName,
    phoneNumber: form.value.phoneNumber,
    province: form.value.province,
    city: form.value.city,
    region: form.value.region,
    addressDetail: form.value.addressDetail,
    isDefault: form.value.isDefault
  }
  
  // 如果是编辑模式，添加地址ID
  if (isEditMode.value && addressId.value) {
    submitData.id = addressId.value
  }
  
  try {
    uni.showLoading({
      title: '保存中...'
    })
    
    const res = await request({
      url: isEditMode.value 
        ? `/app-api/weixin/shipping-address/update/?id=${addressId.value}` 
        : '/app-api/weixin/shipping-address/create',
      method: isEditMode.value ? 'PUT' : 'POST',
      data: submitData,
      showLoading: false
    })
    
    uni.hideLoading()
    
    if (res.code === 0) {
      uni.showToast({
        title: isEditMode.value ? '地址更新成功' : '地址添加成功',
        icon: 'success'
      })
      
      // 返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      throw new Error(res.msg || '保存失败')
    }
  } catch (err) {
    uni.hideLoading()
    console.error('保存地址失败:', err)
    uni.showToast({
      title: err.message || '保存失败，请稍后重试',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  
  .form {
    padding: 30rpx;
    background: #fff;
    
    .form-item {
      height: 100rpx;
      display: flex;
      align-items: center;
      border-bottom: 1rpx solid #eee;
      
      .label {
        width: 160rpx;
        font-size: 30rpx;
        color: #333;
      }
      
      .input {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }
      
      .arrow {
        width: 30rpx;
        height: 30rpx;
        margin-left: 20rpx;
      }
      
      .switch {
        transform: scale(0.8);
        transform-origin: right center;
      }
    }
  }
  
  .footer {
    padding: 30rpx;
    background: #fff;
    margin-top: 20rpx;
    
    .save-btn {
      background: #ff6f0e;
      color: #fff;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      font-size: 32rpx;
    }
  }
  
  // 地区选择器样式
  .region-picker {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 700rpx;
    background-color: #fff;
    z-index: 100;
    border-radius: 20rpx 20rpx 0 0;
    
    .region-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 88rpx;
      padding: 0 30rpx;
      border-bottom: 1rpx solid #eee;
      
      text {
        font-size: 32rpx;
        color: #333;
      }
      
      .title {
        font-weight: bold;
      }
    }
    
    .region-tabs {
      display: flex;
      height: 88rpx;
      border-bottom: 1rpx solid #eee;
      
      text {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30rpx;
        color: #666;
        
        &.active {
          color: #ff6f0e;
          border-bottom: 4rpx solid #ff6f0e;
        }
      }
    }
    
    .region-content {
      height: calc(700rpx - 176rpx);
      
      .region-list {
        height: 100%;
      }
      
      .region-item {
        height: 90rpx;
        line-height: 90rpx;
        padding: 0 30rpx;
        font-size: 28rpx;
        color: #333;
        
        &.selected {
          color: #ff6f0e;
        }
      }
    }
  }
}
</style>