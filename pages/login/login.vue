<template>
  <view class="login-container">
    <image style='width: 200rpx; height: 80rpx;' src="/static/images/logo.png" class="logo"></image>
    <button 
      class="login-btn" 
      open-type="getPhoneNumber"
      @getphonenumber="handleWechatLogin"
      :class="{'disabled-btn': !agreed}"
      :disabled="!agreed || isLoading"
    >
      {{ isLoading ? '登录中...' : '微信一键登录' }}
    </button>
    
    <view class="agreement">
      <checkbox-group @change="handleAgreementChange">
        <label class="agreement-label">
          <checkbox class="agreement-checkbox" value="agree" :checked="agreed" />
          <text class="agreement-text">同意授权微信信息</text>
        </label>
      </checkbox-group>
    </view>
    
    
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useTokenStorage } from '../../utils/storage'
import { request } from '@/utils/request'

const { setToken } = useTokenStorage()
const isLoading = ref(false)
const loginCode = ref('')

const agreed = ref(false)
const userInfoRes = ref(null)

// 添加处理微信登录的方法
const handleWechatLogin = async (e) => {
  if (!agreed.value) {
    uni.showToast({
      title: '请先同意用户协议',
      icon: 'none'
    })
    return
  }

  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    uni.showToast({
      title: '获取手机号失败',
      icon: 'none'
    })
    return
  }

  try {
    isLoading.value = true
    
    // 获取登录code
    const loginRes = await uni.login({ provider: 'weixin' })
    loginCode.value = loginRes.code
    
    // 调用后端登录接口
    const res = await request({
      url: '/app-api/auth/front/wechat/login',
      method: 'POST',
      data: {
        loginCode: loginCode.value,
        phoneCode: e.detail.code,
        encryptedData: userInfoRes.value?.encryptedData,
        iv: userInfoRes.value?.iv
      }
    })
    
    if(res.code === 0 || res.code === 200) {
      setToken({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        openId: res.data.openid
      })
      uni.switchTab({ url: '/pages/myPage/myPage' })
    } else {
      throw new Error(res.msg || '登录失败')
    }
  } catch(err) {
    console.error('登录失败:', err)
    uni.showToast({ 
      title: err.message || '登录失败', 
      icon: 'none' 
    })
  } finally {
    isLoading.value = false
  }
}

const handleAgreementChange = async (e) => {
  agreed.value = e.detail.value.includes('agree')
  if(agreed.value) {
    try {
      userInfoRes.value = await uni.getUserProfile({
        desc: '获取用户信息用于完善资料',
        lang: 'zh_CN'
      })
      
    } catch(err) {
      console.error('获取用户信息失败:', err)
      agreed.value = false
      uni.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  
  .logo {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 100rpx;
  }
  
  .login-btn {
    width: 80%;
    background-color: #07C160;
    color: white;
    border-radius: 50rpx;
    transition: all 0.3s ease;
    
    &.disabled-btn {
      background-color: #cccccc !important;
      opacity: 0.7;
    }
    
    &:not(.disabled-btn):active {
      opacity: 0.8;
      transform: scale(0.98);
    }
  }
}

.login-btn:disabled {
  opacity: 0.7;
}

.agreement {
  margin-top: 30rpx;
  
  &-label {
    display: flex;
    align-items: center;
  }
  
  &-checkbox {
    transform: scale(0.7);
  }
  
  &-text {
    font-size: 24rpx;
    color: #666;
    margin-left: 5rpx;
  }
}

.login-btn:disabled {
  opacity: 0.5;
  background-color: #cccccc !important;
}
</style>