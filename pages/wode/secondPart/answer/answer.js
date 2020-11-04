// pages/wode/secondPart/answer/answer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //  0为赞同回答,1为收藏回答,2为回答问题,3为收藏问题,4为提出问题 

    answerArray: [
      { type: 0 },
      { type: 1 },
      { type: 2 },
      { type: 3 },
      { type: 3 },
      { type: 4 }
    ],
    answerArray1: [],
    stringList: [
      { name: "赞同了回答" },
      { name: "收藏了回答" },
      { name: "回答了问题" },
      { name: "收藏了问题" },
      { name: "提出了回答" }
    ],
    // 保存用户信息
    userInfo1: {},
    userID1: 0,
    div: {},
    // nextUrl
    nextUrl: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { Yid } = options
    this.setData({
      userID1: Yid
    })

    // 去数据库获取动态
    wx.request({
      url: app.globalData.ykUrl + "user/dynamic/" + Yid,
      // 不需要token
      header: {},
      method: 'GET',
      // 返回的数据类型
      dataType: 'JSON',
      // 响应的数据类型
      responseType: 'text',
      data: {},
      responseType: 'text',
      success: (res) => {
        this.setData({
          div: res.data,
        })
        console.log("数据" + res.data)
        this.setData({
          answerArray1: JSON.parse(this.data.div).results,
          nextUrl: JSON.parse(this.data.div).next
        })
        console.log("我是属性：" + this.data.answerArray1)
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },

  // 跳转到问题
  jumpToQuestion: function (e) {
    wx.navigateTo({
      url: '/pages/index/tuijanDetail2/tuijanDetail2?articleID=' + e.target.id,
    })
  },
  // 跳转到回答
  jumpToAnswer: function (e) {
    wx.navigateTo({
      url: '/pages/index/tuijanDetail/tuijanDetail?articleID=' + e.target.id,
    })
  },
  // 跳转到回答
  jumpToAnswer2: function (e) {
    wx.navigateTo({
      url: '/pages/index/tuijanDetail/tuijanDetail?articleID=' + e.target.id,
    })
  },

//  * 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log("到底了")
    if (this.data.nextUrl != null) {
      wx.request({
        url: this.data.nextUrl,
        header: {},
        method: 'GET',
        dataType: 'JSON',
        responseType: 'text',
        data: {},
        responseType: 'text',
        success: (res) => {
          this.setData({
            div: res.data,
          })
          this.setData({
            answerArray1: this.data.answerArray1.concat(JSON.parse(this.data.div).results),
            nextUrl: JSON.parse(this.data.div).next
          })
        },
      })
    }else{
      wx.showToast({
        title: '没有更多数据',
        icon:"none"
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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