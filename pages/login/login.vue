<template>
  <view class="login-container">
    <image src="/static/images/logo.png" class="logo"></image>
    <button 
      class="login-btn" 
      @click="handleWechatLogin"
      :disabled="isLoading"
    >
      {{ isLoading ? '登录中...' : '微信一键登录' }}
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useTokenStorage } from '../../utils/storage'
import { request } from '@/utils/request'

const { setToken } = useTokenStorage()
const isLoading = ref(false)

const handleWechatLogin = async () => {
  try {
    isLoading.value = true
    const loginRes = await uni.login({ provider: 'weixin' })
    
    const res = await request({
      url: '/app-api/auth/front/wechat/login',
      method: 'POST',
      data: {
        loginCode: loginRes.code
      }
    })

    if (res.code === 200) {
      setToken(res.data.token)
      uni.showToast({ title: '登录成功' })
      // 跳转到指定页面，例如首页
      uni.switchTab({
        url: '/pages/myPage/myPage'
      })
    }
  } catch (err) {
    console.error('登录失败:', err)
    uni.showToast({ title: '登录失败', icon: 'none' })
  } finally {
    isLoading.value = false
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
  }
}

.login-btn:disabled {
  opacity: 0.7;
}
</style>