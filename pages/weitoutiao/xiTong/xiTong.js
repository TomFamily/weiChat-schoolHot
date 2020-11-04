// pages/weitoutiao/xiTong/xiTong.js
const app = getApp()
var Util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [
      { tytle: 1, head: "image_url", name: "user_name", problem: "problem", zan: "z", xiHuan: "z", pinLun: "z", },
      { tytle: 2, head: "image_url", name: "user_name", problem: "problem", zan: "z", xiHuan: "z", pinLun: "z", },
      { tytle: 2, head: "image_url", name: "user_name", problem: "problem", zan: "z", xiHuan: "z", pinLun: "z", },
      { tytle: 1, head: "image_url", name: "user_name", problem: "problem", zan: "z", xiHuan: "z", pinLun: "z", },
      { tytle: 1, head: "image_url", name: "user_name", problem: "problem", zan: "z", xiHuan: "z", pinLun: "z", }
    ],
    message:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this
    // // 监听 WebSocket 接受到服务器的消息事件
    // wx.onSocketMessage(function (data) {
    //   that.setData({
    //     message: data
    //   })
    // })

    this.setData({
      message:app.globalData.allerMessageArray
    })
  },

  // 功能待定
  jumpToChat: function () {
    // wx.navigateTo({
    //   url: '/pages/weitoutiao/chat/yk2?objectID=-1&&?messageContent=' + this.data.message[e.target.id].message,
    // })
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