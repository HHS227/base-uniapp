<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
		<avatarStack :avatars="avatarList" :size="40" :overlap="20"></avatarStack>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import avatarStack from '../../components/AvatarStack.vue'
const title = ref('测试');
const avatarList = ref(['/static/images/蜂箱logo.png','/static/images/蜂箱logo.png'])
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
