
import { useTokenStorage } from './storage'
const { getRefreshToken, setToken, getAccessToken } = useTokenStorage()
// const BASE_URL = 'http://192.168.1.132:48080' 
const BASE_URL="https://www.cdsrh.top"
// const BASE_URL="https://www.gemitribe.com"
let isRefreshing = false
let refreshSubscribers = []

const refreshTokenRequest = async () => {
  if (isRefreshing) {
    return new Promise(resolve => {
      refreshSubscribers.push(resolve)
    })
  }
  
  isRefreshing = true
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return false
    
    const res = await request({
      url: `/app-api/auth/front/wechat/refresh-token?refreshToken=${refreshToken}`,
      method: 'POST',
      showLoading: false
    })
    
    if (res.code === 0) {
    
      setToken({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken
      })
      // 通知所有等待的请求，并传递新token
      const newToken = getAccessToken()
      refreshSubscribers.forEach(cb => cb(newToken))
      refreshSubscribers = []
      return true
    }
    return false
  } catch (err) {
    console.error('刷新token失败:', err)
    return false
  } finally {
    isRefreshing = false
  }
}

export const request = (options) => {
  let loadingShown = false
  if (options.showLoading !== false) {
    uni.showLoading({
      title: options.loadingText || '加载中...',
      mask: true
    })
    loadingShown = true
  }

  return new Promise((resolve, reject) => {
    const makeRequest = async (retry = true) => {
     
      uni.request({
        url: BASE_URL + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          ...(getAccessToken() ? { 'Authorization': `Bearer ${getAccessToken()}` } : {}),
          ...options.header // 保留自定义header
        },
        success: async (res) => {
          if (loadingShown) uni.hideLoading()
          
          if (res.statusCode === 200) {
            if (res.data.code === 0) {
              resolve(res.data)
            } else if (res.data.code === 401 && retry) {
              if (isRefreshing) {
                // 等待刷新完成并获取新token
                const newToken = await new Promise(resolve => {
                  refreshSubscribers.push(resolve)
                })
                // 使用新token重新构造header
                const newHeaders = {
                  ...(newToken ? { 'Authorization': `Bearer ${newToken}` } : {}),
                  ...options.header
                }
                // 重新发送请求
                uni.request({
                  ...options,
                  url: BASE_URL + options.url,
                  header: newHeaders,
                  success: (res) => {
                    if (res.statusCode === 200 && res.data.code === 0) {
                      resolve(res.data)
                    } else {
                      reject(res.data)
                    }
                  },
                  fail: reject
                })
              } else {
                const refreshed = await refreshTokenRequest()
                if (refreshed) {
                  makeRequest(false)
                } else {
                  reject(res.data)
                }
              }
            } else {
              uni.showToast({
                title: res.data.msg || '请求失败',
                icon: 'none'
              })
              reject(res.data)
            }
          } else {
            reject(res)
          }
        },
        fail: (err) => {
          if (loadingShown) uni.hideLoading()
          uni.showToast({
            title: '网络连接失败',
            icon: 'none'
          })
          reject(err)
        },
        complete: () => {
          // 保险措施：确保无论如何都会隐藏loading
          if (loadingShown) uni.hideLoading()
        }
      })
    }
    
    makeRequest()
  })
}