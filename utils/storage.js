export const useTokenStorage = () => {
  const token = ref(null)
  
  // 初始化时从 storage 读取
  token.value = uni.getStorageSync('token') || null
  
  const getToken = () => {
    return token.value // 直接返回 ref 的值，而不是 storage
  }
  
  const setToken = (tokenData) => {
    uni.setStorageSync('token', tokenData) // 仍然写入 storage
    token.value = tokenData // 更新 ref
  }
  
  const clearToken = () => {
    uni.removeStorageSync('token')
    token.value = null
  }
  
  const getAccessToken = () => {
    return token.value?.accessToken || null // 直接读取 ref
  }
  
  const getRefreshToken = () => {
    return token.value?.refreshToken || null // 直接读取 ref
  }
  
  return {
    token,
    getToken,
    setToken,
    clearToken,
    getAccessToken,
    getRefreshToken
  }
}