
var Util = require("../../../utils/util.js")
const app = getApp()
var inputVal = '';

// 用于保存所有对话的数组
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  // 数据添加模板：数组
  msgList = [
    //   {
    //   speaker: 'server',
    //   contentType: 'text',
    //   content: '欢迎来到英雄联盟，敌军还有30秒到达战场，请做好准备！'
    // },
    // {
    //   speaker: 'self',
    //   contentType: 'text',
    //   content: '你好，我是杨康...'
    // }
  ],

    that.setData({
      msgList,
      inputVal
    })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    inputString: " ",

    // 用户自己的头像
    selfHeader: " ",

    // 对象的id
    objectID1: 0,
    // 对象发送的消息
    ykMessage: null,
    // 对象头像
    headImage: " ",
    // 用户name
    name: " ",
    // time
    time: null,

    // 记录当前用户的聊天记录是否被获取过
    isLoadRecord: false,
    // 记录用户最新的一条聊天message
    newestMessage: {},
    // 聊天列表
    chatList: [],
    // 记录与当前用户id相同的聊天列表的位置
    sameID_inChatList: 0,
    // 第一句话的类型
    type: " ",
    // 记录最后一次发送数据时是不是自己发的
    lastMessageIsSelf: false

  },

  // 设计思路：到聊天界面时，先将携带过来的数据放入msgList用于显示，当用户有下拉的动作时，看作是获取聊天历史，到缓存获取并拼接到msgList
  // 前部。（无论用户是否获取聊天记录，都要去获取缓存拼接到msgList前部，用于更新缓存的聊天记录）

  onLoad: function (options) {
    msgList = []

    var that = this
    // Yid=' + userID + "&&message=" + userMessage + "&&headImage=" + head_portrait + "&&name=" + nick_name + "&&time=" + time
    // 接收上一页传过来的用户id和文字消息
    this.setData({
      objectID1: options.Yid,
      ykMessage: options.message,
      headImage: options.headImage,
      name: options.name,
      time: options.time,
      type: options.type
    })

    console.log("objectID1:" + this.data.objectID1)
    console.log("id:" + this.data.ykMessage)
    console.log("id:" + this.data.headImage)
    console.log("id:" + this.data.name)
    console.log("id:" + this.data.time)
    console.log("id:" + this.data.type)

    if (this.data.ykMessage != null) {
      msgList.push({
        speaker: this.data.type,
        contentType: 'text',
        content: this.data.ykMessage,
        time: this.data.time,
        success(res) {
          // 初始化界面
          initData(this);
        }
      })
      that.setData({
        msgList: msgList
      })
    }



    // // 到缓存获取当前要显示的第一条数据是哪边发的
    wx.getStorage({
      key: 'ykChatUserID',
      success(res) {
        var ykarrr = res.data
        that.setData({
          chatList: ykarrr
        })
      }
    })

    //     for (var i = 0; i < that.data.chatList.length; i++) {
    //       if (that.data.objectID1 == that.data.chatList[i].from_user) {
    //         that.setData({
    //           sameID_inChatList:i
    //         })
    //         if (that.data.chatList[i].speaker == "server") {
    //           console.log("我是server")
    //           msgList.push({
    //             speaker: 'server',
    //             contentType: 'text',
    //             content: that.data.ykMessage,
    //             time: that.data.time,
    //             success(res) {
    //               // 初始化界面
    //               initData(this);
    //             }
    //           })
    //           that.setData({
    //             msgList: msgList
    //           })
    //         } else {
    //           console.log("我是self")
    //           msgList.push({
    //             speaker: 'self',
    //             contentType: 'text',
    //             content: that.data.ykMessage,
    //             time: that.data.time,
    //             success(res) {
    //               // 初始化界面
    //               initData(this);
    //             }
    //           })
    //           that.setData({
    //             msgList: msgList
    //           })
    //         }
    //       }
    //       break
    //     }
    //   }
    // })

    for (var i = 0; i < msgList.length; i++) {
      console.log("我是msglist的message：" + msgList[i].content)
    }


    // 监听 WebSocket 接受到服务器的消息事件
    wx.onSocketMessage(function (data) {
      that.setData({
        lastMessageIsSelf: false
      })
      var a = JSON.parse(data.data)
      console.log("全局监听websocket:" + a.message)


      // 开始处理缓存聊天记录

      // 通过from_user对信息进行区分
      if (a.from_user == -1) {
        // from_user为-1，是各种通知，不会 重复
        app.globalData.allerMessageArray.push(a)
      } else {

        // 判断跟当前聊天界面的用户的id是否相等
        if (a.from_user == that.data.objectID1) {
          // 更新当前用户的message
          msgList.push({
            speaker: 'server',
            contentType: 'text',
            content: a.message,
            time: Util.timeFomat(a.time)
          })
        }

        // 取出记录用户聊天id的数组  缓存
        // ykChatUserID结构：message、UserID、time
        // console.log("websocket获取到的数据:" + )
        wx.getStorage({
          key: 'ykChatUserID',
          success(res) {
            app.globalData.ykChatUserID = res.data
            console.log("第一步：获取到聊天列表了")


            //有这个数组，获取当前聊天列表存储head
            wx.getStorage({
              key: "ykChatUserHead",
              success(res) {
                console.log(res.data)
                app.globalData.ykChatUserHead = res.data
                console.log("第二步：获取到聊天头了 ：" + res.data)

                // 在这里对聊天列表进行操作能保证缓存一定获取到了
                // 判断是否有重复的id
                var canPush = true
                if (app.globalData.ykChatUserID.length > 0) {

                  // 要改变的message的用户的位置
                  var changeUserMessage = 0
                  for (var i = 0; i < app.globalData.ykChatUserID.length; i++) {
                    if (a.from_user == app.globalData.ykChatUserID[i].from_user) {
                      canPush = false
                      changeUserMessage = i
                    }
                  }
                  // 数组中没有该用户,要将其保存到数组中；数组中有该用户，将发来的学校保存到对应的聊天数组
                  if (canPush) {
                    // 聊天列表最多保存50个人
                    if (app.globalData.ykChatUserID.length < 50) {
                      // 直接加到数组中
                      app.globalData.ykChatUserID.push({
                        from_user: a.from_user,
                        time: Util.timeFomat(a.time),
                        message: a.message,
                        speaker: 'server',
                        contentType: 'text',
                      })
                      app.globalData.ykChatUserHead = app.globalData.ykChatUserHead + 1
                    } else if (app.data.ykChatUserID.length == 50) {
                      app.globalData.ykChatUserHead = (app.globalData.ykChatUserHead + 1) % 50
                      // 将数组当前的这个项覆盖掉，覆盖之前相应的聊天记录要清除
                      wx.removeStorage({
                        key: String(app.data.ykChatUserID[app.globalData.ykChatUserHead].from_user),
                      })
                      app.data.ykChatUserID[app.globalData.ykChatUserHead].from_user = a.from_user
                      app.data.ykChatUserID[app.globalData.ykChatUserHead].time = a.time
                      app.data.ykChatUserID[app.globalData.ykChatUserHead].message = a.message
                      app.data.ykChatUserID[app.globalData.ykChatUserHead].speaker = 'server'
                      app.data.ykChatUserID[app.globalData.ykChatUserHead].contentType = 'text'
                    }

                    // 将队列的头保存到缓存
                    wx.setStorage({
                      data: app.globalData.ykChatUserHead,
                      key: "ykChatUserHead",
                      success() {
                        console("第三步：保存了缓存头")
                      }
                    })
                  } else {
                    console.log("第三步:id重复了，覆盖聊天列表的message")
                    app.globalData.ykChatUserID[changeUserMessage].message = a.message
                    app.globalData.ykChatUserID[changeUserMessage].time = Util.timeFomat(a.time)
                  }
                  console.log("数组长度大于0")
                } else {
                  // userID数组长度为0，直接加入到数组
                  console.log("数组长度==0")
                  console.log("信息：" + a.message)
                  app.globalData.ykChatUserID.push({
                    from_user: a.from_user,
                    time: Util.timeFomat(a.time),
                    message: a.message
                  })
                }

                // 将id数组保存
                if (true) {
                  wx.setStorage({
                    data: app.globalData.ykChatUserID,
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
                      app.globalData.ykChatMessage = res.data
                      // 将聊天保存到对应聊天数组
                      app.globalData.ykChatMessage.push({
                        speaker: 'server',
                        contentType: 'text',
                        content: a.message,
                        // 将的到的时间戳转化格式
                        time: Util.timeFomat(a.time),
                      })
                      // 保存
                      wx.setStorage({
                        data: app.globalData.ykChatMessage,
                        key: String(a.from_user),
                        success() {
                          console.log("存储对象：" + a.from_user)
                          console.log("第五部，缓存聊天记录")

                          // 不知道作用(更新界面)
                          that.setData({
                            msgList,
                            inputVal,
                            inputString: " "
                          });
                        }
                      })
                    },
                    fail(res) {
                      console.log("第五部，获取聊天记录失败")
                      // 将聊天保存到对应聊天数组
                      app.globalData.ykChatMessage.push({
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
                        data: app.globalData.ykChatMessage,
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
                  data: app.globalData.ykChatUserHead,
                  key: "ykChatUserHead",
                })
              }
            })
          },


          fail(res) {
            console.log("没有获取到聊天列表 ")

            app.globalData.ykChatUserID.push({
              from_user: a.from_user,
              time: Util.timeFomat(a.time),
              message: a.message
            })

            wx.setStorage({
              data: app.globalData.ykChatUserID,
              key: 'ykChatUserID',
            })
            // 聊天列表没有，聊天头应该也没有，现存
            wx.setStorage({
              data: app.globalData.ykChatUserHead,
              key: "ykChatUserHead",
            })
          }
        })

        console.log("缓存聊天列表的长度" + app.globalData.ykChatUserID.length)

      }
    })

    console.log("msgList数组长度：" + msgList.length)
    if (app) {
      that.setData({
        selfHeader: app.globalData.ykHeader,
      })
    }
  },

  /**
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })
  },


  // 发送消息（键盘的发送按键被点击时会触发此方法）
  sendClick: function (e) {
    var that = this
    var userID = that.data.objectID1

    this.setData({
      lastMessageIsSelf: true
    })
    // 向数组中添加对话
    var a = e.detail.value

    if (a != " ") {
      // 向对方发送数据（好像没办法讲data细化）

      // 时间，自己显示用
      var ykTime = new Date().getTime()
      var time = Util.timeFomat(ykTime)

      wx.sendSocketMessage({
        data: JSON.stringify({
          'to_user': that.data.objectID1,
          'message': a,
          'time': ykTime
        }),
        success(res) {
          // 在此更新聊天记录和聊天列表
          wx.getStorage({
            key: 'ykChatUserID',
            success(res) {
              app.globalData.ykChatUserID = res.data
              console.log("第一步：获取到聊天列表了")
              for (var i = 0; i < app.globalData.ykChatUserID.length; i++) {

                if (that.data.objectID1 == app.globalData.ykChatUserID[i].from_user) {
                  // console.log("2：" + a)
                  // console.log("2：" + e.detail.value)
                  // 发信息的对象判断是在上一个页面用聊天记录实现的
                  app.globalData.ykChatUserID[i].message = e.detail.value
                  app.globalData.ykChatUserID[i].time = time
                  app.globalData.ykChatUserID[i].speaker = 'self'


                  console.log("that.data.objectID1：" + userID)

                  wx.getStorage({
                    key: String(userID),
                    success(res) {
                      console.log("聊天界面 成功获取聊天记录")
                      app.globalData.ykChatMessage = res.data
                      // 将聊天保存到对应聊天数组
                      app.globalData.ykChatMessage.push({
                        speaker: 'self',
                        contentType: 'text',
                        content: e.detail.value,
                        // 将的到的时间戳转化格式
                        time: time,
                      })
                      // 保存
                      wx.setStorage({
                        data: app.globalData.ykChatMessage,
                        key: String(that.data.objectID1),
                        success() {
                          console.log("存储对象：" + that.data.objectID1)
                          console.log("聊天界面 缓存自己的聊天记录")

                        }
                      })
                    },
                    fail(res) {
                      console.log("第五部，获取聊天记录失败")
                      // 将聊天保存到对应聊天数组
                      app.globalData.ykChatMessage.push({
                        speaker: 'self',
                        contentType: 'text',
                        content: e.detail.value,
                        // 将的到的时间戳转化格式
                        time: time,
                      })
                      // 保存
                      wx.setStorage({
                        data: app.globalData.ykChatMessage,
                        key: String(that.data.objectID1),
                        success() {
                          console.log("聊天界面 缓存自己的聊天记录")
                        }
                      })
                    }
                  })

                }
              }
            }
          })


          that.setData({
            newestMessage: {
              to_user: that.data.objectID1,
              message: a,
              time: ykTime,
              speaker: 'self',
              contentType: 'text'
            }
          })


          console.log("发送成功")
          msgList.push({
            speaker: 'self',
            contentType: 'text',
            content: a,
            time: time
          })
        }
      })

      // 不知道作用(更新界面)
      inputVal = " ";
      this.setData({
        msgList,
        inputVal,
        inputString: " "
      });
    }
    a = " "
  },

  // 监听输入
  input(e) {
    this.setData({
      inputString: e.detail.value
    })

    console.log("我是：" + this.data.inputString)
  },


  // 跳转到用户信息页
  jumpToUser: function (e) {
    var id = e.target.id
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + id,
    })
  },

  jumpToSelf: function (e) {
    var id = e.target.id
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + id,
    })
  },


  //  * 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

    var that = this

    // 

    // 取出userID对应的聊天记录  缓存
    var record = null
    wx.getStorage({
      key: String(that.data.objectID1),
      success(res) {
        console.log("缓存的聊天记录：" + res.data.length)
        record = res.data
        // 向后拼接msgList
        record.concat(msgList)
        msgList = record
        that.setData({
          msgList,
        })
        console.log("msglist长度：" + msgList.length)
        wx.stopPullDownRefresh()
      }
    })


    this.setData({
      isLoadRecord: true
    })
  },

  // 当前页面被销毁
  onUnload: function () {
    var that = this

    if (that.data.lastMessageIsSelf) {
      // 最后一次数据是自己发的
      // 找到聊天列表中对应的用户，将其最新的message改为最后发的消息
      that.data.chatList[that.sameID_inChatList].message = that.data.newestMessage.message
      that.data.chatList[that.sameID_inChatList].time = that.data.newestMessage.time
      that.data.chatList[that.sameID_inChatList].speaker = that.data.newestMessage.speaker

      wx.setStorage({
        data: that.data.chatList,
        key: 'ykChatUserID',
        success(res) {
          console.log("保存成功")
        },
        fail(res) {
          console.log("保存失败")
        }
      })
    }



    console.log("保存失败")
    console.log("onUnload")

    // that.data.newestMessage.to_user = that.data.objectID1
    // that.data.newestMessage.message = a
    // that.data.newestMessage.time = ykTime
    // that.data.newestMessage.speaker = 'self'
    // that.data.newestMessage.contentType = 'text'

    if (this.data.isLoadRecord == false) {
      // 没有获取过数据
      // 取出userID对应的聊天记录  缓存
      var record = null
      wx.getStorage({
        key: String(that.data.objectID1),
        success(res) {
          console.log(res.data)
          record = res.data
          // 向后拼接msgList
          record.concat(msgList)
          msgList = record

        }
      })
    }

    // 更新缓存
    var that = this
    wx.setStorage({
      data: msgList,
      key: String(that.data.objectID1),
      success(res) {
        console.log("更新了缓存聊条记录")
        msgList = []
      }
    })
  },


})



