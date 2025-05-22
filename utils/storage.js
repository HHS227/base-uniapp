import { ref } from 'vue'

const TOKEN_KEY = 'bee_app_token'

export const useTokenStorage = () => {
  const getToken = () => {
    return uni.getStorageSync(TOKEN_KEY) || null
  }

  const setToken = (token) => {
    uni.setStorageSync(TOKEN_KEY, token)
  }

  const removeToken = () => {
    uni.removeStorageSync(TOKEN_KEY)
  }

  const token = ref(getToken())

  return {
    token,
    getToken,
    setToken,
    removeToken
  }
}