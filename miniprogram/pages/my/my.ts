import { StorageMap } from '../../consts/index';

Page({

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '是否要退出登录',
      success (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../login/login',
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      userInfo: wx.getStorageSync(StorageMap.UserInfo) || { name: '美好一天', phone: '****' },
    });
  },
})