// 自动根据版本切换接口请求地址
const { miniProgram: { envVersion } } = wx.getAccountInfoSync();
const ysTestHost = 'https://test.com';
const ysProdHost = 'https://prod.com';

console.log('envVersion: ', envVersion);

const getConfig = () => {
  switch (envVersion) {
    case 'develop':// 开发版
      return {
        env: envVersion,
        origin: ysProdHost,
      }
    case 'trial':// 体验版
      return {
        env: envVersion,
        origin: ysTestHost,
      }
    case 'release': // 正式版
      return {
        env: envVersion,
        origin: ysProdHost,
      }
  }
}

export const envConfig = getConfig();