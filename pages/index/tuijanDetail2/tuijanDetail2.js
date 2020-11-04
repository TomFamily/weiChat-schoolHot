// pages/index/tuijanDetail2/tuijanDetail2.js
const wxParse = require("../../../components/wxParse/wxParse.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pinglunList: [
      { id: 1 },
      { id: 1 },
      { id: 1 },
      { id: 1 }
    ],
    // 排序方式
    sortText: '默认排序',
    sortNumber: 0,
    sort1: true,
    // 问题数据(外层：字典  问题：字典  回答：数组)
    Div: {},
    questionInfo: {},
    answerInfo: [],
    nextUrl: null,
    // 问题内容
    answerInfor2: " ",
    answerInfor: " ",
    // 问题的id
    questionID: null,
    // 是否关注过该话题
    isAttention1: 1,
    isAttention: "关注话题",
    // 监听是第几次获取数据，只有第一次才用获取问题标题
    // requestNumber: 1,
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    this.setData({
      questionID: options.articleID
    })
    console.log("问题id：" + this.data.questionID)
    console.log("token：" + app.globalData.token)
    // 调用方法
    this.ykMethod()

  },

  // 切换回答的排序方式
  sort: function () {
    console.log("被点击了")


    if (this.data.sort1 == true) {
      console.log("被点击了2")
      this.data.sort1 = false,
        this.setData({
          sortText: '按时间排序',
          sortNumber: 1
        })
      console.log(this.data.sortText)
    } else {
      console.log("被点击了3")
      this.data.sort1 = true,
        this.setData({
          sortText: '默认排序',
          sortNumber: 0
        })
      console.log(this.data.sortText)
    }
    this.ykMethod()
  },
  // 跳转到问题详情页
  jump: function (e) {
    var id = e.target.id
    wx.navigateTo({
      url: '/pages/index/tuijanDetail3/tuijanDetail3?articleID=' + id +"&&type=" + this.data.sortNumber,
    })
  },

  // 写回答
  writeComment: function (e) {
    var id = e.target.id
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


  //  * 页面上拉触底事件的处理函数
  onReachBottom: function () {
    var that = this
    // 触及到底部
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

          that.setData({
            // questionInfo: res.data.question,
            // answerInfor: res.data.question.content,
            nextUrl: res.data.next,
            answerInfo: that.data.answerInfo.concat(res.data.answer),
          })
          // var a = JSON.parse(that.data.answerInfor)
          // that.setData({
          //   answerInfor2: a
          // })
          // wxParse.wxParse('newsDetailData', 'html', a, that)
          // console.log("状态码：" + that.data.answerInfor)
          // if (that.data.questionInfo.is_collect == 0) {
          //   // 没有关注过
          //   that.setData({
          //     isAttention: "关注话题"
          //   })
          // } else {
          //   that.setData({
          //     isAttention: "已关注"
          //   })
          // }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: "none"
      })
    }


  },

  // 获取数据
  ykMethod: function () {
    console.log("ykMethod被调用了")
    var that = this
    console.log("url:" + app.globalData.ykUrl + "question?question=" + that.data.questionID + "&type=" + that.data.sortNumber)

    // 获取问题详情
    wx.request({
      url: app.globalData.ykUrl + "question?question=" + that.data.questionID + "&type=" + that.data.sortNumber,
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
          answerInfo: []
        })

        // if (that.data.requestNumber == 1) {
        that.setData({
          questionInfo: res.data.question,
          answerInfor: res.data.question.content,
          nextUrl: res.data.next,
          answerInfo: res.data.answer,
        })

        console.log("json格式：" + res.data.question.content)

        var a = JSON.parse(that.data.answerInfor)
        that.setData({
          answerInfor2: a
        })
        console.log("json格式：" + a)

        wxParse.wxParse('newsDetailData', 'html', a, that)


        console.log("状态码：" + that.data.answerInfor)



        if (that.data.questionInfo.is_collect == 0) {
          // 没有关注过
          that.setData({
            isAttention: "关注话题"
          })
        } else {
          that.setData({
            isAttention: "已关注"
          })
        }

      },
      fail: function (res) { },
      complete: function (res) {
      },
    })

  },

  // 操作：关注话题
  Attention: function (e) {
    var id = e.target.id
    // 查看用户是否关注过该话题
    wx.request({
      url: app.globalData.ykUrl + "operation/collect?question=" + id,
      header: {
        Authorization: app.globalData.token,
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        if (res.data.status == "ok") {
          // 关注成功
          if (this.data.isAttention == "关注话题") {
            this.setData({
              isAttention: "已关注"
            })
          } else {
            this.setData({
              isAttention: "关注话题"
            })
          }
        }
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },
  // 查看自己的回答
  checkSelf: function () {
    wx.navigateTo({
      url: '/pages/index/tuijanDetail3/tuijanDetail3?articleID=' + this.data.questionInfo.has_answer_id,
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