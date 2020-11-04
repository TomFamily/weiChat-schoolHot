// pages/wode/secondPart/pInfo/pInfo.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    a: 1,
    // 用户信息
    userInfo: {},
    // 用户ID
    userID: 0,
    // 用户头像
    userHeaderImage: null,
    guanzhu: false,

    // 根据此判断当前页面的数据是否可以修改
    canChange: false,
    answerArray: [
      { type: 0, id: 0 },
      // { type: 1, id: 1 },
      // { type: 2, id: 2 },
      // { type: 3, id: 3 },
      // { type: 4, id: 5 }
    ],
    stringList: [
      { name: "赞同了回答" },
      { name: "收藏了回答" },
      { name: "回答了问题" },
      { name: "收藏了问题" },
      { name: "提出了回答" }
    ],
    // 个人信息
    userInfo1: {},
    // 动态
    dongtai: [],
    dongtai2: {},
    div: {},
    // 记录用户的学习名
    schoolID: 0,
    schoolName: " ",
    selfQianming: " ",
    // 动态nextUrl
    nextUrl: null,
  },
  preView: function () {
    wx.previewImage({
      urls: [this.data.userInfo1.head_portrait],
    })
  },

  onLoad: function (options) {
    // 传递的id
    let { Yid } = options
    this.setData({
      userID: Yid
    })
    console.log("用户的id：" + Yid)
    console.log("yk的selfID：" + app.globalData.selfID)


    // 判断传递过来的id和自己的id是否相同，相同者可以跟该数据
    if (this.data.userID == app.globalData.selfID) {
      // 是用户本人
      this.setData({
        canChange: true
      })
    }

    // 用户信息展示
    var ykUrl1 = app.globalData.ykUrl + 'user/infoshow/' + Yid
    // 用户动态
    var ykUrl2 = app.globalData.ykUrl + 'user/dynamic/' + Yid

    // 获取用户信息
    wx.request({
      url: ykUrl1,
      // 不需要token
      data: {},
      method: 'GET',
      success: (res) => {
        console.log("请求数据了")
        this.setData({
          schoolName: res.data.school_name,
          userInfo1: res.data,
          selfQianming: res.data.desc,
          userHeaderImage: res.data.head_portrait
        })
        console.log("我是用户的个人信息name：" + this.data.userInfo1.nick_name)
        if (this.data.selfQianming == " ") {
          if (this.data.canChange) {
            this.setData({
              selfQianming: "编辑"
            })
          }
        }
        if (this.data.canChange == false) {
          // 不是用户本人，判断是否关注过
          console.log("获取的是否关注：" + this.data.userInfo1.is_attentin)
          if (this.data.userInfo1.is_attentin == 1) {

            // 已经关注了该用户
            this.setData({
              guanzhu: true
            })
          } else {
            this.setData({
              guanzhu: false
            })
          }
        }

        console.log("我是用户信息：" + res.data.head_portrait)
        console.log("我是用户信息：" + res.data.nick_name)
        console.log("我是用户信息：" + res.data.school_name)
      },
    })


    // 获取用户动态
    wx.request({
      url: ykUrl2,
      // 不需要token
      header: {},
      method: 'GET',
      dataType: 'JSON',
      responseType: 'text',
      data: {},
      responseType: 'text',
      success: (res) => {
        this.setData({
          div: res.data,
        })
        console.log("数据" + res.data)
        this.setData({
          dongtai: JSON.parse(this.data.div).results,
          nextUrl: JSON.parse(this.data.div).next
        })
        console.log("我是属性：" + this.data.dongtai)
      },
    })
  },

  // 关注按键被点击了
  guanT: function () {

    console.log("我被点了")

    wx.request({
      url: app.globalData.ykUrl + "operation/attention?target=" + this.data.userID,
      header: {
        Authorization: app.globalData.token
      },
      data: {},
      method: 'GET',
      success: (res) => {
        if (res.data.status == "ok") {
          if (this.data.guanzhu == false) {
            this.setData({
              guanzhu: true
            })
          } else {
            this.setData({
              guanzhu: false
            })
          }
        }
        console.log
      },
    })
  },

  // 判断个性签名是否可以修改
  inputQianming: function (e) {
    var a = e.detail.value
    if (a.length == 16) {

    } else if (a.length < 5) {
      wx.showToast({
        title: '最少4个字符',
        icon: "none"
      })
    }
    console.log(a)


    wx.request({
      url: app.globalData.ykUrl + "user/userinfo",
      header: {
        Authorization: app.globalData.token,
      },
      dataType: 'json',
      data: {
        desc: a
      },
      method: 'PUT',
      responseType: 'text',
      success: (res) => {
        console.log("修改学校名的返回数据：" + res.data.status)
        console.log("修改学校名的返回数据：" + res.data.error)
        console.log("修改学校名的返回数据：" + res.data.error.nick_name)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })

  },

  // 界面跳转
  // 私信
  sixing: function () {
    if (app.globalData.hasUserInfo == false) {
      // 用户没有登录，让他去登录
      wx.showModal({
        // title: "温馨提示", // 提示的标题
        content: "登录后才能跟他聊天哦！", // 提示的内容
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
        // objectID1: options.Yid,
        // headImage: options.headImage,
        url: '/pages/weitoutiao/chat/yk2?Yid=' + this.data.userID + "&&headImage=" + this.data.userHeaderImage,
      })
    }
  },

  guanzhu: function () {
    var a = app.globalData.token
    wx.navigateTo({
      url: '/pages/wode/attention/attention?Yid=' + this.data.userID,
    })
    console.log("yk:" + a)
  },
  fensi: function () {
    wx.navigateTo({
      url: '/pages/wode/secondPart/bean/bean?Yid=' + this.data.userID,
    })
  },
  fangke: function () {
    wx.navigateTo({
      url: '/pages/wode/secondPart/bean/bean?Yid=' + this.data.userID,
    })
  },

  // 跳转到文章详情页
  jumpToArtocle: function (e) {
    var articleID = e.target.id
    wx.navigateTo({
      url: '/pages/index/tuijanDetail/tuijanDetail?articleID=' + articleID,
    })
  },

  // 选择学校
  chooseSchool: function () {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },


  //  * 生命周期函数--监听页面显示
  onShow: function () {

    console.log("我是学校名onShow：" + this.data.schoolName)
    this.data.userInfo1.school_name = this.data.schoolName

    wx.request({
      url: app.globalData.ykUrl + "user/userinfo",
      header: {
        Authorization: app.globalData.token,
      },
      dataType: 'json',
      data: {
        school: this.data.schoolID
      },
      method: 'PUT',
      responseType: 'text',
      success: (res) => {
        console.log("修改学校名的返回数据：" + res.data.status)
        console.log("修改学校名的返回数据：" + res.data.error)
        console.log("修改学校名的返回数据：" + res.data.error.nick_name)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },


  //  * 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log("到底了")
    if (this.data.nextUrl != null) {
      wx.request({
        url: this.data.nextUrl,
        // 不需要token
        header: {},
        method: 'GET',
        dataType: 'JSON',
        responseType: 'text',
        data: {},
        responseType: 'text',
        success: (res) => {
          this.setData({
            div: res.data,
          })
          console.log("数据" + res.data)
          this.setData({
            dongtai: this.data.dongtai.concat(JSON.parse(this.data.div).results),
            nextUrl: JSON.parse(this.data.div).next
          })
          console.log("我是属性：" + this.data.dongtai)
        },
      })
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: "none"
      })
    }
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