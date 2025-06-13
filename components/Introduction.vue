<template>
		<view class="view_box">
			<view :style="transitionStyle">
				<template v-for="(item,index) in list" :key="index">
					<view class="notice-content">{{ item }}</view>
				</template>
			</view>
		</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import { ref, watch } from 'vue';
const props = defineProps({
	items: {
		type: Array,
		default: () => []
	}
});

let transitionStyle = ref('');
const list = ref([]);

onShow(() => {
	list.value = [...props.items,...props.items];
	init();
})
const init = () => {
	/**
	 * 实现无限滚动动画效果
	 * 原理：
	 * 1. 初始延迟30ms后应用transition样式，使内容向上平移50%（显示下半部分内容）
	 * 2. 设置8秒的定时器，在每次动画完成后：
	 *    a. 先清除transition样式（立即重置位置）
	 *    b. 30ms延迟后重新应用transition样式（避免浏览器优化导致的动画不执行）
	 * 3. 通过transition的8秒持续时间控制滚动速度
	 * 
	 * 注意事项：
	 * - 30ms延迟确保浏览器能正确处理样式变化
	 * - 列表数据是双份拼接(list = [...items,...items])，实现无缝循环
	 * - transform: translateY(-50%)将内容上移一半高度，显示下半部分
	 */
	setTimeout(() => {
		transitionStyle.value = 'transition: all 8s linear 0s;transform: translateY(-50%);';
		setInterval(() => {
			transitionStyle.value = ''; // 清除样式以重置位置
			setTimeout(() => {
				transitionStyle.value = 'transition: all 8s linear 0s;transform: translateY(-50%);'; // 重新应用样式触发动画
			}, 30);
		}, 8000); // 8秒后重复动画（与transition持续时间一致）
	}, 30); // 初始延迟30ms确保DOM渲染完成
};

</script>

<style lang="scss">
.view_box {
	height: 100%;
	width: 100%;
	overflow: hidden;
}

.notice-content {
	display: flex;
	align-items: center;
	justify-content: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
	height: 60rpx;
	color: #fff;
}
</style>
