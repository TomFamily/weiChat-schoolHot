// pages/wode/brow/brow.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sLIst: [
      { name: '回答', id: 0 },
      { name: '美食', id: 1 },
    ],
    browArray: [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ],
    tapID:0,
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
      url: app.globalData.ykUrl + "draft/mydraft?type=" + this.data.tapID,
      header: {
        Authorization: app.globalData.token
      },
      method: 'GET',
      // 返回的数据类型
      dataType: 'JSON',
      // 响应的数据类型
      responseType: 'text',
      data: {},
      responseType: 'text',
      success: (res) => {

        this.setData({
          div: res.data,
          hasInfo: true
        })
        this.setData({
          browArray2: JSON.parse(this.data.div).results,
          nextUrl: JSON.parse(this.data.div).next
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

  // 头部导航栏备点击
  headerTitleClick: function (e) {
    var that = this
    this.setData({
      tapID: e.target.dataset.id,
      browArray2:[]
    })
    console.log("我是：" + e.target.dataset.id)

    
    wx.request({
      url: app.globalData.ykUrl + "draft/mydraft?type=" + that.data.tapID,
      header: {
        Authorization: app.globalData.token
      },
      method: 'GET',
      // 返回的数据类型
      dataType: 'JSON',
      // 响应的数据类型
      responseType: 'text',
      data: {},
      responseType: 'text',
      success: (res) => {
        this.setData({
          div: res.data,
          hasInfo: true
        })
        this.setData({
          browArray2: JSON.parse(this.data.div).results,
          nextUrl: JSON.parse(this.data.div).next
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

    var url = null
    if(this.data.tapID == 0){
      // 跳转到回答发布页
      url = '/pages/fabu/answer/rich-text?articleID=' + e.target.id + "&&isBox=true"
    }else{
      url = '/pages/fabu/think/rich-text?articleID=' + e.target.id + "&&isBox=true"
    }

    // 获取文章标识
    wx.navigateTo({
      
      url: url
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

  // 删除草稿
  shanchu:function(e){
    var id = e.target.id 
    var that = this
    wx.showModal({
      // title: "温馨提示", // 提示的标题
      content: "删除后不能恢复！", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确认", // 确认按钮的文字，最多4个字符
      confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        // console.log("接口调用成功的回调函数");
        if (res.confirm) {
          var shanchuURl = null
          if(that.data.tapID == 0){
            shanchuURl = app.globalData.ykUrl + "draft/answer?draft=" + id
          }else{
            shanchuURl = app.globalData.ykUrl + "draft/food?draft=" + id
          }
            // 回答
            wx.request({
              url: shanchuURl,
              header: {
                Authorization: app.globalData.token
              },
              method: 'DELETE',
              dataType: 'JSON',
              responseType: 'text',
              data: {},
              responseType: 'text',
              success: (res) => {
                console.log("res.data.status: " + res.data.status)
                console.log("res.data.status: " + res.data)

                  wx.showToast({
                    title: '删除成功',
                    icon:"none"
                  })

                  for(var i = 0;i < that.data.browArray2.length;i++){
                    if(that.data.browArray2[i].id == id){
                      that.data.browArray2.splice(i,1)
                      that.setData({
                        browArray2:that.data.browArray2
                      })
                      break
                    }
                  }

                // if(res.data.status == "ok"){
                //   wx.showToast({
                //     title: '删除成功',
                //     icon:"none"
                //   })
                // }else{
                //   console.log("错误信息：" + res.data.error)
                // }
                
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