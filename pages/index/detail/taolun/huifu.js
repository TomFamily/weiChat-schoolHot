const app = getApp()
Page({
  data: {
    // 讨论的id
    tID: 0,
    list: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ],
    // 美食id,用来获取讨论
    meishiID: 0,
    // 讨论的数据
    taolunDiv: {},
    taolunList: [],
    // nextUrl
    nextUrl: null,
    // 排序
    sort: "默认排序"

  },
  onLoad: function (options) {
    this.setData({
      meishiID: options.articleID
    })
    var that = this
    // 获取讨论
    wx.request({
      url: app.globalData.ykUrl + "food/discuss/rank?food=" + this.data.meishiID + "&type=0",
      header: {
        Authorization: app.globalData.token,
      },
      dataType: 'json',
      data: {
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        this.setData({
          taolunList: res.data.results,
          nextUrl: res.data.next
        })
        console.log("我是讨论数据：" + res.data.results)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },

  // 跳转到发布页
  jumpToFabu: function () {
    if (app.globalData.hasUserInfo == false) {
      // 用户没有登录，让他去登录
      wx.showModal({
        // title: "温馨提示", // 提示的标题
        content: "登录后才能发布文章哦！", // 提示的内容
        showCancel: true, // 是否显示取消按钮，默认true
        cancelText: "以后再说", // 取消按钮的文字，最多4个字符
        cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
        confirmText: "前往登录", // 确认按钮的文字，最多4个字符
        confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
        success: function (res) {
          // console.log("接口调用成功的回调函数");
          if (res.confirm) {
            console.log('用户点击确定')
            // 调用接口，取消对改用户的关注
            wx.switchTab({
              url: '/pages/wode/index',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/fabu/editor/rich-text?articleID=' + this.data.meishiID,
      })
    }
  },
  // 排序
  sort: function () {
    var type = 0
    if (this.data.sort == "默认排序") {
      this.setData({
        sort: "时间排序"
      })
      type = 1
    } else {
      this.setData({
        sort: "默认排序"
      })
      type = 0
    }

    wx.request({
      url: app.globalData.ykUrl + "food/discuss/rank?food=" + this.data.meishiID + "&type=" + type,
      header: {
        Authorization: app.globalData.token,
      },
      dataType: 'json',
      data: {
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        this.setData({
          taolunList: res.data.results,
          nextUrl: res.data.next
        })
        console.log("我是讨论数据：" + res.data.results)
      },
    })
  },

  // 跳转到讨论详情页（将讨论的id带上）
  jumpToDeatil: function (e) {
    console.log(e.target.id)
    this.setData({
      tID: e.target.id
    })
    wx.navigateTo({
      url: '/pages/index/detail/taolun/huifu/huifu?articleID=' + this.data.tID,
    })
  },

  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    console.log("到底了")
    if (this.data.nextUrl != null) {
      var that = this
      // 获取讨论
      wx.request({
        url: that.data.nextUrl,
        header: {
          Authorization: app.globalData.token,
        },
        dataType: 'json',
        data: {
        },
        method: 'GET',
        responseType: 'text',
        success: (res) => {
          this.setData({
            taolunList: that.data.taolunList.concat(res.data.results),
            nextUrl: res.data.next
          })
          console.log("我是讨论数据：" + res.data.results)
        },
      })
    }
  },

})