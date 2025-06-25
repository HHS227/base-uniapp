
export const useTokenStorage = () => {
const setToken = (tokenData) => {
    uni.setStorageSync('token', tokenData)
   
}

  const getToken = () => {
    const tokenData = uni.getStorageSync('token')
    return tokenData || null
  }
 
  const clearToken = () => {
    uni.removeStorageSync('token')
   
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
   
   
  
  
  return {
    getToken,
    setToken,
    clearToken,
    getAccessToken,
    getRefreshToken,
  
  }
}