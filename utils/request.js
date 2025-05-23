// /utils/request.js
const BASE_URL = 'http://192.168.1.132:48080'

export const request = (options) => {
  // 显示加载中
  let loadingShown = false
  if (options.showLoading !== false) { // 允许通过配置关闭loading
    uni.showLoading({
      title: options.loadingText || '加载中...',
      mask: true
    })
    loadingShown = true
  }

  // 添加请求拦截器
  const request = (options) => {
    // 从本地存储获取token
    const token = uni.getStorageSync('token')
    
    // 设置默认请求头
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
    
    // 合并自定义headers
    options.header = {
      ...defaultHeaders,
      ...options.header
    }
    
    return new Promise((resolve, reject) => {
      uni.request({
        ...options,
        success: (res) => {
          // 处理响应逻辑
          if (res.statusCode === 401) {
            // token过期处理
            uni.navigateTo({ url: '/pages/login/login' })
          }
          resolve(res.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
  
  if (loadingShown) uni.hideLoading()
  
  if (res.statusCode === 200) {
    // 修改这里：兼容code=0的情况
    if (res.data.code === 200 || res.data.code === 0) {
      resolve(res.data)
    } else {
      uni.showToast({
        title: res.data.msg || '请求失败',
        icon: 'none'
      })
      reject(res.data)
    }
  } else {
    handleHttpError(res.statusCode)
    reject(res)
  }
}

