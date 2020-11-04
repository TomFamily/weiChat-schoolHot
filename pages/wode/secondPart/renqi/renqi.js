// pages/wode/collect/collect.js
const app = getApp()
Page({

  data: {
    info:{},
    info2:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.token)
    wx.request({
      url: app.globalData.ykUrl + "user/create",
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
        // var res2 = JSON.parse(res.data),
        this.setData({
          info2:res.data
        })
        console.log("我是数据：" + JSON.stringify(this.data.info2))
        this.setData({
          info:res.data
        })
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})