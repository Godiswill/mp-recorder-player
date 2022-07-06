Component({
	options: {
		styleIsolation: 'apply-shared',
	},

	properties: {
    src: String,
    extClass: String,
    extStyle: String,
    color: String,
    size: Number,
    va: String,
  },
  
  observers: {
    color: function (color) {
      this.setData({
        backgroundColor: color ? `background-color: ${color};` : '',
      });
    },
    size: function (size) {
      size = size || 48;
      this.setData({
        sizeStyle: size ? `height: ${size}rpx; width: ${size}rpx;` : '',
      });
    },
    va: function(va) {
      this.setData({
        verticalAlign: va ? `vertical-align: ${va};` : '',
      });
    }
  },

	data: {
		
	},
	
	lifetimes: {
		ready() {
      const url = this.data.src;
			wx.getFileSystemManager().readFile({
				filePath: `${url}`,
				encoding: 'base64',
				success: res => {
          const base64 = 'data:image/svg+xml;base64,' + res.data;
          const maskImage = `mask-image:url(${base64}); -webkit-mask-image:url(${base64}); -moz-mask-image:url(${base64})`;
					this.setData({
						maskImage, 
					})
				},
				fail: res => {
					console.log(`${url} load fail, res = `, res)
				}	
			})
		}
	},

	methods: {

	}
})