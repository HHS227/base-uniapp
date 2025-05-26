import { ref } from 'vue'

export const useTokenStorage = () => {
  const token = ref(null)
  
  const getToken = () => {
    return uni.getStorageSync('token') || null
  }
  
  const setToken = (newToken) => {
    uni.setStorageSync('token', newToken)
    token.value = newToken
  }
  
  const clearToken = () => {
    uni.removeStorageSync('token')
    token.value = null
  }
  
  return {
    token,
    getToken,
    setToken,
    clearToken
  }
}