/**
 * 扫描二维码/条形码
 * @param {Object} options - 扫码配置选项
 * @param {boolean} [options.onlyFromCamera=true] - 是否只能从相机扫码
 * @param {string} [options.scanType=['qrCode','barCode']] - 扫码类型
 * @returns {Promise<Object>} 解析后的扫码结果
 */

export const scanCode = async (options = {}) => {
  try {
    // 默认配置
    const defaultOptions = {
      onlyFromCamera: true,
      scanType: ['qrCode', 'barCode'],
      success: null, // 保留回调兼容性，但优先使用Promise
      fail: null
    };
    const scanOptions = { ...defaultOptions, ...options };

    const res = await uni.scanCode(scanOptions);

    // 验证扫码结果
    if (!res || !res.result) {
     uni.showToast('扫码结果为空', 'none');
      return null;
    }
    let parsedResult;
    try {
      parsedResult = JSON.parse(res.result);
    } catch (e) {
      // 如果不是JSON格式，直接返回原始结果
      return {
        rawResult: res.result,
        isJson: false
      };
    }

    // 返回解析后的结果
    return {
      rawResult: res.result,
      parsedResult,
      isJson: true
    };

  } catch (err) {
    uni.showToast(err.errMsg || '扫码失败', 'none');
    throw err; 
  }
};

/**
 * 扫码并跳转到溯源详情页
 * @param {string} path - 目标页面路径
 * @param {string} paramName - 参数名称
 * @returns {Promise<void>}
 */
export const scanAndNavigate = async (path = '/pages/home/home', paramName = 'id') => {
  try {
    const { parsedResult } = await scanCode();
    if (!parsedResult || !parsedResult.code) {
      uni.showToast('未识别到', 'none');
      return;
    }

    uni.navigateTo({
      url: `${path}?${paramName}=${parsedResult.code}`
    });

  } catch (err) {
  }
};