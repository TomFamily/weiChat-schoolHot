const app = getApp()

Page({
  data: {
    // 保存获取的数据
    div: {},
    contentList: [],
    // nextUrl
    nextUrl: null,
    // 美食id
    meishiID: 0,
    // 记录用户是否点赞
    // isDianzan: false
  },

  onLoad: function (options) {
    this.setData({
      meishiID: options.articleID
    })

    var that = this
    // 获取短评
    wx.request({
      url: app.globalData.ykUrl + "food/shortcomment?food=" + this.data.meishiID + "&type=0",
      header: {
        Authorization: app.globalData.token,
      },
      dataType: 'json',
      data: {
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        // 将返回数据进行json解析
        // var res = JSON.parse(res.data),
        // this.setData({
        //   div: res.data
        // })
        // var a = JSON.parse(this.data.div).results
        // this.setData({
        //   contentList:a
        // })
        this.setData({
          contentList: res.data.results,
          nextUrl: res.data.next
        })
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
      // （1：评论 2：回复 3：短评(评分) 4：美食讨论的评论）
      wx.navigateTo({
        url: '/pages/fabu/comment/rich-text?articleID=' + this.data.meishiID + "&&type=3",
      })
    }
  },

  // 跳转到用户数据页
  jumpToUser: function (e) {
    var id = e.target.id
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + id,
    })
  },

  // 点赞操作
  isDianzan: function (e) {
    var id = e.target.id
    console.log("我是短评id:" + id)

    if (this.data.contentList.length > 0) {
      for (var i = 0; i < this.data.contentList.length; i++) {
        if (id == this.data.contentList[i].id) {
          var isApprove = this.data.contentList[i].is_approval
          console.log("我是短评id:" + isApprove)
          wx.request({
            url: app.globalData.ykUrl + "operation/approval?short_comment=" + id,
            header: {
              Authorization: app.globalData.token,
            },
            method: 'GET',
            responseType: 'text',
            success: (res) => {
              console.log("res.data.status:" + res.data.status)
              if (res.data.status == "ok") {
                // 关注成功
                if (isApprove == 0) {
                  // this.data.duanpinList[i].is_approval = 1
                  wx.showToast({
                    title: "点赞成功",
                    icon: "none",
                    mask: false,
                    duration: 1000
                  })
                } else {
                  // this.data.duanpinList[i].is_approval = 0
                  wx.showToast({
                    title: "点赞取消",
                    icon: "none",
                    mask: false,
                    duration: 1000
                  })
                }
              }
            },
            fail: function (res) { },
            complete: function (res) {
            },
          })

        }
      }
    }

  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    console.log("到底了")
    if (this.data.nextUrl != null) {
      var that = this
      // 获取短评
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
            contentList: this.data.contentList.concat(res.data.results),
            nextUrl: res.data.next
          })
        },
      })
    }
  },

})