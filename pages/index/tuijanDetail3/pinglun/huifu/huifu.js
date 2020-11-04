// pages/index/tuijanDetail3/pinglun/huifu/huifu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 记录评论的id
    plunID: 0,
    plunUserID: 0,
    // 回复info
    Div: {},
    huifuList: [],
    // nextUrl
    nextUrl: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      plunID: options.articleID,
      plunUserID: options.articleID2
    })
    console.log("评论的id:" + this.data.plunUserID)

    this.requestYK()

  },

  // 请求数据函数
  requestYK: function () {
    wx.request({
      url: app.globalData.ykUrl + "question/revert?comment=" + this.data.plunID,
      header: {
        Authorization: app.globalData.token,
      },
      dataType: 'json',
      data: {},
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        this.setData({
          huifuList: res.data.results,
          nextUrl: res.data.next
        })

        console.log("回答数组：" + res.data.results)

      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },

  // 写回复
  writeHuifu: function () {
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
      console.log("回复页的targetID：" + this.data.plunUserID)
      wx.navigateTo({
        url: '/pages/fabu/comment/rich-text?articleID=' + this.data.plunID + "&&articleID2=" + this.data.plunUserID + "&&type=2",
      })
    }
  },

  // 写回复2
  writePinLun2: function (e) {
    // 回复id
    var Aid = this.data.id
    // 对应回复的用户的id
    var userID = e.target.user
    wx.navigateTo({
      url: '/pages/fabu/comment/rich-text?articleID=' + Aid + "&articleID2" + userID,
    })
  },

  // 点赞
  dianzan: function (e) {
    var id = e.target.id
    console.log("我是回复id：" + id)
    if (this.data.huifuList.length > 0) {
      for (var i = 0; i < this.data.huifuList.length; i++) {
        if (this.data.huifuList[i].id == id) {

          var ykAttantion = this.data.huifuList[i].is_approval

          wx.request({
            url: app.globalData.ykUrl + "operation/approval?revert=" + id,
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
        console.log("不相同")

      }
    }
  },

  // 跳转到用户信息页
  jumpToUser: function (e) {
    var id = e.target.id
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + id,
    })
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
        data: {},
        method: 'GET',
        responseType: 'text',
        success: (res) => {
          this.setData({
            huifuList: this.data.huifuList.concat(res.data.results),
            nextUrl: res.data.next
          })
          console.log("回答数组：" + res.data.results)
        },
      })
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: "none"
      })
    }
  },

  delete:function(e){
    var id = e.target.id 
    var that = this

    // 用户没有登录，让他去登录
    wx.showModal({
      // title: "温馨提示", // 提示的标题
      content: "确定要删除所发布的内容吗？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确认删除", // 确认按钮的文字，最多4个字符
      confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        // console.log("接口调用成功的回调函数");
        if (res.confirm) {
          console.log('用户点击确定')

            // 回答
            wx.request({
              url: app.globalData.ykUrl + "question/revert?revert=" + id,
              header: {
                Authorization: app.globalData.token,
              },
              dataType: 'json',
              data: {},
              method: 'DELETE',
              responseType: 'text',
              success: (res) => {
                if (res.data.status == "ok") {
                  wx.showToast({
                    title: '删除成功',
                    icon: "none"
                  })
                  for(var i = 0;i < that.data.huifuList.length;i++){
                    if(that.data.huifuList[i].id = id){
                      that.data.huifuList.splice(i,1)
                      that.setData({
                        huifuList:that.data.huifuList
                      })
                      break
                    }
                  }
                } else {
                  console.log("错误消息：" + res.data.error)
                }
              },
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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