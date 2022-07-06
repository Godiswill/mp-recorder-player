// pages/login/login.js
import { reqSmsCode, verifySmsCode } from '../../api/index';
import { StorageMap } from '../../consts/index';
import { showErrMsg } from '../../utils/util';

const ClockTiem = 60;
let timer: number;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clock: 0,
    mobile: '',
    verifyCode: '',
  },

  sbWeixin() {
    // 空，去双向绑定的警告
  },

  showClock() {
    this.setData({
      clock: ClockTiem,
    });
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      const clock = this.data.clock - 1;
      console.log(clock);
      this.setData({
        clock,
      });
      if (!clock) {
        clearInterval(timer);
      }
    }, 1000);
  },

  testMobile(mobile: string) {
    const res = /^1\d{10}/.test(mobile);
    if (!res) showErrMsg('请输入正确的手机号');
    return res;
  },

  getSMSCode() {
    const { mobile } = this.data;

    if (this.testMobile(mobile)) {
      reqSmsCode({
        mobile,
      }, true).then(() => {
        this.showClock();
      });
    }
  },

  login() {
    const { mobile, verifyCode } = this.data;

    if (!this.testMobile(mobile)) {
      return;
    }

    if (!verifyCode) {
      showErrMsg('请输入手机验证码');
      return;
    }

    verifySmsCode({
      mobile,
      verifyCode
    }, true).then((data) => {
      wx.setStorageSync(StorageMap.UserInfo, data);
      wx.switchTab({
        url: '/pages/index/index'
      });
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.hideHomeButton();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if (timer) {
      clearInterval(timer);
    }
  },

})