// pages/weitoutiao/siXin/siXin.js
const app = getApp()
var Util = require("../../../utils/util.js");

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
    hasInfo: false,
    // 
    message: [],

  },

  onLoad:function(options){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {


    // 将数组的时间戳解析出来，并并封装进数组(只改变了时间戳)
    var messageArray = app.globalData.websocketMessage1
    console.log("messageArray:" + app.globalData.websocketMessage1)


    if (messageArray.length > 0) {
      console.log("message时间:" + messageArray[0].data.time)

      for (var i = 0; i < messageArray.length; i++) {
        // 时间戳转换格式
        messageArray[i].data.time = Util.timeFomat(messageArray[i].data.time)
        if (i == messageArray.length - 1) {
          this.setData({
            message: messageArray
          })
        }
      }

      console.log("message信息:" + this.data.message[0].data.message)
      console.log("message姓名:" + this.data.message[0].data.nick_name)
      console.log("message时间:" + this.data.message[0].data.time)
      this.setData({
        hasInfo: true
      })
    }
  },

  // 跳转到聊天页
  junpToChat: function (e) {
    var userID = e.target.id
    var userMessage = " "
    var time = 0
    var head_portrait = " "
    var nick_name = " "
    // 循环聊天列表的数组，知道ID对应的message
    for (var i = 0; i < this.data.message.length; i++) {
      if (this.data.message[i].data.from_user == userID) {
        userMessage = this.data.message[i].data.message
        nick_name = this.data.message[i].data.nick_name
        head_portrait = this.data.message[i].data.head_portrait
        time = this.data.message[i].data.time
        // break
      }
    }
    wx.getStorage({
      key: String(userID),
      success(res) {
        var type = res.data[res.data.length - 1].speaker
        wx.navigateTo({
          url: '/pages/weitoutiao/chat/yk2?Yid=' + userID + "&&message=" + userMessage + "&&headImage=" + head_portrait + "&&name=" + nick_name + "&&time=" + time + "&&type=" + type,
        })
      }
    })



  },

  close: function () {

    wx.closeSocket({
      code: 1000,
    }),
      console.log("关闭")
  },


  choose: function () {
    wx.getStorage({
      key: String(1),
      success(res) {
        console.log("聊天记录:" + res.data)
        console.log("聊天对象:" + String(1))
        for (var i = 0; i < res.data.length; i++) {
          console.log("聊天记录:" + res.data[i].content)
          // console.log("聊天记录:" + res.data[i].speaker)
        }
      }
    })
  },
})