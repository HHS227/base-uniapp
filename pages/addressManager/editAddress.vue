<template>
	<view class="container">
		<uni-forms ref="form" :model="formData" label-width="186rpx" border>
			<uni-forms-item label="联系人" name="name" required>
				<uni-easyinput :inputBorder="false" v-model="formData.name" placeholder="请输入联系人姓名" />
			</uni-forms-item>
			<uni-forms-item label="手机号码" name="phone" required>
				<uni-easyinput :inputBorder="false" v-model="formData.phone" placeholder="请输入手机号码" type="number" />
			</uni-forms-item>
			<uni-forms-item label="所在城市" name="region" required>
				<picker mode="region" @change="selectCity" class="picker-content">
					<view class="picker-view" :class="{ 'has-value': formData.region.length > 0 }">
						{{ formData.region.length > 0 ? formData.region.join(' ') : '请选择省、市、区' }}
						<image src="/static/images/myPapeImages/Vector@2x (2).png" class="picker-icon" mode=""></image>
					</view>
				</picker>
			</uni-forms-item>
			<uni-forms-item label="详细地址" name="address" required>
				<uni-easyinput :inputBorder="false" v-model="formData.address" placeholder="请输入详细地址" type="textarea" autoHeight />
			</uni-forms-item>
		</uni-forms>
		<view class="line">
			
		</view>
	</view>
	<view class="bottom-btn">
		<view class="btn-content">
			<button class="add-btn" @click="submitForm">保存</button>
		</view>
		<view class="safe-view"></view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const form = ref(null);
const formData = ref({
	name: '',
	phone: '',
	region: [],
	address: ''
});

const selectCity = (e) => {
	formData.value.region = e.detail.value;
};

const submitForm = () => {
	form.value
		.validate()
		.then((res) => {
			console.log('表单数据:', formData.value);
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			});
		})
		.catch((err) => {
			console.log('表单验证失败:', err);
		});
};
</script>

<style lang="scss" scoped>
	.line{
		height: 2rpx;
		background: #eee;
	}
::v-deep .uni-forms-item__label .is-required {
	display: none;
}

::v-deep .uni-forms-item__label {
	font-size: 30rpx;
	color: #101010;
}
::v-deep .uni-easyinput__content-input {
	padding: 0 !important;
}
.container {
	padding: 30rpx;
}

.picker-content {
	height: 100%;
	.picker-view {
		height: 72rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		&.has-value {
			color: #000;
		}
		&:not(.has-value) {
			color: #999;
		}
		.picker-icon {
			width: 14rpx;
			height: 24rpx;
		}
	}
}
.bottom-btn {
	background-color: #fff;
	width: 100%;
	position: absolute;
	bottom: 0;
	.btn-content {
		height: 132rpx;
		display: flex;
		align-items: center;
		.add-btn {
			font-weight: 500;
			font-size: 32rpx;
			color: #ffffff;
			line-height: 94rpx;
			width: 660rpx;
			height: 94rpx;
			background: #ff6f0e;
			border-radius: 60rpx;
		}
	}
}
</style>