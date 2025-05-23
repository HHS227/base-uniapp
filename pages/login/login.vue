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
    
    <!-- 新增用户信息确认弹窗 -->
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog 
        mode="base"
        title="完善信息"
        content="请授权获取您的用户信息以完善资料"
        @confirm="confirmGetUserInfo"
        @close="closePopup"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useTokenStorage } from '../../utils/storage'
import { request } from '@/utils/request'

const { setToken } = useTokenStorage()
const isLoading = ref(false)
const popup = ref(null)
const loginData = ref(null) // 存储登录返回的数据

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
      loginData.value = res.data
      
      if (res.data.needuserinfo && res.data.newuser) {
        // 显示弹窗让用户确认
        popup.value.open()
      } else {
        uni.switchTab({ url: '/pages/myPage/myPage' })
      }
    }
  } catch (err) {
    console.error('登录失败:', err)
    uni.showToast({ title: '登录失败', icon: 'none' })
  } finally {
    isLoading.value = false
  }
}

const confirmGetUserInfo = async () => {
  try {
    const userInfo = await uni.getUserProfile({
      desc: '获取用户信息用于完善资料',
      lang: 'zh_CN'
    })
    
    await request({
      url: '/app-api/auth/front/wechat/saveUserInfo',
      method: 'POST',
      data: {
        token: loginData.value.token,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv
      }
    })
    
    uni.switchTab({ url: '/pages/myPage/myPage' })
  } catch (err) {
    console.error('获取用户信息失败:', err)
  }
}

const closePopup = () => {
  // 用户拒绝授权，直接跳转
  uni.switchTab({ url: '/pages/myPage/myPage' })
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