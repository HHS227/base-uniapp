import { ref } from 'vue'
export const useTokenStorage = () => {
  const token = ref(null)
  

const setToken = (tokenData) => {
    uni.setStorageSync('token', tokenData)
    token.value = tokenData
}
  const getToken = () => {
    const tokenData = uni.getStorageSync('token')
    return tokenData || null
  }
  
 
  
  const clearToken = () => {
    uni.removeStorageSync('token')
    token.value = null
  }
  
  // 获取的token
  const getAccessToken = () => {
    const tokenData = getToken()
    return tokenData?.accessToken || null
  }
  //获取刷新的token
  const getRefreshToken = () => {
    const tokenData = getToken()
    return tokenData?.refreshToken || null
  }
   //获取openid
   const getOpenId = () => {
    const tokenData = getToken()
    return tokenData?.openId || null
   }
  
  
  return {
    token,
    getToken,
    setToken,
    clearToken,
    getAccessToken,
    getRefreshToken,
    getOpenId
  }
}