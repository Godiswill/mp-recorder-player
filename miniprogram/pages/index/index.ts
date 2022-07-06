// index.ts
import { operateList } from '../../api/index';
import { RecordingStatusMap } from '../../consts/index';
import { formatTime } from '../../utils/util';
// 获取应用实例
const app = getApp<IAppOption>()

Page<IIndexData, any>({
  data: {
    StatusBarHeight: app.globalData.StatusBarHeight,
    CustomBarHeight: app.globalData.CustomBarHeight,
    CustomRect: app.globalData.CustomRect,
    list: [],
    tab: 0,
    RecordingStatusMap: RecordingStatusMap,
    currentPage: 1,
    pageSize: 30,
    keyword: '',
    triggered: false,
    hasNextPage: true,
  },
  tabChange(e: WechatMiniprogram.BaseEvent) {
    this.setData({
      tab: e.currentTarget.dataset.status,
      currentPage: 1,
    }, () => {
      this.fetchList(true);
    });
  },
  // 事件处理函数
  bindViewTap(e: WechatMiniprogram.BaseEvent) {
    const item = e.currentTarget.dataset.item as IRecordingItem;
    const { botId, accountKey, botName } = item;
    wx.navigateTo({
      url: `./call/call?botId=${botId}&accountKey=${accountKey}&title=${botName}`,
    })
  },
  bindSearch(e: WechatMiniprogram.CustomEvent) {
    this.setData({ keyword: e.detail.value }, () => {
      this.fetchList();
    })
  },
  fetchList() {
    return operateList({
      page: this.data.currentPage,
      pageSize: this.data.pageSize,
      // status: this.data.tab, // 临时去掉
      botName: this.data.keyword,
    }, true).then((data) => {
      const { list, page, total, pageSize } = data;

      // 是否有下一页
      const hasNextPage = page * pageSize < total
      list.forEach(i => {
        i.updateTimeStr = formatTime(new Date(i.updateTime))
        i.isCompleted = i.percent === 100
      })
      // 不是第一页，则是滑动加载
      let _list = list;
      if (this.data.currentPage !== 1) {
        const oldBotIds = this.data.list.map((i: IRecordingItem) => i.botId);
        _list = [...this.data.list, ...list.filter(i => {
          return !oldBotIds.includes(i.botId)
        })]
      }
      this.setData({
        list: _list,
        hasNextPage,
      })
      return data
    });
  },
  onShow() {
    // 重置页面
    this.setData({
      currentPage: 1
    }, () => {
      this.fetchList();
    })
  },
  onLoad() {
    // @ts-ignore
    // if (wx.getUserProfile) {
    //   this.setData({
    //     canIUseGetUserProfile: true
    //   })
    // }
  },

  onToBottom() {
    if (this.data.hasNextPage) {
      this.setData({
        currentPage: this.data.currentPage + 1
      }, () => {
        this.fetchList()
      })
    }
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    this.setData({
      currentPage: 1
    }, () => {
      this.fetchList().finally(() => {
        this._freshing = false
        this.setData({
          triggered: false,
        })
      });
    })
  },
})
