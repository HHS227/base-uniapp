import { useTokenStorage } from './storage'
const { getRefreshToken, setToken, getAccessToken ,getOpenId} = useTokenStorage()
const BASE_URL = 'http://192.168.1.132:48080' 
// const BASE_URL="https://www.cdsrh.top"
// const BASE_URL="https://www.gemitribe.com"
let isRefreshing = false
let refreshSubscribers = []
// 刷新token
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
        refreshToken: res.data.refreshToken,
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
// 网络请求
export const request = (options) => {
  let loadingShown = false;
  let isRetry = false; // 标记是否为重试请求
  
  // 显示loading的函数封装
  const showLoading = () => {
    if (options.showLoading !== false && !loadingShown && !isRetry) {
      uni.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      });
      loadingShown = true;
    }
  };
  
  // 隐藏loading的函数封装
  const hideLoading = () => {
    if (loadingShown) {
      loadingShown = false;
      uni.hideLoading();
    }
  };

  return new Promise((resolve, reject) => {
    const makeRequest = async (retry = true) => {
      isRetry = retry;
      showLoading(); 
      
      uni.request({
        url: BASE_URL + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          ...(getAccessToken() ? { 'Authorization': `Bearer ${getAccessToken()}` } : {}),
          ...options.header 
        },
        success: async (res) => {
          try {
            if (res.statusCode === 200) {
              if (res.data.code === 0) {
                resolve(res.data);
              } else if (res.data.code === 401 && retry) {
                hideLoading(); 
                
                if (isRefreshing) {
                  
                  const newToken = await new Promise(resolveToken => {
                    refreshSubscribers.push(resolveToken);
                  });
                  
                  request({
                    ...options,
                    header: {
                      ...(newToken ? { 'Authorization': `Bearer ${newToken}` } : {}),
                      ...options.header
                    },
                    showLoading: false 
                  }).then(resolve).catch(reject);
                } else {
                  const refreshed = await refreshTokenRequest();
                  if (refreshed) {
                    makeRequest(false); 
                  } else {
                    reject(res.data);
                  }
                }
              } else {
                uni.showToast({
                  title: res.data.msg || '请求失败',
                  icon: 'none'
                });
                reject(res.data);
              }
            } else {
              reject(res);
            }
          } finally {
            hideLoading(); 
          }
        },
        fail: (err) => {
          try {
            uni.showToast({
              title: '网络连接失败',
              icon: 'none'
            });
            reject(err);
          } finally {
            hideLoading(); 
          }
        },
      
      });
    };
    
    makeRequest();
  });
};

// 支付统一流程
export const processPayment = async (options) => {
  const {  orderId, successToUrl } = options
  if (!orderId) {
    throw new Error('订单ID不能为空')
  }
  try {
    // 提交支付请求
    const paylist = await request({
      url: '/app-api/pay/order/submit',
      data: {
        id: orderId,
        channelCode:'wx_lite',
        channelExtras: {
          openid: getOpenId()
        }
      },
      method: 'post',
      showLoading: true,
    })
    
    if (paylist.code !== 0) {
      throw new Error(paylist.msg || '支付请求失败')
    }
    
    // 解析支付参数
    const payParams = JSON.parse(paylist.data.displayContent)
    
    // 调用微信支付API
    return await uni.requestPayment({
      provider: 'wxpay',
      timeStamp: String(payParams.timeStamp),
      nonceStr: String(payParams.nonceStr),
      package: payParams.packageValue || payParams.package,
      signType: payParams.signType || 'MD5',
      paySign: String(payParams.paySign),
      
      success: async () => {
        uni.showToast({
          title: '支付成功',
          icon: 'success'
        });
        if(successToUrl){
          setTimeout(() => {
            uni.navigateTo({
              url: successToUrl
            });
          }, 1500);
        }  
      
      },
      
      fail: async (err) => {
        if (err.errMsg.includes('cancel')) {
          uni.showToast({
            title: '支付已取消',
            icon: 'none'
          });
          return;
        }
        
      
      }
    });
  } catch (err) {
    uni.showToast({
      title: err.message || '支付处理失败',
      icon: 'none'
    })
    throw err
  }
}

//统一上传图片方法

export const uploadImage=(count)=> {

  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count,
      success: async (res) => {
        if (!res || !res.tempFilePaths || res.tempFilePaths.length === 0) {
          uni.showToast({
            title: '未选择图片',
            icon: 'none'
          });
          reject(new Error('未选择图片'));
          return;
        }
        const tempFilePath = res.tempFilePaths[0];
        
        uni.showLoading({
          title: '上传中...'
        });

        try {
          // 上传图片
          const uploadRes = await new Promise((resolveUpload, rejectUpload) => {
            uni.uploadFile({
              url: BASE_URL + '/app-api/infra/file/upload',
              filePath: tempFilePath,
              name : 'file',
           
              success: (response) => {
                try {
                  const data = JSON.parse(response.data);
                  resolveUpload(data);
                } catch (err) {
                  rejectUpload(new Error('解析响应失败'));
                }
              },
              fail: (err) => {
                rejectUpload(err);
              }
            });
          });

          if (uploadRes.code === 0) {
            const result = { tempFilePath, data: uploadRes.data } 
            uni.showToast({
              title: '上传成功',
              icon: 'success'
            });
            resolve(result);
          } else {
            throw new Error(uploadRes.msg || '图片上传失败');
          }
        } catch (err) {
          uni.showToast({
            title: '上传失败',
            icon: 'none'
          });
          console.error('图片上传失败:', err);
          reject(err);
        } 
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        uni.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}
export const uploadVideo=()=> {

  return new Promise((resolve, reject) => {
    uni.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: async (res) => {
        if (!res || !res.tempFilePath ) {
          uni.showToast({
            title: '未选择视频',
            icon: 'none'
          });
          reject(new Error('未选择视频'));
          return;
        }
        const tempFilePath = res.tempFilePath;
        
        uni.showLoading({
          title: '上传中...'
        });

        try {
          // 上传文件
          const uploadRes = await new Promise((resolveUpload, rejectUpload) => {
            uni.uploadFile({
              url: BASE_URL + '/app-api/infra/file/upload',
              filePath: tempFilePath,
              name : 'file',
           
              success: (response) => {
                try {
                  const data = JSON.parse(response.data);
                  resolveUpload(data);
                } catch (err) {
                  rejectUpload(new Error('解析响应失败'));
                }
              },
              fail: (err) => {
                rejectUpload(err);
              }
            });
          });

          if (uploadRes.code === 0) {
            const result = { tempFilePath, data: uploadRes.data } 
            uni.showToast({
              title: '上传成功',
              icon: 'success'
            });
            resolve(result);
          } else {
            throw new Error(uploadRes.msg || '视频上传失败');
          }
        } catch (err) {
          uni.showToast({
            title: '上传失败',
            icon: 'none'
          });
          console.error('视频上传失败:', err);
          reject(err);
        } 
      },
      fail: (err) => {
        console.error('选择视频失败:', err);
        uni.showToast({
          title: '选择视频失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}



 




