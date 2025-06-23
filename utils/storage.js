import { ref } from 'vue'
export const useTokenStorage = () => {
  const token = ref(null)
  

const setToken = (tokenData) => {
    uni.setStorageSync('token', tokenData)
    token.value = tokenData
}

const setUserData = (userData) => {
    uni.setStorageSync('user', userData)

}
  const getToken = () => {
    const tokenData = uni.getStorageSync('token')
    return tokenData || null
  }
  const getUserData = () => {
    const userData = uni.getStorageSync('user')
    return userData || null
  }
  
  const clearToken = () => {
    uni.removeStorageSync('token')
    token.value = null
  }
  const clearUser = () => {
    uni.removeStorageSync('user')
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
    const uersData = getUserData()
    return uersData?.openId || null
   }
   //获取userId
   const getUserId = () => {
    const uersData = getUserData()
    return uersData?.userId || null
   }
   
  
  
  return {
    token,
    getToken,
    setToken,
    setUserData,
    clearUser,
    clearToken,
    getAccessToken,
    getRefreshToken,
    getOpenId,
    getUserId
  }
}