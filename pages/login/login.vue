<template>
  <view class="login-container">
    <image src="/static/images/logo.png" class="logo"></image>
    <button 
      class="login-btn" 
      open-type="getPhoneNumber" 
      @getphonenumber="handleWechatLogin"
    >
      微信一键登录
    </button>
  </view>
</template>

<script setup>
import { useTokenStorage } from '../../utils/storage'
import { request } from '@/utils/request'

const { setToken } = useTokenStorage()

const handleWechatLogin = async (e) => {
  try {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      uni.showToast({ title: '登录失败，请重试', icon: 'none' })
      return
    }

    const loginRes = await uni.login({ provider: 'weixin' })
    
    const res = await request({
      url: '/app-api/auth/front/wechat/login',
      method: 'POST',
      data: {
        phoneCode: e.detail.code,
        loginCode: loginRes.code
      }
    })

    if (res.code === 200) {
      setToken(res.data.token)
      uni.showToast({ title: '登录成功' })
      uni.navigateBack()
    }
  } catch (err) {
    console.error('登录失败:', err)
    uni.showToast({ title: '登录失败', icon: 'none' })
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
</style>