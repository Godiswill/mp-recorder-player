import { StorageMap } from '../consts/index'
import { envConfig } from './env';
import { showErrMsg, cookies } from './util';

const errMap: Record<string, string> = {
  403: '没有权限',
  404: 'Not found',
  500: '系统错误',
};

export function _request<T = any>({ url, data, method }: WechatMiniprogram.RequestOption, loding?: boolean) {
  if (loding) {
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    });
  }
  return new Promise<T>((resolve, reject) => {
    const params = data && JSON.parse(JSON.stringify(data));
    const cookie = cookies.get();
    console.log(url, '请求入参：', params);
    console.log(url, `请求 ${StorageMap.Cookie}：`, cookie);
    wx.request<{ code: number; data: T; msg: string; }>({
      url: envConfig.origin + url,
      data: params, // 清理 undefined
      method,
      header: {
        cookie,
      },
      success: (res) => {
        // debugger;
        console.log(url, '请求返回：', res);
        if (loding) {
          wx.hideLoading();
        }

        if (res.statusCode !== 200) {
          const msg = errMap[`${res.statusCode}`] || '网络错误';
          showErrMsg(`${res.statusCode}: ${msg}`);
          reject({
            errno: res.statusCode,
            errMsg: msg,
          });
          return;
        }

        const { code, data, msg = '返回数据格式解析失败' } = res.data || {};
        if (!code || code === 302) {
          wx.redirectTo({
            url: '/pages/login/login',
          });
          return;
        }
        if (code === 200) {
          cookies.setRes(res.cookies);
          resolve(data);
        } else {
          showErrMsg(`${code}: ${msg}`);
          reject({
            errno: code,
            errMsg: msg,
          })
        }
      },
      fail: (err) => {
        if (loding) {
          wx.hideLoading();
        }
        showErrMsg(err.errMsg);
        reject(err);
      },
    })
  });
}

function request<T = any>({ url, data, mockData }: { url: string, data: Record<string, any>; mockData: T }, loding?: boolean) {
  if (loding) {
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    });
  }
  return new Promise<T>((resolve) => {
    const params = data && JSON.parse(JSON.stringify(data));
    console.log(url, '请求入参：', params);
    setTimeout(() => {
      console.log(url, '请求返回：', mockData);
      if (loding) {
        wx.hideLoading();
      }
      resolve(mockData);
    }, 200);
  });
}

export default request;