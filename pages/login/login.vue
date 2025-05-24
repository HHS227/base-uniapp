<template>
  <view class="login-container">
    <image style='width: 200rpx; height: 80rpx;' src="/static/images/logo.png" class="logo"></image>
    <button 
      class="login-btn" 
      @click="handleWechatLogin"
      :disabled="isLoading"
    >
      {{ isLoading ? '登录中...' : '微信一键登录' }}
    </button>
    
    <!-- 新增用户信息授权确认弹窗 -->
    <uni-popup ref="authPopup" type="dialog">
      <uni-popup-dialog 
        mode="base"
        title="用户信息授权"
        content="请确认授权获取您的用户信息"
        @confirm="confirmGetUserInfo"
        @close="closeAuthPopup"
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
const authPopup = ref(null)
const loginCode = ref('')

const handleWechatLogin = async () => {
  try {
    isLoading.value = true
    const res = await uni.login({ provider: 'weixin' })
    loginCode.value = res.code
    // 先显示授权弹窗
    authPopup.value.open()
  } catch (err) {
    console.error('微信登录失败:', err)
    uni.showToast({ title: '微信登录失败', icon: 'none' })
    isLoading.value = false
  }
}

const confirmGetUserInfo = async () => {
  try {
    const userInfo = await uni.getUserProfile({
      desc: '获取用户信息用于完善资料',
      lang: 'zh_CN'
    })

    const res = await request({
      url: '/app-api/auth/front/wechat/login',
      method: 'POST',
      data: {
        loginCode: loginCode.value,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv
      }
    })
    
    if (res.code === 0) {
      setToken(res.data.token)
      uni.switchTab({ url: '/pages/myPage/myPage' })
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
    uni.showToast({ title: '授权失败', icon: 'none' })
  } finally {
    isLoading.value = false
  }
}

const closeAuthPopup = () => {
  // 用户拒绝授权
  isLoading.value = false
  uni.showToast({ title: '已取消授权', icon: 'none' })
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