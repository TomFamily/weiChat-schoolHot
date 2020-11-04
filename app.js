//app.js
// var Util = require("");
var Util = require("utils/util.js")
App({
  data: {

    // 七牛云
    qiniu_domain1: 'https://hotschool.ltd/',//七牛图片外链域名
    // qiniu_uptoken: 'KVi-GMKgWZgHohIG9gHPTJdF4sctxfr6R4_ppssS:p3OoXwOk2x_GQcCvKI7V32GSVXs=:eyJzY29wZSI6InN1LWltYWdlcyIsImRlYWRsaW5lIjo0MDcwODgzNjYxfQ=='
  },
  globalData: {


  },

  // 小程序每次打开时一定会调用此函数
  onLaunch: function () {
    var that = this
    console.log("onLauch")
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log("getSeting")
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log("登录：" + res.userInfo)
              this.globalData.userInfo = res.userInfo


              // 到缓存获取用户信息
              wx.getStorage({
                key: 'ykInfo',
                success(res) {
                  console.log("我是缓存:" + res.data.token)
                  that.globalData.ykHeader = res.data.head_portrait
                  that.globalData.ykName = res.data.nick_name
                  that.globalData.selfID = res.data.id
                  that.globalData.token = res.data.token
                  // 学校id，等改接口
                  that.globalData.schoolID = res.data.school
                  // that.globalData.schoolID = 1
                  that.globalData.hasUserInfo = true

                  console.log("我是学校id：" + that.globalData.schoolID)

                  //开启websocket的连接
                  wx.connectSocket({
                    url: that.globalData.webSocket + that.globalData.token,
                    data: {},
                    method: "GET",
                    success: function (res) {
                      console.log("websocket成功连接了")
                    },
                    fail: function (res) {
                      console.log("websocket连接失败:" + res.data)
                    },
                  })
                  // 获取缓存的聊天列表
                  wx.getStorage({
                    key: 'ykChatUserID',
                    success(res) {
                      that.globalData.ykChatUserID = res.data
                    },
                    fail(res) {
                      console.log("读取用户信息是获取聊天缓存列表失败")
                    }
                  })
                }
              })

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // var that = this
    // if (that.globalData.userInfo != null) {

    // }



    // 监听 WebSocket 接受到服务器的消息事件
    wx.onSocketMessage(function (data) {
      var a = JSON.parse(data.data)
      console.log("全局监听websocket:" + a.message)


      // 开始处理缓存聊天记录

      // 通过from_user对信息进行区分
      if (a.from_user == -1) {
        // from_user为-1，是各种通知，不会 重复
        that.globalData.allerMessageArray.push(a)
      } else {

        // 取出记录用户聊天id的数组  缓存
        // ykChatUserID结构：message、UserID、time
        // console.log("websocket获取到的数据:" + )
        wx.getStorage({
          key: 'ykChatUserID',
          success(res) {
            that.globalData.ykChatUserID = res.data
            console.log("第一步：获取到聊天列表了")


            //有这个数组，获取当前聊天列表存储head
            wx.getStorage({
              key: "ykChatUserHead",
              success(res) {
                console.log(res.data)
                that.globalData.ykChatUserHead = res.data
                console.log("第二步：获取到聊天头了 ：" + res.data)

                // 在这里对聊天列表进行操作能保证缓存一定获取到了
                // 判断是否有重复的id
                var canPush = true
                if (that.globalData.ykChatUserID.length > 0) {

                  // 要改变的message的用户的位置
                  var changeUserMessage = 0
                  for (var i = 0; i < that.globalData.ykChatUserID.length; i++) {
                    if (a.from_user == that.globalData.ykChatUserID[i].from_user) {
                      canPush = false
                      changeUserMessage = i
                    }
                  }
                  // 数组中没有该用户,要将其保存到数组中；数组中有该用户，将发来的学校保存到对应的聊天数组
                  if (canPush) {
                    // 聊天列表最多保存50个人
                    if (that.globalData.ykChatUserID.length < 50) {
                      // 直接加到数组中
                      that.globalData.ykChatUserID.push({
                        from_user: a.from_user,
                        time: Util.timeFomat(a.time),
                        message: a.message,
                        speaker: 'server',
                        contentType: 'text',
                      })
                      that.globalData.ykChatUserHead = that.globalData.ykChatUserHead + 1
                    } else if (that.data.ykChatUserID.length == 50) {
                      that.globalData.ykChatUserHead = (that.globalData.ykChatUserHead + 1) % 50
                      // 将数组当前的这个项覆盖掉，覆盖之前相应的聊天记录要清除
                      wx.removeStorage({
                        key: String(that.data.ykChatUserID[that.globalData.ykChatUserHead].from_user),
                      })
                      that.data.ykChatUserID[app.globalData.ykChatUserHead].from_user = a.from_user
                      that.data.ykChatUserID[app.globalData.ykChatUserHead].time = a.time
                      that.data.ykChatUserID[app.globalData.ykChatUserHead].message = a.message
                      that.data.ykChatUserID[app.globalData.ykChatUserHead].speaker = 'server'
                      that.data.ykChatUserID[app.globalData.ykChatUserHead].contentType = 'text'
                    }

                    // 将队列的头保存到缓存
                    wx.setStorage({
                      data: that.globalData.ykChatUserHead,
                      key: "ykChatUserHead",
                      success() {
                        console("第三步：保存了缓存头")
                      }
                    })
                  } else {
                    console.log("第三步:id重复了，覆盖聊天列表的message")
                    that.globalData.ykChatUserID[changeUserMessage].message = a.message
                  }
                  console.log("数组长度大于0")
                } else {
                  // userID数组长度为0，直接加入到数组
                  console.log("数组长度==0")
                  console.log("信息：" + a.message)
                  that.globalData.ykChatUserID.push({
                    from_user: a.from_user,
                    time: Util.timeFomat(a.time),
                    message: a.message
                  })
                }

                // 将id数组保存
                if (true) {
                  wx.setStorage({
                    data: that.globalData.ykChatUserID,
                    key: 'ykChatUserID',
                    success() {
                      console.log("第四部：缓存聊天列表")
                    }
                  })

                  // 保存聊天记录：不管缓存中是否有该用户的聊天列表，都要将当前发来的消息保存到用id命名的缓存数组
                  // 获取
                  wx.getStorage({
                    key: String(a.from_user),
                    success(res) {
                      console.log("第五部，成功获取聊天记录")
                      that.globalData.ykChatMessage = res.data
                      that.globalData.ykChatMessage.push({
                        speaker: 'server',
                        contentType: 'text',
                        content: a.message,
                        // 将的到的时间戳转化格式
                        time: Util.timeFomat(a.time),
                        // 保存成功
                        success(res) {
                        }
                      })
                      // 保存
                      wx.setStorage({
                        data: that.globalData.ykChatMessage,
                        key: String(a.from_user),
                        success() {
                          console.log("存储对象：" + a.from_user)
                          console.log("第五部，缓存聊天记录")
                        }
                      })
                    },
                    fail(res) {
                      console.log("第五部，获取聊天记录失败")
                      // 将聊天保存到对应聊天数组
                      that.globalData.ykChatMessage.push({
                        speaker: 'server',
                        contentType: 'text',
                        content: a.message,
                        // 将的到的时间戳转化格式
                        time: Util.timeFomat(a.time),
                      })
                      // 保存
                      wx.setStorage({
                        data: that.globalData.ykChatMessage,
                        key: String(a.from_user),
                        success() {
                          console.log("存储对象：" + a.from_user)
                          console.log("第五部，缓存聊天记录")
                        }
                      })
                    }
                  })

                }
              },
              fail(res) {
                console.log("没有获取到聊天头 ")

                // 获取缓存头失败了，表示没有存储过，现存
                wx.setStorage({
                  data: that.globalData.ykChatUserHead,
                  key: "ykChatUserHead",
                })
              }
            })
          },


          fail(res) {
            console.log("没有获取到聊天列表")

            
            that.globalData.ykChatUserID.push({
              from_user: a.from_user,
              time: Util.timeFomat(a.time),
              message: a.message
            })

            wx.setStorage({
              data: that.globalData.ykChatUserID,
              key: 'ykChatUserID',
            })
            // 聊天列表没有，聊天头应该也没有，现存
            wx.setStorage({
              data: that.globalData.ykChatUserHead,
              key: "ykChatUserHead",
            })
          }
        })

        console.log("缓存聊天列表的长度" + that.globalData.ykChatUserID.length)

      }
    })
  },




  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 小程序全局存储
  globalData: {
    userInfo: null,
    token: null,
    // 个人信息
    ykHeader: null,
    ykName: null,
    // 记录websocket的URL
    // webSocket: 'ws://192.168.43.140:8000/ws/chat?',
    // ykUrl: 'http://192.168.43.140:8000/',

    // 校园网
    webSocket: 'wss://www.schoolhot.com/ws/chat?',
    ykUrl: 'https://www.schoolhot.com/',
    selfID: null,

    // 记录文章的id，方便获取详细信息
    titleID1: 0,
    // 表名是由美食页跳转到发布页
    isMeishiJump: false,
    isLogin: false,
    // 记录学校的id，如果为1，则默认为没有填写学校信息。学校名也是如此（记录搜索框搜索学校的结果）
    schoolID: 0,
    schoolName: null,

    // 保存websocket接收到的数据：(没有头像)
    // websocketMessage: [],
    // 保存websocket接收到的数据：(有头像) 在聊天列表界面操作的数组
    websocketMessage1: [],
    // 将websocket信息拼接后的数组
    lastArray: [],
    // 保存各种通知的数组
    allerMessageArray: [],

    // 开始存储聊天记录(保存有记录的用户的id) 缓存
    ykChatUserID: [],
    // 保存对应用户的聊天列表
    ykChatMessage: [],
    // 当前聊天列表存储head
    ykChatUserHead: 0,

    // 保存用户聊天记录的临时数组（缓存）
    ykChatMessage2: [],
    // 判断用户是否登录
    hasUserInfo: false
  }
})