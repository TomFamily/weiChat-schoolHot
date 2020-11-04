// pages/index/tuijanDetail3/pinglun/huifu/huifu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taolunID2: 0,
    // 讨论详情
    taolun: {},
    // 评论的数据
    pinglunDiv: {},
    pingLunList: [],
    // 评论的nextUrl
    nextUrl: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 接收讨论的id
    let { articleID } = options
    this.setData({
      taolunID2: articleID
    })
    console.log("讨论id：" + articleID)

    // 获取讨论详情
    wx.request({
      url: app.globalData.ykUrl + "food/discuss/info?discuss=" + this.data.taolunID2,
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
        this.setData({
          taolun: res.data
        })
        console.log("我是讨论赞同状态：" + this.data.taolun.is_approval)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })

    // 获取评论
    wx.request({
      url: app.globalData.ykUrl + "food/discuss/comment?discuss=" + this.data.taolunID2,
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
          pingLunList: res.data.results,
          nextUrl: res.data.next
        })
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },

  // 写回复
  writeHuifu: function () {
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
      var that = this
      // （1：评论 2：回复 3：短评(评分) 4：美食讨论的评论）
      wx.navigateTo({
        url: '/pages/fabu/comment/rich-text?articleID=' + that.data.taolunID2 + "&&type=4",
      })
    }
  },

  // 点赞操作
  isDianzan: function (e) {
    var id = e.target.id
    console.log("我是短评id:" + id)

    if (this.data.pingLunList.length > 0) {
      for (var i = 0; i < this.data.pingLunList.length; i++) {
        if (id == this.data.pingLunList[i].id) {
          var isApprove = this.data.pingLunList[i].is_approval
          console.log("我是短评id:" + isApprove)
          wx.request({
            url: app.globalData.ykUrl + "operation/approval?discuss_comment=" + id,
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

  isDianzan1: function (e) {
    var id = e.target.id
    console.log("我是短评id:" + id)

    // if (this.data.duanpinList.length > 0) {
    // for (var i = 0; i < this.data.duanpinList.length; i++) {
    if (id == this.data.taolun.id) {
      var isApprove = this.data.taolun.is_approval
      console.log("我是短评id:" + isApprove)
      wx.request({
        url: app.globalData.ykUrl + "operation/approval?discuss=" + id,
        header: {
          Authorization: app.globalData.token,
        },
        method: 'GET',
        responseType: 'text',
        success: (res) => {
          console.log("res.data.status:" + res.data.status)
          if (res.data.status == "ok") {
            console.log("讨论赞同点击回复:" + res.data.status)
            // 关注成功
            if (isApprove == 0) {
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
    //   }
    // }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("到底了")
    if (this.data.nextUrl != null) {
      // 获取评论
      wx.request({
        url: this.data.nextUrl,
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
            pingLunList: this.data.pingLunList.concat(res.data.results),
            nextUrl: res.data.next
          })
        },
      })
    }
  },
  // 跳转到用户信息页
  jumpToPeplo: function (e) {
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + e.target.id,
    })
  },






  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})