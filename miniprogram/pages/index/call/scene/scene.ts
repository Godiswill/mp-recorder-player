import { getRecordingSceneDetail } from "../../../../api/index"
import { ScriptRecordingStatusMap } from "../../../../consts/index";


Page<ISceneData, any>({

  /**
   * 页面的初始数据
   */
  data: {
    botId: 0,
    accountKey: '',
    type: 'scene',
    list: [],
    sceneId: undefined,
  },
  statusMap() {
    return ScriptRecordingStatusMap;
  },
  bindGoRecord(e: WechatMiniprogram.BaseEvent) {
    const item = e.currentTarget.dataset.item as TRecordingDetail;
    const { recordingId, accountKey } = item;
    wx.navigateTo({
      url: `./record/record?recordingId=${recordingId}&accountKey=${accountKey}&sceneId=${this.data.sceneId || ''}&botId=${this.data.botId}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query: IScenePageQuery) {
    const { sceneId, accountKey, type, botId } = query;
    this.setData({
      sceneId: sceneId ? Number(sceneId) : undefined,
      accountKey,
      type,
      botId: Number(botId)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const { type, sceneId, accountKey } = this.data as ISceneData;

    if (type === 'scene' && sceneId) {
      getRecordingSceneDetail({
        sceneId: sceneId,
        accountKey
      }).then(res => {
        const { sceneName, recordingDetails } = res;
        wx.setNavigationBarTitle({
          title: sceneName
        });
        this.setData({
          list: recordingDetails
        })
      })
    }
  },

})