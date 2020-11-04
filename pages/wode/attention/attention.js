// pages/wode/attention/attention.js
const app = getApp()
Page({

  data: {
    sLIst: [
      { name: '关注', id: 0 },
      { name: '粉丝', id: 1 },
    ],
    tapID:0,

    // 保存数据
    div: {},
    myAttentionPeople2: [],
    hasInfo: false,
    isGuanzhu: '已关注',
    isGuanzhu2: true,
    // nextUrl
    nextUrl: null,
    userID:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 传递过来的URL
    let { Yid } = options
    console.log("yk的Yid:" + Yid)
    this.setData({
      userID:Yid
    })


    // 去数据库获取关注的人
    wx.request({
      url: app.globalData.ykUrl + "user/attention/" + that.data.userID + "?type=" + that.data.tapID,
      header: {
        Authorization: app.globalData.token
      },
      method: 'GET',
      // 返回的数据类型
      dataType: 'JSON',
      data: {},
      responseType: 'text',
      success: (res) => {
        if (res.data.length == 0) {
          // 再屏幕中间显示没有关注的人的图
          this.setData({
            hasInfo: false
          })
        } else {
          this.setData({
            div: res.data,
            hasInfo: true
          })
          this.setData({
            myAttentionPeople2: JSON.parse(this.data.div).results,
            nextUrl: JSON.parse(this.data.div).next
          })
          console.log("我是nextURL：" + this.data.nextUrl)
        }
      },
    })
  },

  // 获取关注的人的详细信息
  peopleInfo: function (e) {
    console.log("id:" + e.target.id)
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + e.target.id,
    })
  },

  // 取消关注
  attentionClickde: function (e) {
    var id = e.target.id

    var that = this
    if (that.data.isGuanzhu2 == true) {
      // 要取消关注
      wx.showModal({
        // title: "温馨提示", // 提示的标题
        content: "确定取消对该用户的关注吗？", // 提示的内容
        showCancel: true, // 是否显示取消按钮，默认true
        cancelText: "取消", // 取消按钮的文字，最多4个字符
        cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
        confirmText: "确定", // 确认按钮的文字，最多4个字符
        confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
        success: function (res) {
          if (res.confirm) {
            // 循环找到该用户
            for (var i = 0; i < that.data.myAttentionPeople2.length; i++) {
              if (that.data.myAttentionPeople2[i].id == id) {
                var isAttention = that.data.myAttentionPeople2[i].is_attention
                wx.request({
                  url: app.globalData.ykUrl + "operation/attention?target=" + id,
                  header: {
                    Authorization: app.globalData.token
                  },
                  success: (res) => {

                    if (res.data.status == 'ok') {
                      that.data.myAttentionPeople2.splice(i,1)
                      that.setData({
                        myAttentionPeople2:that.data.myAttentionPeople2
                      })
                      console.log("回调：" + res.data.status)
                      // 去数据库重新获取关注的人的list
                      that.onLoad()
                    }
                  },
                })
              }
            }
          }
        },
      })
    }
  },

  // 点击头部导航栏
  headerTitleClick: function (e) {
    var that = this
    this.setData({
      tapID: e.target.dataset.id,
      myAttentionPeople2:[]
    })
    console.log("我是：" + e.target.dataset.id)

    wx.request({
      url: app.globalData.ykUrl + "user/attention/" + that.data.userID + "?type=" + that.data.tapID,
      header: {
        Authorization: app.globalData.token
      },
      method: 'GET',
      // 返回的数据类型
      dataType: 'JSON',
      data: {},
      responseType: 'text',
      success: (res) => {
        if (res.data.length == 0) {
          // 再屏幕中间显示没有关注的人的图
          this.setData({
            hasInfo: false
          })
        } else {
          this.setData({
            div: res.data,
            hasInfo: true
          })
          this.setData({
            myAttentionPeople2: JSON.parse(this.data.div).results,
            nextUrl: JSON.parse(this.data.div).next
          })
          console.log("我是nextURL：" + this.data.nextUrl)
        }
      },
    })

  },

  //  * 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log("到底了")
    if (this.data.nextUrl != null) {
      var that = this
      wx.request({
        url: this.data.nextUrl,
        header: {
          Authorization: app.globalData.token
        },
        method: 'GET',
        dataType: 'JSON',
        data: {},
        responseType: 'text',
        success: (res) => {
          this.setData({
            div: res.data,
            hasInfo: true
          })
          this.setData({
            myAttentionPeople2: this.data.myAttentionPeople2.concat(JSON.parse(this.data.div).results),
            nextUrl: JSON.parse(this.data.div).next
          })
          console.log("我是nextURL：" + this.data.nextUrl)
        },
      })
    }else{
      wx.showToast({
        title: '没有更多数据',
        icon:"none"
      })
    }
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