//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    // 用户信息
    headerImage: null,
    userName: null,
    userID: null,
    token: null,


  },

  //事件处理函数  
  onLoad: function () {

    // if (app.globalData.ykHeader && app.globalData.ykName && app.globalData.selfID) (
    //   this.setData({
    //     headerImage: app.globalData.ykHeader,
    //     userName: app.globalData.ykName,
    //     userID: app.globalData.selfID,
    //     hasUserInfo: false,
    //     canIUse: true
    //   })
    // )

    var that = this
    // 到缓存获取用户信息
    wx.getStorage({
      key: 'ykInfo',
      success(res) {
        console.log("我是缓存数据:" + res.data.head_portrait)
        that.setData({
          headerImage: res.data.head_portrait,
          userName: res.data.nick_name,
          userID: res.data.id,
          token: res.data.token,
          hasUserInfo: true
        })
        app.globalData.ykHeader = res.data.head_portrait
        app.globalData.ykName = res.data.nick_name
        app.globalData.selfID = res.data.id
        app.globalData.token = res.data.token
      }
    })



  },

  getUserInfo: function (e) {

    console.log("getUserInfo")

    var that = this

    // console.log("我是登录时获取到的消息：" + e)
    // console.log("我是用户信息：" + e.detail.userInfo.nickName)
    // app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // }),
    
      //获取openid
      wx.login({
        success: function (res) {
          console.log("code:" + res.code)
          console.log("code:" + e.detail.userInfo.nickName)
          console.log("code:" + e.detail.userInfo.avatarUrl)
          //发送请求获取openid
          wx.request({
            url: app.globalData.ykUrl + "login", //接口地址
            data: {
              code: res.code,
              nickName: e.detail.userInfo.nickName,
              avatarUrl: e.detail.userInfo.avatarUrl
            },
            method: "POST",
            dataType: 'JSON',
            header: {
              'content-type': 'application/json' //默认值
            },
            success: function (res) {
              //返回openid
              console.log("我是返回数据：" + res.data)
              that.setData({
                userInfo: JSON.parse(res.data),

                hasUserInfo:true
              })
              that.setData({
                headerImage: that.data.userInfo.head_portrait,
                userName: that.data.userInfo.nick_name,
                userID: that.data.userInfo.id,
              })
              app.globalData.userInfo = that.data.userInfo
              app.globalData.ykHeader = that.data.userInfo.head_portrait
              app.globalData.ykName = that.data.userInfo.nick_name
              app.globalData.selfID = that.data.userInfo.id
              app.globalData.token = that.data.userInfo.token

              app.globalData.schoolID = that.data.userInfo.school
              console.log("我是学校id : " + that.data.userInfo.school)
              

              // 在调用request请求

              console.log("token22:" + that.data.userInfo.token)
              console.log("token22:" + app.globalData.token)
              // 缓存(先清除)
              wx.removeStorage({
                key: 'ykInfo',
              })
              wx.setStorage({
                data: that.data.userInfo,
                key: 'ykInfo',
              })

              //开启websocket的连接（第一个使用在登录的时候开启连接）
              wx.connectSocket({
                url: app.globalData.webSocket + app.globalData.token,
                data: {},
                method: "GET",
                success: function (res) {
                  console.log("websocket成功连接了")
                },
                fail: function (res) {
                  console.log("websocket连接失败:" + res.data)
                },
              })
            }

          })

        }
      })
  },

  //页面跳转
  preView: function () {
    console.log("我是头像URL：" + this.data.headerImage)
    wx.previewImage({
      urls: [this.data.headerImage],
    })
  },
  navigateToAttention: function () {
    wx.navigateTo({
      url: '/pages/wode/attention/attention?Yid=' + this.data.userID,
    })
  },
  navigateToCollect: function () {
    wx.navigateTo({
      url: '/pages/wode/collect/collect',
    })
  },
  // 最近浏览
  navigateToBrow: function () {
    wx.navigateTo({
      url: '/pages/wode/brow/brow',
    })
  },
  // 个人主页
  navigateToSelfInfo: function () {
    console.log("我是id：" + this.data.userID)
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + this.data.userID,
    })
  },
  // 我的发布
  navigateToProblem: function () {
    wx.navigateTo({
      url: '/pages/wode/secondPart/tieZi/problem',
    })
  },
  // 我的动态
  navigateToAnswer: function () {
    wx.navigateTo({
      url: '/pages/wode/secondPart/answer/answer?Yid=' + this.data.userID,
    })
  },

  // 我的粉丝
  navigateToBean: function () {
    wx.navigateTo({
      url: '/pages/wode/secondPart/bean/bean?Yid=' + this.data.userID,
    })
  },
  // 跳转到人气
  navigateToRenqi: function () {
    wx.navigateTo({
      url: '/pages/wode/secondPart/renqi/renqi',
    })
  },
  navigateToBox:function(){
    wx.navigateTo({
      url: '/pages/wode/secondPart/box/box',
    })
  }
})
