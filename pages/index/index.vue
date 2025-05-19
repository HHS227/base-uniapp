<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
		<NoticeVue :notices="['通知1', '通知2', '通知3']" />
		<button open-type="getPhoneNumber" @getphonenumber="getPhone" :ref="btnRef" class="login-btn">点击登录</button>
		<avatarStack :avatars="avatarList" :size="40" :overlap="20"></avatarStack>
	</view>
</template>

<script lang="ts" setup>

import { ref } from 'vue';
import NoticeVue from '../../components/Notice.vue';
import avatarStack from '../../components/AvatarStack.vue'
const title = ref('测试');
const wxLoginData = ref({
	code: '',
	iv: '',
	encryptedData: ''
});
const btnRef = ref();
const getPhone = async (e) => {
	console.log(e);
	if (e.detail.errMsg == 'getPhoneNumber:ok') {
		wxLoginData.value.iv = e.detail.iv;
		wxLoginData.value.encryptedData = e.detail.encryptedData;
		console.log(wxLoginData.value);
	} else {
		uni.showToast({
			title: '未授权',
			icon: 'none'
		});
	}
};
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
