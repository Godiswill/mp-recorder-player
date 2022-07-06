import { operateBotDetail } from "../../../api/index";

Page<ICallDetailData, any>({

  /**
   * 页面的初始数据
   */
  data: {
    botId: 0,
    accountKey: '',
    detail: undefined,
    title: '',
  },

  bindGotoScene(e: WechatMiniprogram.BaseEvent) {
    const { type, item } = e.currentTarget.dataset as IScenePageParams;
    let sceneId: number = 0;
    if (isSceneData(item)) {
      sceneId = item.sceneId
    }
    wx.navigateTo({
      url: `./scene/scene?sceneId=${sceneId || ''}&accountKey=${this.data.accountKey}&type=${type}&botId=${this.data.botId}`
    })
  },

  bindClearAll() {
    wx.showModal({
      title: '清空全部',
      content: '是否要清空全部录音',
      success: (res) => {
        if (res.confirm) {

        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: ICallDetailQuery) {
    this.setData(query)
    wx.setNavigationBarTitle({
      title: query.title
    });
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow() {
    this.fetchDetail();
  },

  fetchDetail() {
    operateBotDetail({
      botId: this.data.botId,
      accountKey: this.data.accountKey,
    }).then(res => {
      this.setData({
        detail: res
      })
    })
  },

  quickStart() {
    const { botId, accountKey } = this.data;
    if (!botId) return;
    wx.navigateTo({
      url: `./scene/record/record?botId=${botId}&accountKey=${accountKey}`,
    });
  },
  
})

function isSceneData(item: any): item is TMainProcessDetail {
  return !!item.sceneName;
}