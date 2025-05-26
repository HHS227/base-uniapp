// /utils/request.js
// const BASE_URL = 'https://www.cdsrh.top'
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

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
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
  })
}

