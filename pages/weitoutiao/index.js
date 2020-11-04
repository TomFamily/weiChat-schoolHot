// pages/weitoutiao/index.js
const app = getApp()
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // content: [
    //   { tytle: 1, head: "image_url", name: "user_name", problem: "problem", zan: "z", xiHuan: "z", pinLun: "z", },
    //   { tytle: 2, head: "image_url", name: "user_name", problem: "problem", zan: "z", xiHuan: "z", pinLun: "z", },
    //   { tytle: 2, head: "image_url", name: "user_name", problem: "problem", zan: "z", xiHuan: "z", pinLun: "z", },
    //   { tytle: 1, head: "image_url", name: "user_name", problem: "problem", zan: "z", xiHuan: "z", pinLun: "z", },
    //   { tytle: 1, head: "image_url", name: "user_name", problem: "problem", zan: "z", xiHuan: "z", pinLun: "z", }
    // ],

    // 用户发送的消息
    message: [],
    // 包含用户头像和name的数组
    message_hasHeader: [],
    // 记录头指针的位置
    ykChatUserHead: 0
  },

  onLoad: function (options) {


  },

  // 生命周期函数--监听页面显示（
  onShow: function () {
    var that = this
    // 将数组清空
    app.globalData.websocketMessage1 = []
    this.setData({
      message_hasHeader: []
    })


    if (app.globalData.ykChatUserID.length > 0) {
      console.log("ykChatUserID:" + app.globalData.ykChatUserID.length)
      console.log("ykChatUserID信息（index）:" + app.globalData.ykChatUserID[0].message)
      console.log("ykChatUserID:" + app.globalData.ykChatUserID[0].time)
      console.log("ykChatUserID:" + app.globalData.ykChatUserID[0].from_user)

      // 用没有头像的message数组去获取有头像的message数组
      var ykCount = app.globalData.ykChatUserHead
      console.log("缓存头：" + app.globalData.ykChatUserHead)
      var that = this
      var length = app.globalData.ykChatUserID.length
      console.log("长度：" + length)

      for (var i = 0; i < app.globalData.ykChatUserID.length; i++) {
        var from_user = app.globalData.ykChatUserID[i].from_user
        console.log("from_user:" + from_user)

        wx.request({
          url: app.globalData.ykUrl + "chat/userinfo?user=" + from_user,
          header: {
            Authorization: app.globalData.token
          },
          data: {
            from_user: app.globalData.ykChatUserID[i].from_user,
            message: app.globalData.ykChatUserID[i].message,
            time: app.globalData.ykChatUserID[i].time
          },
          method: "POST",
          success(res) {
            console.log("我是聊天列表数据：" + res.data)
            that.data.message_hasHeader.push({
              data: res.data
            })
            console.log("websock:" + res.data.message)
          },
        })
        if (i + 1 == app.globalData.ykChatUserID.length) {
          that.setData({
            message_hasHeader: that.data.message_hasHeader
          })
          // 循环结束，将有头像的数组保存到全局变量
          app.globalData.websocketMessage1 = that.data.message_hasHeader
        }
      }
    }



  },

  navigateToZan: function () {
    if (app.globalData.hasUserInfo == false) {
      // 用户没有登录，让他去登录
      wx.showModal({
        // title: "温馨提示", // 提示的标题
        content: "还没有属于你的聊天数据，登录后生成哦！", // 提示的内容
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
        url: '../weitoutiao/zan/zan',
      })
    }
  },
  navigateToSixin: function () {
    if (app.globalData.hasUserInfo == false) {
      // 用户没有登录，让他去登录
      wx.showModal({
        // title: "温馨提示", // 提示的标题
        content: "还没有属于你的聊天数据，登录后生成哦！", // 提示的内容
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
        url: '../weitoutiao/siXin/siXin',
      })
    }

  },
  navigateToXitong: function () {
    if (app.globalData.hasUserInfo == false) {
      // 用户没有登录，让他去登录
      wx.showModal({
        // title: "温馨提示", // 提示的标题
        content: "还没有属于你的聊天数据，登录后生成哦！", // 提示的内容
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
        url: '../weitoutiao/xiTong/xiTong',
      })
    }
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