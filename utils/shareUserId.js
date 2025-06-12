export function initShareUserId() {
    const launchOptions = uni.getLaunchOptionsSync()
    if (launchOptions.query.shareUserId) {
      const shareUserId = launchOptions.query.shareUserId
      uni.setStorageSync('shareUserId', shareUserId)
      return shareUserId
    }
    return uni.getStorageSync('shareUserId') || ''
  }
  
  // 获取分享者ID
  export function getShareUserId() {
    return uni.getStorageSync('shareUserId') || ''
  }
  
  // 清除分享者ID（可选，用于特定场景）
  export function clearShareUserId() {
    uni.removeStorageSync('shareUserId')
  }