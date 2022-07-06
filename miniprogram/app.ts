// app.ts
import { envConfig } from './utils/env';

App<IAppOption>({
  globalData: {
    envConfig
  },
  onLaunch() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBarHeight = e.statusBarHeight;
        const capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.CustomRect = capsule;
          this.globalData.CustomBarHeight = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBarHeight = e.statusBarHeight + 50;
        }
      }
    });
    wx.setInnerAudioOption({
      // 即使是在静音模式下，也能播放声音
      obeyMuteSwitch: false,
    });
  },
})