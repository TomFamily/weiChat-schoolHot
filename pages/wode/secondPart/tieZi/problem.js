// pages/wode/collect/collect.js
const app = getApp()
Page({

  data: {
    collectArray: [
      { name: '话题', id: 1, type: 1 },
      { name: '美食', id: 0, type: 0 },
      { name: '美食', id: 0, type: 0 },
      { name: '美食', id: 1, type: 1 },
      { name: '美食', id: 0, type: 0 },
      { name: '美食', id: 2, type: 2 },
      { name: '美食', id: 3, type: 3 },
      { name: '美食', id: 3, type: 3 },
    ],
    // 保存数据
    div: {},
    collectArray2: [],
    hasInfo: false,
    tapID: 0,
    sLIst: [
      { name: '回答', id: 0 },
      { name: '话题', id: 1 },
      { name: '评论', id: 2 },
      { name: '美食', id: 3 },
    ],
    token: null,
    // nextUrl
    nextUrl: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      token: app.globalData.token
    })
    // 去数据库获取收藏
    wx.request({
      url: app.globalData.ykUrl + "user/publish?type=" + this.data.tapID,
      header: {
        Authorization: app.globalData.token
      },
      method: 'GET',
      dataType: 'JSON',
      responseType: 'text',
      data: {},
      responseType: 'text',
      success: (res) => {
        that.setData({
          div: res.data
        })
        console.log(res.data)
        that.setData({
          collectArray2: JSON.parse(that.data.div).results,
          nextUrl: JSON.parse(that.data.div).next
        })
        if (that.data.collectArray2.length == 0) {
          this.setData({
            hasInfo: false
          })
        } else {
          this.setData({
            hasInfo: true,
          })
        }
      },
    })
  },

  // 跳转到回答
  juamToDetail: function (e) {
    console.log("id:" + e.target.id)
    // 获取文章标识
    wx.navigateTo({
      url: '/pages/index/tuijanDetail/tuijanDetail?articleID=' + e.target.id,
    })
  },

  // 跳转到话题
  juamToArticle: function (e) {
    console.log("id:" + e.target.id)
    // 获取文章标识
    wx.navigateTo({
      url: '/pages/index/tuijanDetail2/tuijanDetail2?articleID=' + e.target.id,
    })
  },
  // 跳转到评论
  jumpToPinlun: function (e) {
    wx.navigateTo({
      url: '/pages/index/tuijanDetail3/pinglun/pinglun?articleID=' + e.target.id,
    })
  },
  // 跳转到美食
  juamToDetail2: function (e) {
    // 获取文章标识
    console.log("id:" + e.target.id)
    wx.navigateTo({
      url: '/pages/index/detail/detail?articleID=' + e.target.id,
    })
  },

  // 头部导航栏被点击
  headerTitleClick: function (e) {
    var that = this
    this.setData({
      tapID: e.target.dataset.id,
    })
    console.log("我是：" + e.target.dataset.id)

    // 去数据库获取收藏
    wx.request({
      url: app.globalData.ykUrl + "user/publish?type=" + this.data.tapID,
      header: {
        Authorization: this.data.token
      },
      method: 'GET',
      dataType: 'JSON',
      responseType: 'text',
      data: {},
      responseType: 'text',
      success: (res) => {
        that.setData({
          div: res.data
        })
        console.log(res.data)
        that.setData({
          collectArray2: JSON.parse(that.data.div).results,
          nextUrl: JSON.parse(that.data.div).next
        })
        if (that.data.collectArray2.length == 0) {
          this.setData({
            hasInfo: false
          })
        } else {
          this.setData({
            hasInfo: true,
          })
        }
      },
    })
  },

  //  * 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log("到底了")

    if (this.data.nextUrl != null) {
      wx.request({
        url: this.data.nextUrl,
        header: {
          Authorization: this.data.token
        },
        method: 'GET',
        dataType: 'JSON',
        responseType: 'text',
        data: {},
        responseType: 'text',
        success: (res) => {
          that.setData({
            div: res.data
          })
          console.log(res.data)
          that.setData({
            collectArray2: this.data.collectArray2.concat(JSON.parse(that.data.div).results),
            nextUrl: JSON.parse(that.data.div).next
          })
        },
      })
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: "none"
      })
    }
  },

  // 删除功能
  delete: function (e) {
    var id = e.target.id
    var that = this
    console.log("回答id:" + id)

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

          if (that.data.tapID == 0) {
            // 回答
            wx.request({
              url: app.globalData.ykUrl + "question/answer?answer=" + id,
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

                  for (var i = 0; i < that.data.collectArray2.length; i++) {
                    if (that.data.collectArray2[i].id = id) {
                      that.data.collectArray2.splice(i, 1)
                      that.setData({
                        collectArray2: that.data.collectArray2
                      })
                      break
                    }
                  }

                } else {
                  console.log("错误消息：" + res.data.error)
                }
              },
            })
          } else if (that.data.tapID == 2) {
            // 评论
            wx.request({
              url: app.globalData.ykUrl + "question/comment?comment=" + id,
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
                } else {
                  console.log("错误消息：" + res.data.error)
                }
              },
            })
          }

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