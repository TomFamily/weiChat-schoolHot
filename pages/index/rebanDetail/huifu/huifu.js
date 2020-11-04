// pages/index/tuijanDetail/tuijanDetail.js
const wxParse = require("../../../../components/wxParse/wxParse.js")
const app = getApp()
Page({

  data: {
    // 回答数据
    Div: {},
    contentData: {},
    // 回答内容
    answerInfor: " ",
    answerInfor2: " ",
    // 回答的id
    titleID: 0,
    // 问题的id (没有获取到)
    questionID: 0,
    // 判断是否喜欢
    isLike: false,
    // 判断是否收藏
    isShoucang: false,
    // 是否点赞(0:没有表态，1：赞同 -1：反对)
    isDianzan: false,
    nextAswerID: 0,
    // 反对
    isOppose: false,
    // 点赞数
    approval_number: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 传递过来的文章id
    let { articleID } = options
    this.setData({
      titleID: articleID
    })

    // console.log("我是回答id：" + articleID)
    // 获取文章详情
    wx.request({
      url: app.globalData.ykUrl + "question/answer?answer=" + that.data.titleID,
      header: {
        Authorization: app.globalData.token
      },
      success: function (res) {
        that.setData({
          contentData: res.data.result,
          nextAswerID: res.data.next,
          answerInfor: res.data.result.content,
        })

        var a = JSON.parse(that.data.answerInfor)
        console.log("我是html: " + a)
        wxParse.wxParse('newsDetailData', 'html', a, that)
        that.setData({
          answerInfor2: a
        })
        // 判断用户是否喜欢、收藏、点赞
        console.log("我是收藏状态：" + res.data.result.is_collect)
        if (res.data.result.is_collect == 1) {
          // 收藏过 了
          that.setData({
            isShoucang: true
          })
        }
        if (that.data.contentData.is_like == 1) {
          // 收藏过 了
          that.setData({
            isLike: true
          })
        }
        if (that.data.contentData.is_approval == 1) {
          // 点赞
          that.setData({
            isDianzan: true
          })
        }else if (that.data.contentData.is_approval == 0) {
          // 点赞
          that.setData({
            isOppose: true
          })
        }
      },
    })
  },

  nextAnswer: function () {
    var that = this;
    console.log("我是nextID：" + that.data.nextAswerID)
    // 获取文章详情
    wx.request({
      url: app.globalData.ykUrl + "question/answer?answer=" + that.data.nextAswerID,
      header: {
        Authorization: app.globalData.token
      },
      success: function (res) {
        that.setData({
          contentData: res.data.result,
          nextAswerID: res.data.next,
          answerInfor: res.data.result.content,
        })

        var a = JSON.parse(that.data.answerInfor)
        console.log("我是html: " + a)
        wxParse.wxParse('newsDetailData', 'html', a, that)
        that.setData({
          answerInfor2: a
        })
        // 判断用户是否喜欢、收藏、点赞
        // console.log("我是收藏状态：" + res.data.result.is_collect)
        if (res.data.result.is_collect == 1) {
          // 收藏过 了
          that.setData({
            isShoucang: true
          })
        }
        if (that.data.contentData.is_like == 1) {
          // 收藏过 了
          that.setData({
            isLike: true
          })
        }
        if (that.data.contentData.is_approval == 1) {
          // 点赞
          that.setData({
            isDianzan: true
          })
        }
      },
    })
  },

  // 写回答
  writeComment: function (e) {
    var id = e.target.question
    if (app.globalData.hasUserInfo == false) {
      // 用户没有登录，让他去登录
      wx.showModal({
        // title: "温馨提示", // 提示的标题
        content: "登录后才能发布文章哦！", // 提示的内容
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
        url: '/pages/fabu/answer/rich-text?articleID=' + id,
      })
    }
  },

  // 跳转到评论
  jump2: function (e) {
    var titleID = e.target.id
    wx.navigateTo({
      url: '/pages/index/tuijanDetail3/pinglun/pinglun?articleID=' + titleID,
    })
  },

  // 收藏
  isCollect: function (e) {

    // console.log("我是自己的回答id：" + this.data.contentData)
    console.log("我是自己的回答id：" + this.data.contentData.has_answer_id)

    var id = e.target.id
    wx.request({
      url: app.globalData.ykUrl + "operation/collect?answer=" + id,
      header: {
        Authorization: app.globalData.token,
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        if (res.data.status == "ok") {
          if (this.data.isShoucang) {
            this.setData({
              isShoucang: false
            })
          } else {
            this.setData({
              isShoucang: true
            })
          }
        }
        console.log("喜欢：" + res.data.status)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },

  // 喜欢
  isLike: function (e) {
    var id = e.target.id
    wx.request({
      url: app.globalData.ykUrl + "operation/like?answer=" + id,
      header: {
        Authorization: app.globalData.token,
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        if (res.data.status == "ok") {
          if (this.data.isLike) {
            this.setData({
              isLike: false
            })
          } else {
            this.setData({
              isLike: true
            })
          }
        }
        console.log("喜欢：" + res.data.status)
      }
    })
  },

  // 点赞
  // isApprve: function (e) {
  //   var id = e.target.id
  //   wx.request({
  //     url: app.globalData.ykUrl + "operation/approval?answer=" + id + "&type=0",
  //     header: {
  //       Authorization: app.globalData.token,
  //     },
  //     method: 'GET',
  //     responseType: 'text',
  //     success: (res) => {
  //       if (res.data.status == "ok") {
  //         if (this.data.isDianzan) {
  //           this.setData({
  //             isDianzan: false
  //           })
  //         } else {
  //           this.setData({
  //             isDianzan: true
  //           })
  //         }
  //       }
  //       console.log("喜欢：" + res.data.status)
  //     }
  //   })
  // },

  // 点赞
  isApprve: function (e) {
    var id = e.target.id
    var that = this
    console.log("喜欢被调用")

    if (this.data.isOppose) {
      wx.showToast({
        title: '反对状态下不能点赞！',
        icon: "none"
      })
    } else {
      wx.request({
        url: app.globalData.ykUrl + "operation/approval?answer=" + id + "&type=1",
        header: {
          Authorization: app.globalData.token,
        },
        method: 'GET',
        responseType: 'text',
        success: (res) => {
          if (res.data.status == "ok") {
            if (this.data.isDianzan) {
              this.setData({
                isDianzan: false,
                approval_number: that.data.approval_number - 1
              })
            } else {
              this.setData({
                isDianzan: true,
                approval_number: that.data.approval_number + 1
              })
              if (this.data.isOppose) {
                this.setData({
                  isOppose: false
                })
              }
            }
          }
          console.log("喜欢：" + res.data.status)
        }
      })
    }

  },

  // 反对
  isOppose: function (e) {
    console.log("反对被调用了")
    var that = this


    var id = e.target.id
    wx.request({
      url: app.globalData.ykUrl + "operation/approval?answer=" + id + "&type=0",
      header: {
        Authorization: app.globalData.token,
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        console.log("我是反对返回的状态：" + res.data.status)
        if (res.data.status == "ok") {
          if (this.data.isOppose) {
            this.setData({
              isOppose: false
            })
          } else {
            this.setData({
              isOppose: true
            })
            if (this.data.isDianzan) {
              this.setData({
                isDianzan: false,
                approval_number: that.data.approval_number - 1
              })
            }
          }
        }
      }
    })
  },

  checkSelf: function () {

    if (this.data.contentData.is_author == 1) {
      // 当前就是作者的回答
      wx.showToast({
        title: '当前已是自己的回答',
        icon: "none"
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/tuijanDetail3/tuijanDetail3?articleID=' + this.data.contentData.has_answer_id,
      })
    }
  },

  // 跳转到用户信息页
  jumpToPeplo: function (e) {
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + e.target.id,
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