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