// pages/weitoutiao/zan/zan.js
const app = getApp()
var Util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [
      { type: 1, string: "评论了你的回答", },
      { type: 2, string: "关注了你", },
      { type: 3, string: "回复了你的评论" },
      { type: 4, string: "参与了你的美食讨论" },
      { type: 5, string: "回复了你的美食评论" }
    ],
    // 用来接收服务器发来的所有数据
    message: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      message:app.globalData.allerMessageArray
    })

    var ykMessage = app.globalData.allerMessageArray
    console.log("ykMessage长度：" + ykMessage.length)
    for(var i = 0; i < ykMessage.length;i++){
      ykMessage[i].time = Util.timeFomat(ykMessage[i].time)

      if(i == ykMessage.length -1){
        this.setData({
          message:ykMessage
        })
      }
    }
    console.log("我是接收到的数据：" + this.data.message[0].type)
    console.log("我是接收到的数据：" + this.data.message[0].message.user_head_portrait)
    console.log("我是接收到的数据：" + this.data.message[0].user_head_portrait)
  },

  // 跳转到文章页
  jumpToInfo: function (e) {
    var id = e.target.id
    wx.navigateTo({
      url: '/pages/index/tuijanDetail/tuijanDetail?articleID=' + id,
    })
  },

  // 跳转到美食页
  jumpToMeishi:function(e){
    var id = e.target.id
    wx.navigateTo({
      url: '/pages/index/detail/taolun/huifu?articleID=' + id,
    })
  },
  // 跳转到用户信息页
  jumpToPerson:function(e){
    var id = e.target.id
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + id,
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