// /utils/request.js

const BASE_URL = 'http://192.168.2.49' // 李聪

/**
 * 通用请求方法
 * @param {Object} options 请求配置
 * @param {String} options.url 接口路径（必填）
 * @param {String} options.method 请求方法（默认GET）
 * @param {Object} options.data 请求参数
 * @param {Object} options.header 请求头
 */
export const request = (options) => {
  // 显示加载中（可根据需要调整）
  uni.showLoading({
    title: '加载中...',
    mask: true
  })

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        // 'Authorization': uni.getStorageSync('token') || '', // 自动携带token
        ...options.header // 自定义header会覆盖默认
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 这里可以添加统一的业务状态码判断
          if (res.data.code === 200) {
            resolve(res.data)
          } else {
            // 业务错误提示
            uni.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            })
            reject(res.data)
          }
        } else {
          // HTTP状态码错误处理
          handleHttpError(res.statusCode)
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        reject(err)
      },
      complete: () => {
        uni.hideLoading()
      }
    })
  })
}

/**
 * 处理HTTP错误状态码
 */
const handleHttpError = (statusCode) => {
  const errorMap = {
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求资源不存在',
    500: '服务器错误'
  }
  uni.showToast({
    title: errorMap[statusCode] || `请求错误（${statusCode}）`,
    icon: 'none'
  })
}

/**
 * GET请求快捷方法
 */
export const get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

/**
 * POST请求快捷方法
 */
export const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}