<template>
  <view class="container">
   
    
    <view class="form">
      
      <view class="form-item">
        <text class="label">联系人</text>
        <input class="input" v-model="form.name" placeholder="请输入联系人姓名" />
      </view>
      
      <view class="form-item">
        <text class="label">手机号码</text>
        <input class="input" v-model="form.phone" placeholder="请输入手机号码" type="number" />
      </view>
      
      <view class="form-item" @click="showRegionPicker">
        <text class="label">所在地区</text>
        <view class="input">
          <text>{{form.province || '请选择'}}{{form.city || ''}}{{form.district || ''}}</text>
        </view>
        <image src="/static/images/myPapeImages/向右箭头.png" class="arrow"></image>
      </view>
      
      <view class="form-item">
        <text class="label">详细地址</text>
        <input class="input" v-model="form.detail" placeholder="请输入详细地址" />
      </view>
      
     
    </view>
    
    <view class="footer">
      <button class="save-btn" @click="save">保存</button>
   
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request'

const form = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

const isEditMode = ref(false)
const addressId = ref(null)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  
  if (currentPage && currentPage.$page.options.id) {
    isEditMode.value = true
    addressId.value = currentPage.$page.options.id
    // 从页面参数获取地址数据
    const eventChannel = currentPage.$vm.getOpenerEventChannel()
    eventChannel.on('acceptAddressData', (data) => {
      form.value = data.address
    })
  }
})

const fetchAddressDetail = async (id) => {
  try {
    const res = await request({
      url: `/app-api/address/detail?id=${id}`,
      method: 'get'
    })
    if (res.code === 0 || res.code === 200) {
      formData.value = res.data
    }
  } catch (err) {
    console.error('获取地址详情失败:', err)
  }
}

const submitAddress = async () => {
  try {
    const url = isEditMode.value 
      ? '/app-api/address/update' 
      : '/app-api/address/create'
      
    const res = await request({
      url,
      method: 'post',
      data: isEditMode.value 
        ? { ...formData.value, id: addressId.value }
        : formData.value
    })
    
    if (res.code === 0 || res.code === 200) {
      uni.showToast({
        title: isEditMode.value ? '修改成功' : '新增成功',
        icon: 'success'
      })
      uni.navigateBack()
    }
  } catch (err) {
    console.error('保存地址失败:', err)
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
}
</style>