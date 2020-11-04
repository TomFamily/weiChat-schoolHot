// pages/wode/collect/collect.js
const app = getApp()
Page({

  data: {
    collectArray: [
      { name: '话题', id: 1, type: 1 },
      { name: '美食', id: 2, type: 0 },
      { name: '美食', id: 2, type: 0 },
      { name: '美食', id: 2, type: 1 },
      { name: '美食', id: 2, type: 2 },
      { name: '美食', id: 2, type: 2 },
    ],
    div: {},
    //保存获取到的数据
    collectArray2: [],
    hasInfo: false,
    tapID: 0,
    sLIst: [
      { name: '话题', id: 0 },
      { name: '回答', id: 1 },
      { name: '美食', id: 2 },
    ],
    token: null,
    // nextUrl
    nextUrl: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("onload被调用了")

    var that = this
    var token = app.globalData.token
    this.setData({
      token: token
    })
    console.log("token:" + app.globalData.token)
    // 去数据库获取收藏
    wx.request({
      url: app.globalData.ykUrl + "user/collect?type=" + this.data.tapID,
      header: {
        Authorization: token
      },
      method: 'GET',
      // 返回的数据类型
      dataType: 'JSON',
      // 响应的数据类型
      responseType: 'text',
      data: {},
      responseType: 'text',
      success: (res) => {
        if (res.data.length == 0) {
          that.setData({
            hasInfo: false
          })
        } else {
          // 将返回数据进行json解析
          // var res = JSON.parse(res.data),
          that.setData({
            div: res.data,
            hasInfo: true
          })
          console.log("shur:" + res.data)

          that.setData({
            collectArray2: JSON.parse(that.data.div).results,
            nextUrl: JSON.parse(that.data.div).next
          })
          console.log("我是数组:" + this.data.collectArray2[0].id)
        }
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },
  // 跳转到话题页
  juamToDetail: function (e) {
    console.log("articleID:" + e.target.id)
    wx.navigateTo({
      url: '/pages/index/tuijanDetail/tuijanDetail?articleID=' + e.target.id,
    })
  },
  // 跳转到回答页
  juamToDetail3: function (e) {
    console.log("id:" + e.target.id)
    wx.navigateTo({
      url: '/pages/index/tuijanDetail2/tuijanDetail2?articleID=' + e.target.id,
    })
  },
  // 跳转到美食页
  juamToDetail2: function (e) {
    console.log("id:" + e.target.id)
    wx.navigateTo({
      url: '/pages/index/detail/detail?articleID=' + e.target.id,
    })
  },

  // 头部被点击
  headerTitleClick: function (e) {
    var that = this
    this.setData({
      tapID: e.target.dataset.id,
    })
    console.log("我是：" + e.target.dataset.id)

    // 改变页面显示
    wx.request({
      url: app.globalData.ykUrl + "user/collect?type=" + this.data.tapID,
      header: {
        Authorization: this.data.token
      },
      method: 'GET',
      // 返回的数据类型
      dataType: 'JSON',
      // 响应的数据类型
      responseType: 'text',
      data: {},
      responseType: 'text',
      success: (res) => {
        if (res.data.length == 0) {
          that.setData({
            hasInfo: false
          })
        } else {
          // 将返回数据进行json解析
          // var res = JSON.parse(res.data),
          that.setData({
            div: res.data,
            hasInfo: true
          })
          console.log("shur:" + res.data)
          that.setData({
            collectArray2: JSON.parse(that.data.div).results,
            nextUrl: JSON.parse(that.data.div).next
          })
          console.log("我是数组:" + this.data.collectArray2)
        }
      },
    })
  },

  //  * 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log("到底了")
    if (this.data.nextUrl != null) {
      wx.request({
        url: this.data.nextUrl,
        header: {
          Authorization: this.data.token
        },
        method: 'GET',
        dataType: 'JSON',
        responseType: 'text',
        data: {},
        responseType: 'text',
        success: (res) => {
          that.setData({
            div: res.data
          })
          that.setData({
            collectArray2: this.data.collectArray2.concat(JSON.parse(that.data.div).results),
            nextUrl: JSON.parse(that.data.div).next
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