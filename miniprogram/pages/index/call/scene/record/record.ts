import { formatClock, uploadFile, showErrMsg } from '../../../../../utils/util';
import { lastOrNext } from '../../../../../api/index';

const recordOptions = {
  duration: 10 * 60 * 1000,
  sampleRate: 8000,
  numberOfChannels: 1,
  format: 'wav',
};

const msgMap: Record<string, string> = {
  'operateRecorder:fail auth deny': '请右上角设置中授权麦克风',
  // 'operateRecorder:fail is recording or paused': '您操作过快',
  // 'operateRecorder:fail recorder not start': '您操作过快',
};

let timer: number;
let clockCurTime: number;
const recorderManager: WechatMiniprogram.RecorderManager = wx.getRecorderManager();
const innerAudioContext: WechatMiniprogram.InnerAudioContext = wx.createInnerAudioContext();
let gap = 0;
let isError = false;

function disabledClick() {
  const now = Date.now();
  if (now - gap < 800) {
    return true;
  }
  gap = now;
  return false;
}

const initRData = { // 初始录音数据
  isRecording: false,
  clock: '00:00:00',
}

const recordingData = { // 录音中数据
  isRecording: true,
}

const initPlayData = {
  isPlaying: false,
  currentTime: '00:00',
  playPercent: 0,
}

const playingData = {
  isPlaying: true,
}


Page<TRecordQuery, any>({

  /**
   * 页面的初始数据
   */
  data: {
    audioShapingSwitch: true,
    duration: '00:00',
    ...initPlayData,
    ...initRData,
  },

  noEffectStopRecorder() {
    if (this.data.isRecording) {
      isError = true;
      recorderManager.stop();
    }
  },

  switchChange() {
    this.setData({
      audioShapingSwitch: !this.data.audioShapingSwitch,
    });
  },

  async getDetail(type?: TGetDetailType) {
    const { detail, isFirst, isLast } = this.data;
    if (type === 'LAST' && isFirst || type === 'NEXT' && isLast) return;
    const res = await lastOrNext({
      ...this.data.query,
      curId: detail?.recordingId || this.data.query?.recordingId,
      type,
      curNum: detail?.curNum,
    });
    if (!res?.recordingId) return;
    if (innerAudioContext.currentTime) {
      innerAudioContext.stop();
    }
    if (res.url && res.url !== detail?.url) {
      innerAudioContext.src = res.url;
    }
    this.setData({
      ...initPlayData,
      ...initRData,
      isFirst: res.curNum === 1,
      isLast: res.curNum === res.total,
      detail: {
        ...res,
        percent: Math.ceil(100 * res.curNum / res.total || 0),
      },
      duration: formatClock(res.duration * 1000, true),
      bottomText: this.data.query.recordingId ? `${res.curNum}/${res.total}全部` : `${res.total}待录音`,
    });
  },

  bindDeleteRecord() {
    wx.showModal({
      title: '删除',
      content: '确定需要删除？',
      success: async (res) => {
        if (res.confirm) {
          await this.getDetail('CUR');
          this.setData({
            detail: {
              ...this.data.detail,
              url: '',
            },
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: TRecordUrlQuery) {
    console.log('页面查询字符：', query)
    this.setData({
      query,
    });
    wx.setKeepScreenOn({
      keepScreenOn: true,
    });
  },

  async bindLastOrNext(e?: WechatMiniprogram.BaseEvent) {
    const { type } = e?.currentTarget.dataset || {};
    await this.getDetail(type as TGetDetailType);
  },

  startClock(init = true) {
    if (init) {
      clockCurTime = Date.now();
    }
    if (timer) clearInterval(timer); // 防止内存泄漏
    timer = setInterval(() => {
      const now = Date.now();
      const gap = now - clockCurTime;
      this.setData({
        clock: formatClock(gap),
      });
    }, 1000);
  },

  stopClock() {
    clearInterval(timer);
  },

  bindStartPlay() {
    if (disabledClick()) return;
    innerAudioContext.play();
  },

  bindStopPlay() {
    if (disabledClick()) return;
    innerAudioContext.stop();
  },

  bindStartRecord() {
    if (disabledClick()) return;
    recorderManager.start(recordOptions as WechatMiniprogram.RecorderManagerStartOption);
  },

  bindStopRecord() {
    if (disabledClick()) return;
    // 停止录音
    recorderManager.stop();
  },

  initRecorder() {
    // 监听录音错误事件
    recorderManager.onError((err) => {
      this.noEffectStopRecorder();

      showErrMsg(msgMap[err.errMsg] || err.errMsg || '小程序错误');
      console.log('recorderManager.onError', err);
    });
    // 监听已录制完指定帧大小的文件事件。如果设置了 frameSize，则会回调此事件。
    // recorderManager.onFrameRecorded(({ frameBuffer, isLastFrame }) => {
    //   console.log('frameBuffer.byteLength: ', frameBuffer.byteLength)
    //   console.log('isLastFrame: ', isLastFrame);
    // });
    /**
     * 监听录音因为受到系统占用而被中断开始事件。
     * 以下场景会触发此事件：微信语音聊天、微信视频聊天。
     * 此事件触发后，录音会被暂停。
     * pause 事件在此事件后触发
     */
    recorderManager.onInterruptionBegin(() => {
      console.log('监听录音因为受到系统占用而被中断开始事件。');
    });
    /**
     * 监听录音中断结束事件。
     * 在收到 interruptionBegin 事件之后，
     * 小程序内所有录音会暂停，收到此事件之后才可再次录音成功。
     */
    recorderManager.onInterruptionEnd(() => {
      console.log('监听录音中断结束事件。');
    });
    // 监听录音暂停事件
    recorderManager.onPause(() => {
      console.log('recorder pause');
      // 立马停止，重新开始，没有恢复机制
      this.noEffectStopRecorder();
    });
    // 监听录音继续事件
    recorderManager.onResume(() => {
      console.log('recorder onResume')
    });
    // 开始录音
    recorderManager.onStart(() => {

      console.log('recorder start');
      this.startClock();
      this.setData({
        ...recordingData,
      });
    });

    // 停止录音
    recorderManager.onStop(async (res) => {
      console.log('recorder stop', res)
      // 停止后立即更新状态，以免异常
      this.stopClock();
      this.setData({
        ...initRData,
      });
      if (isError) {
        isError = false;
        return;
      }
      const { tempFilePath, duration } = res;
      console.log('tempFilePath', tempFilePath);
      const url = await uploadFile({ filePath: tempFilePath });

      // 快速开始时，获取的都是未录音，会冲掉当前上传试听，这里手动设置一下
      if (innerAudioContext.currentTime) {
        innerAudioContext.stop();
      }
      innerAudioContext.src = url;
      this.setData({
        ...initPlayData,
        ...initRData,
        detail: {
          ...this.data.detail,
          url,
          duration: Math.ceil(duration / 1000),
        },
        duration: formatClock(duration, true),
      });
      // await this.getDetail('CUR');
    });
  },

  initAudioPlayer() {
    // 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
    innerAudioContext.onCanplay(() => {
      console.log('监听音频进入可以播放状态的事件');

    });
    // 监听音频自然播放至结束的事件
    innerAudioContext.onEnded(() => {
      console.log('监听音频自然播放至结束的事件');
      this.setData({
        ...initPlayData
      });
    });

    // 监听音频播放错误事件
    innerAudioContext.onError((res) => {
      /**
       * 10001	系统错误
       * 10002	网络错误
       * 10003	文件错误
       * 10004	格式错误
       * -1	    未知错误
       */
      console.log(res.errCode, res.errMsg);
      this.setData({
        ...initPlayData
      });
    });

    // 监听音频暂停事件
    innerAudioContext.onPause(() => {
      console.log('监听音频暂停事件');
      this.setData({
        ...initPlayData
      });
    });

    // 监听音频播放事件
    innerAudioContext.onPlay(() => {
      console.log('开始播放');
      this.setData({
        ...playingData,
      });
    });

    // 监听音频完成跳转操作的事件
    innerAudioContext.onSeeked(() => {
      console.log('监听音频完成跳转操作的事件');

    });

    // 监听音频进行跳转操作的事件
    innerAudioContext.onSeeking(() => {
      console.log('监听音频进行跳转操作的事件');

    });

    // 监听音频停止事件
    innerAudioContext.onStop(() => {
      console.log('监听音频停止事件');
      this.setData({
        ...initPlayData,
      });
    });

    // 监听音频播放进度更新事件
    innerAudioContext.onTimeUpdate(() => {
      console.log('监听音频播放进度更新事件');

      let playPercent = 0;
      const duration = this.data.detail.duration || innerAudioContext.duration;
      try {
        playPercent = Math.ceil(((innerAudioContext.currentTime * 1000) / (duration * 1000)) * 100) || 0;
      } catch (e) {
        playPercent = 0;
      }
      playPercent = playPercent && playPercent > 100 ? 100 : playPercent;
      const currentTime = formatClock(innerAudioContext.currentTime * 1000, true);
      console.log('当前播放时间：', currentTime);
      console.log('微信暴露时间：', innerAudioContext.duration);
      console.log('后端返回时间：', duration);
      console.log('当前播放进度：', playPercent);
      this.setData({
        currentTime,
        playPercent,
      });
    });

    // 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
    innerAudioContext.onWaiting(() => {
      console.log('监听音频加载中事件');

      // const duration = innerAudioContext.duration;
      // if (!duration) return;
      // console.log('设置 duration：', duration);
      // this.setData({
      //   duration: formatClock(duration * 1000, true),
      // });
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.initRecorder();
    this.initAudioPlayer();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getDetail('CUR');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('切换页面停止录音或播放');
    innerAudioContext.stop();

    this.noEffectStopRecorder();
  },
})