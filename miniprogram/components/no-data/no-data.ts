// components/no-data/no-data.ts
Component({
  options: {
		styleIsolation: 'apply-shared',
	},
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: '暂无数据'
    },
    visible: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
