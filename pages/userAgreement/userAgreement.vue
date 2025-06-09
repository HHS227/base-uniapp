<template>
    <view>
        <TransNavVue title="用户协议" />
        <view class="container">
            用户服务协议
            尊敬的用户，欢迎您使用“中国电信网上营业厅”网站（网址：www.189.cn，简称“本网站”）。

            本网站由中国电信股份有限公司全渠道运营中心（简称“中国电信”或“我们”）所有和运营。在登录、使用本网站之前，您应当仔细阅读、充分理解《用户服务协议》（简称“本协议”）的全部内容，特别是本协议中以加粗字体显示的内容，您应当重点阅读。如果您不同意本协议或其中任何条款，请您立即停止登录或使用本网站；您开始登录或使用本网站，即表明您已同意本协议内容，本协议即构成对用户和中国电信（合称“双方”）有约束力的法律文件。

            第一条 定义

            1.1 本网站：是指由中国电信股份有限公司全渠道运营中心所有并负责运营的“电信网上营业厅”网站（网址：www.189.cn）。

            1.2
            所有权以及相关的权利：在本协议中是指：第一，所有权；第二，知识产权，包括但不限于著作权、专利权、商标权、商业秘密等；第三，除上述权利之外的对物、信息及其载体和表现形式的使用、利用、传播、复制、发行、编辑、修改、处分等权利。

            1.3 用户：是指接受本网站服务的自然人、法人或其他组织。

            1.4 个人信息：在本协议中，是指以电子或者其他方式记录的与已识别或者可识别的自然人有关的各种信息，不包括匿名化处理后的信息。

            1.5 企业信息：在本协议中，是指以电子或者其他方式记录的与已识别或者可识别的企业组织有关的各种信息，不包括匿名化处理后的信息

            1.5 网络服务：是指本网站基于互联网方式向用户提供的业务宣传、业务查询、业务办理、交费充值、商品交易、用户关怀、营销活动等服务。

            1.6 基础电信服务：是指中国电信向用户提供的公共网络基础设施、公共数据传送、基本话音通信服务等服务，包括但不限于移动通信服务、宽带服务等。

            1.7 平台内经营者：是指除中国电信以外的、通过本网站销售商品或者提供服务的第三方经营者。


        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { request } from '@/utils/request'
import TransNavVue from '../../components/TransNav.vue'
const smartBeeList = ref([])


onMounted(() => {
   


})
//获取智能养蜂内容

const getSmartBeeList = async () => {
    try {
        const res = await request({
            url: '/app-api/weixin/bee-keeping/get/list',
            showLoading: true,
        })

        if (res.code === 0 || res.code === 200) {
            smartBeeList.value = res.data || [] // 确保数据为数组
        } else {
            throw new Error(res.msg || '数据异常')
        }
    } catch (err) {
        console.error('获取智能养蜂内容:', err)
        uni.showToast({
            title: '获取内容失败',
            icon: 'error'
        })
    }
}
const showDialog = ref(false)
const currentContent = ref('')

</script>

<style lang="scss" scoped>
.container {
    padding: 20rpx;

    .content {
        height: calc(100vh - 40rpx);

        .question-item {
            margin-bottom: 40rpx;
            padding: 20rpx;
            background: #fff;
            border-radius: 16rpx;

            .question-title {
                display: block;
                font-size: 32rpx;
                font-weight: bold;
                color: #000;
                margin-bottom: 20rpx;
            }

            .question-content {
                display: block;
                font-size: 28rpx;
                color: #999; // 灰色字体
                line-height: 1.6;
                margin-bottom: 20rpx;
            }

            .divider {
                height: 1rpx;
                background: #eee;
            }
        }
    }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;


    .empty-text {
        font-size: 28rpx;
        color: #999;
    }
}

.question-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
}

.popup-content {
    background: #fff;
    padding: 40rpx;
    border-radius: 16rpx;
    max-width: 80vw;
    max-height: 70vh;

    .detail-scroll {
        max-height: 60vh;

        .detail-text {
            font-size: 28rpx;
            line-height: 1.6;
            color: #333;
        }
    }

    .close-btn {
        margin-top: 30rpx;
        background: #f0f0f0;
        color: #666;
        font-size: 28rpx;
        padding: 10rpx 30rpx;
        border-radius: 8rpx;
        float: right;
    }
}
</style>