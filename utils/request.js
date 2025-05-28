import { useTokenStorage } from './storage'
const { getRefreshToken, setToken, getAccessToken } = useTokenStorage()

const BASE_URL = 'http://192.168.1.132:48080'

// Token 刷新状态管理
let isRefreshing = false
let refreshSubscribers = []

/**
 * 刷新 token 请求
 * @returns {Promise<string|null>} 返回新的 accessToken 或 null
 */
const refreshTokenRequest = async () => {
  // 如果已经在刷新，返回一个 Promise 并加入队列
  if (isRefreshing) {
    return new Promise(resolve => {
      refreshSubscribers.push(resolve)
    })
  }
  
  isRefreshing = true
  console.log('开始刷新 token...')
  
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      console.warn('没有可用的 refreshToken')
      return null
    }
    
    const res = await uni.request({
      url: BASE_URL + `/app-api/auth/front/wechat/refresh-token?refreshToken=${refreshToken}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      }
    })
    
    // 注意: uni.request 返回的是数组 [error, response]
    const [error, response] = res
    
    if (error || !response || response.statusCode !== 200) {
      console.error('刷新 token 请求失败:', error || response)
      return null
    }
    
    if (response.data.code === 0) {
      const newTokens = {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken
      }
      
      setToken(newTokens)
      const newAccessToken = getAccessToken()
      console.log('刷新 token 成功:', newAccessToken)
      
      // 通知所有等待的请求
      refreshSubscribers.forEach(cb => cb(newAccessToken))
      refreshSubscribers = []
      
      return newAccessToken
    } else {
      console.error('刷新 token 返回错误:', response.data)
      return null
    }
  } catch (err) {
    console.error('刷新 token 异常:', err)
    return null
  } finally {
    isRefreshing = false
  }
}

/**
 * 封装的请求方法
 * @param {Object} options 请求配置
 * @param {string} options.url 请求路径
 * @param {string} [options.method='GET'] 请求方法
 * @param {Object} [options.data] 请求数据
 * @param {Object} [options.header] 额外请求头
 * @param {boolean} [options.showLoading=true] 是否显示加载中
 * @param {string} [options.loadingText='加载中...'] 加载文字
 * @returns {Promise<any>}
 */
export const request = async (options) => {
  let loadingShown = false
  
  try {
    // 显示加载中
    if (options.showLoading !== false) {
      uni.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
      loadingShown = true
    }
    
    // 内部请求方法
    const makeRequest = async (token) => {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.header
      }
      
      console.log(`发起请求: ${options.method || 'GET'} ${options.url}`, {
        token,
        data: options.data
      })
      
      const [error, response] = await uni.request({
        url: BASE_URL + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: headers
      })
      
      if (error) {
        console.error('请求失败:', error)
        throw error
      }
      
      console.log('请求响应:', response)
      
      if (response.statusCode === 401) {
        // 需要刷新 token
        throw { code: 401, message: 'Token 已过期' }
      }
      
      if (response.statusCode !== 200) {
        throw response.data || { code: response.statusCode, message: '请求失败' }
      }
      
      return response.data
    }
    
    // 第一次尝试请求
    let currentToken = getAccessToken()
    try {
      return await makeRequest(currentToken)
    } catch (error) {
      // 如果是 401 错误且当前有 token，尝试刷新 token
      if (error.code === 401 && currentToken) {
        console.log('检测到 token 过期，尝试刷新...')
        
        const newToken = await refreshTokenRequest()
        if (newToken) {
          // 用新 token 重试请求
          return await makeRequest(newToken)
        } else {
          // 刷新 token 失败，跳转到登录页
          console.error('刷新 token 失败，需要重新登录')
          uni.navigateTo({ url: '/pages/login/index' })
          throw { code: 401, message: '请重新登录' }
        }
      }
      
      // 其他错误直接抛出
      throw error
    }
  } catch (error) {
    // 统一错误处理
    if (error.code !== 401) {
      uni.showToast({
        title: error.message || '请求失败',
        icon: 'none'
      })
    }
    throw error
  } finally {
    if (loadingShown) {
      uni.hideLoading()
    }
  }
}

// 导出一个简单的 GET 请求快捷方式
export const get = (url, params = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data: params,
    ...options
  })
}

// 导出一个简单的 POST 请求快捷方式
export const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}