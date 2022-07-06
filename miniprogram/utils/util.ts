import { StorageMap } from '../consts/index';
import { getNosToken } from '../api/index';

export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}
const Second = 1000;
const Minute = 60 * Second;
const Hour = 60 * Minute;

export const formatClock = (num: number, noHour?: true) => {
  const hour = Math.floor(num / Hour);
  const minute = Math.floor((num - hour * Hour) / Minute);
  const second = Math.ceil((num - hour * Hour - minute * Minute) / Second);

  return (noHour ? [minute, second] : [hour, minute, second]).map(formatNumber).join(':');
};

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

/*获取当前页url*/
export function getCurrentPageUrl() {
  const pages = getCurrentPages() //获取加载的页面
  const currentPage = pages[pages.length - 1] //获取当前页面的对象
  const url = currentPage.route //当前页面url
  return url
}
/*获取当前页带参数的url*/
export function getCurrentPageUrlWithArgs() {
  const pages = getCurrentPages() //获取加载的页面
  const currentPage = pages[pages.length - 1] //获取当前页面的对象
  const url = currentPage.route //当前页面url
  const options = currentPage.options //如果要获取url中所带的参数可以查看options
  //拼接url的参数
  let urlWithArgs = url + '?'
  for (let key in options) {
    const value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}

export function showErrMsg(title: string = '未知错误') {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2300,
    mask: true,
  });
}

export const cookies = {
  get(key?: string) {
    const cookie = wx.getStorageSync(StorageMap.Cookie);
    if (key) {
      return cookie?.[key];
    }
    return cookie && Object.entries(cookie).map(([key, value]) => `${key}=${value}`).join('; ');
  },
  set(key: string, value?: string) {
    const cookie = wx.getStorageSync(StorageMap.Cookie) || {};
    if (value) {
      cookie[key] = value;
    } else {
      delete cookie[key];
    }
    wx.setStorageSync(StorageMap.Cookie, cookie);
  },
  setRes(cookies: string[]) {
    const cookie = wx.getStorageSync(StorageMap.Cookie) || {};
    cookies?.forEach((it) => {
      // debugger;
      const [target, val] = it.split('; ')[0].split('=');
      if (val) {
        cookie[target] = val;
      } else {
        delete cookie[target];
      }

    });
    wx.setStorageSync(StorageMap.Cookie, cookie);
  }
};

export function uploadFile({ fileName, filePath }: {
  fileName?: string;
  filePath: string;
}) {
  return new Promise<string>((resolve) => {
    wx.showLoading({
      title: '上传中...',
    });
    const name = fileName || filePath;
    getNosToken({ fileName: name }).then((data) => {
      console.log('uploadToken: ', data);
      wx.hideLoading();
      resolve(filePath);
      // wx.uploadFile({
      //   url: 'https://nos.com/',
      //   name: 'file',
      //   filePath,
      //   formData: {
      //     Object: data.objectName,
      //     'x-nos-token': data.token,
      //   },
      //   success(res) {
      //     console.log('上传成功回调', res);
      //     wx.hideLoading();
      //     const url = `https://cdn.com/${data.objectName}`
      //     console.log(url);
      //     resolve(url);
      //   },
      //   fail(err) {
      //     wx.hideLoading();
      //     wx.showToast({
      //       title: err.errMsg,
      //       icon: 'none',
      //     });
      //     reject(err);
      //   },
      // })
    });
  });
}