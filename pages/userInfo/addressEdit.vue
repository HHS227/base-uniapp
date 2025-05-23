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
      
      <view class="form-item">
        <text class="label">设为默认</text>
        <switch class="switch" :checked="form.isDefault" @change="(e) => form.isDefault = e.detail.value" />
      </view>
    </view>
    
    <view class="footer">
      <button class="save-btn" @click="save">保存</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TransNavVue from '../../components/TransNav.vue'

const route = useRoute()
const id = ref(route.query.id || '')

const form = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

onMounted(() => {
  if (id.value) {
    // 这里应该是从接口获取地址详情
    form.value = {
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园路1号',
      isDefault: true
    }
  }
})

const showRegionPicker = () => {
  uni.chooseLocation({
    success: (res) => {
      form.value.province = res.province
      form.value.city = res.city
      form.value.district = res.district
    }
  })
}

const save = () => {
  // 这里应该是调用保存接口
  uni.showToast({ title: '保存成功' })
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
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