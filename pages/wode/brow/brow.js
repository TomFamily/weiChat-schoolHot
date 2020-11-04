// pages/wode/brow/brow.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    browArray: [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ],
    // 存储数据
    browArray2: [],
    div: {},
    hasInfo: false,
    // nextUrl
    nextUrl: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    // 去数据库获取浏览记录
    wx.request({
      url: app.globalData.ykUrl + "user/recentbrowse",
      header: {
        Authorization: app.globalData.token
      },
      method: 'GET',
      // 返回的数据类型
      dataType: 'JSON',
      // 响应的数据类型
      responseType: 'text',
      data: {
      },
      responseType: 'text',
      success: (res) => {
        that.setData({
          div: res.data
        })
        that.setData({
          browArray2: JSON.parse(that.data.div).results,
          nextUrl: JSON.parse(that.data.div).next
        })

        if (that.data.browArray2.length == 0) {
          // 再屏幕中间显示没有关注的人的图
          this.setData({
            hasInfo: false
          })
        } else {
          that.setData({
            hasInfo: true
          })
          console.log("我是数组：" + that.data.browArray2)
        }
      },
    })
  },

  juamToDetail: function (e) {
    console.log("id:" + e.target.id)

    // 获取文章标识
    wx.navigateTo({
      url: '/pages/index/tuijanDetail/tuijanDetail?articleID=' + e.target.id,
    })
  },


  //  * 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log("到底了")
    if (this.data.nextUrl != null) {
      var that = this
      // 去数据库获取浏览记录
      wx.request({
        url: this.data.nextUrl,
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
          that.setData({
            browArray2: this.data.browArray2.concat(JSON.parse(that.data.div).results),
            nextUrl: JSON.parse(that.data.div).next
          })
        },
      })
    }else{
      wx.showToast({
        title: '没有更多数据',
        icon:"none"
      })
    }
  },

  shanchu:function(e){
    var id = e.target.id 
    var that = this
    console.log("点击删除")

    wx.request({
      url: app.globalData.ykUrl + "user/recentbrowse",
      header: {
        Authorization: app.globalData.token
      },
      method: 'DELETE',
      dataType: 'JSON',
      responseType: 'text',
      data: {
        answer_record_list:[id],
      },
      responseType: 'text',
      success: (res) => {
        // if(res.data.status == "ok"){
          wx.showToast({
            title: '删除成功',
            icon:"none"
          })

          for(var i = 0;i < that.data.browArray2.length;i++){
            that.data.browArray2.splice(i,1)
            that.setData({
              browArray2:that.data.browArray2
            })
          }

        // }
      },
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