// pages/wode/secondPart/bean/bean.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attentionArray: [],
    hasInfo: false,
    div: {},
    // nextUrl
    nextUrl: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { Yid } = options
    var that = this
    // 去数据库获取关注的人
    wx.request({
      url: app.globalData.ykUrl + "user/attention/" + Yid + "?type=1",
      header: {
        Authorization: app.globalData.token
      },
      method: 'GET',
      dataType: 'JSON',
      responseType: 'text',
      data: {
      },
      responseType: 'text',
      success: (res) => {
        this.setData({
          div: res.data
        })
        console.log("我是div" + this.data.div)
        this.setData({
          attentionArray: JSON.parse(this.data.div).results,
          nextUrl: JSON.parse(that.data.div).next
        })

        if (this.data.attentionArray.length == 0) {
          this.setData({
            hasInfo: false
          })
        } else {
          this.setData({
            hasInfo: true
          })
        }
      },
    })
  },

  // 获取关注的人的详细信息
  peopleInfo: function (e) {
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + e.target.id,
    })
  },

  //  * 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log("到底了")
    var that = this

    if (this.data.nextUrl != null) {
      wx.request({
        url: nextUrl,
        header: {
          Authorization: app.globalData.token
        },
        method: 'GET',
        dataType: 'JSON',
        responseType: 'text',
        data: {
        },
        responseType: 'text',
        success: (res) => {
          this.setData({
            div: res.data
          })
          console.log("我是div" + this.data.div)
          this.setData({
            attentionArray: this.data.attentionArray.concat(JSON.parse(this.data.div).results),
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