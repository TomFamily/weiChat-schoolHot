// pages/index/tuijanDetail3/pinglun/pinglun.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    JhuifuList: [
      { id: 1 },
      { id: 1 }
    ],
    huifuList: [
      { id: 1 },
      { id: 1 },
      { id: 1 },
    ],

    // 记录回答的id
    answerID: 0,
    // 评论
    Div: {},
    commentData: [],
    // nextUrl 
    nextUrl: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 传递过来的文章id
    let { articleID } = options
    this.setData({
      answerID: articleID
    })

    this.requestInfo()
  },
  // 写评论
  writePinglun: function () {
    // （1：评论 2：回复 3：短评(评分) 4：美食讨论的评论）
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
        url: '/pages/fabu/comment/rich-text?articleID=' + this.data.answerID + "&&type=1",
      })
    }
  },

  // 共用函数：请求数据
  requestInfo: function () {
    wx.request({
      url: app.globalData.ykUrl + "question/comment?answer=" + this.data.answerID,
      header: {
        Authorization: app.globalData.token,
      },
      dataType: 'json',
      data: {
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        this.setData({
          commentData: res.data.results,
          nextUrl: res.data.next
        })
        console.log("评论的赞同状态：" + this.data.commentData[0].is_approval)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },

  // 点赞
  dianzan: function (e) {
    var id = e.target.id
    if (this.data.commentData.length > 0) {
      for (var i = 0; i < this.data.commentData.length; i++) {
        if (this.data.commentData[i].id == id) {

          var ykAttantion = this.data.commentData[i].is_approval

          wx.request({
            url: app.globalData.ykUrl + "operation/approval?comment=" + id,
            header: {
              Authorization: app.globalData.token,
            },
            method: 'GET',
            responseType: 'text',
            success: (res) => {

              if (res.data.status == "ok") {
                if (ykAttantion == 1) {
                  wx.showToast({
                    title: "取消点赞",
                    icon: "none",
                    mask: false,
                    duration: 1000
                  })
                } else {
                  wx.showToast({
                    title: "点赞成功",
                    icon: "none",
                    mask: false,
                    duration: 1000
                  })
                }
              }
              console.log("喜欢：" + res.data.status)

            },
            fail: function (res) { },
            complete: function (res) {
            },
          })
        }
      }
    }


  },

  // 查看回复
  jumpToHuifu: function (e) {
    // 找到评论id对应的用户id
    // 评论id
    var id = e.target.id
    // var user = 0
    if (this.data.commentData.length > 0) {
      for (var i = 0; i < this.data.commentData.length; i++) {
        if (id == this.data.commentData[i].id) {
          var user = this.data.commentData[i].user

          console.log("评论到回复的ID：" + id)
          console.log("评论到回复的userID：" + user)
          // 评论者的id
          wx.navigateTo({
            url: '/pages/index/tuijanDetail3/pinglun/huifu/huifu?articleID=' + id + "&articleID2=" + user,
          })

          break
        }
      }
    }
  },


  //  * 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log("到底了")
    if (this.data.nextUrl != null) {
      wx.request({
        url: this.data.nextUrl,
        header: {
          Authorization: app.globalData.token,
        },
        dataType: 'json',
        data: {
        },
        method: 'GET',
        responseType: 'text',
        success: (res) => {
          this.setData({
            commentData: this.data.commentData.concat(res.data.results),
            nextUrl: res.data.next
          })
          console.log("评论的赞同状态：" + this.data.commentData[0].is_approval)
        },
      })
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: "none"
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})