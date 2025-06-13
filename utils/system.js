let SYSTEM_INFO = uni.getWindowInfo();
//状态栏高度
export const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 15;
//标题栏/胶囊按钮高度
export const getTitleBarHeight = () => {
	if (uni.getMenuButtonBoundingClientRect) {
		let { top , height } = uni.getMenuButtonBoundingClientRect()
		return (top - getStatusBarHeight()) * 2 + height
	}
	else{
		return 50
	}
}
//导航栏高度（状态栏+标题栏)
export const getNarBarHeight = ()=> getStatusBarHeight()+getTitleBarHeight()

//获取分享者id
export const initShareUserId=()=> {
    const launchOptions = uni.getLaunchOptionsSync()
    if (launchOptions.query.shareUserId) {
      const shareUserId = launchOptions.query.shareUserId
      uni.setStorageSync('shareUserId', shareUserId)
      return shareUserId
    }
    return uni.getStorageSync('shareUserId') || ''
  }

  // 获取分享者ID
  export const getShareUserId=()=> {
    return uni.getStorageSync('shareUserId') || ''
  }

  // 清除分享者ID（可选，用于特定场景）
  export const clearShareUserId=()=>  {
    uni.removeStorageSync('shareUserId')
  }
  // 时间戳转换
  export const formatDateTime = (dateString) => {
	if (!dateString) return ''
	const date = new Date(dateString)
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
  }
  