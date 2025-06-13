<template>
	<uni-popup ref="popup" type="center" :animation="true" @close="$emit('update:show', false)">
		<view class="hive-popup">
			<view class="hive-grid">
				<view v-for="(hive, index) in hives" :key="index" class="hive-card" :class="{ selected: selectedIndex === index }" @click="selectHive(index)">
					<checkbox class="hive-checkbox" :checked="selectedIndex === index" @click.stop />
					<image :src="hive.image" class="hive-image" />
					<text class="hive-name">{{ hive.name }}</text>
					<text class="bee-name">{{ hive.beeName }}</text>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
});

const hives = ref([
	{
		image: '/static/images/apiculture.png',
		name: '标准蜂箱',
		beeName: '意大利蜜蜂'
	},
	{
		image: '/static/images/apiculture.png',
		name: '高级蜂箱',
		beeName: '卡尼鄂拉蜂'
	},
	{
		image: '/static/images/apiculture.png',
		name: '豪华蜂箱',
		beeName: '高加索蜂'
	},
	{
		image: '/static/images/apiculture.png',
		name: '定制蜂箱',
		beeName: '中华蜜蜂'
	}
]);

const selectedIndex = ref(-1);
const popup = ref();

const selectHive = (index) => {
	selectedIndex.value = index;
};

watch(
	() => props.show,
	(newVal) => {
		if (newVal) {
			popup.value.open();
		} else {
			popup.value.close();
		}
	}
);

defineExpose({
	open: () => popup.value.open(),
	close: () => popup.value.close()
});
</script>

<style lang="scss" scoped>
.hive-popup {
	position: relative;
	z-index: 1000;
	padding: 20px;
}

.hive-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
}

.hive-card {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 15px;
	border-radius: 10px;
	background-color: #fff;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	transition: all 0.3s;
	border: 2px solid rgba(0, 0, 0, 0);

	&.selected {
		border: 2px solid #4caf50;
	}
}

.hive-checkbox {
	position: absolute;
	top: 10px;
	left: 10px;
}

.hive-image {
	width: 80px;
	height: 80px;
	margin: 10px 0;
}

.hive-name,
.bee-name {
	text-align: center;
	margin: 5px 0;
}

.hive-name {
	font-weight: bold;
	font-size: 16px;
}

.bee-name {
	color: #666;
	font-size: 14px;
}
</style>
