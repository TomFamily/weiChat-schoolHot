//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')

// 新闻首页显示数据从第0条开始显示，第0条是最新的新闻
Page({
  data: {
    // 推荐测试数组
    yk: [
      { type: 1, id: 123 }, { type: 1 }, { type: 0 }, { type: 1 }, { type: 0 }, { type: 0 }
    ],
    headerTitleName: [
      { name: '推荐', nameID: 'yk1', newsType: 'tuijan', nameUrl: app.globalData.ykUrl + 'recommend?school=-1&type=0' },
      { name: '热榜', nameID: 'yk2', newsType: 'rebang', nameUrl: app.globalData.ykUrl + 'question/hot' },
      { name: '美食', nameID: 'yk3', newsType: 'meishi', nameUrl: app.globalData.ykUrl + 'food/rank?school=1&type=0' },
    ],
    // 新闻类型
    a: 1,
    token: app.globalData.token,
    newList: [],
    reBangList: [],
    meiShiList: [],
    // 首次进入页面，默认的URL
    newsUrl: app.globalData.ykUrl + 'recommend?school=-1&type=0',
    tapID: "yk1", // 判断是否选中
    // 头部导航栏的提示内容
    tipText: "默认排序",
    // 记录是默认排序还是按时间排序，0位默认排序，1位按时间排序
    paixun: 0,
    // 判断用户是否登录
    hasUserInfo: app.globalData.hasUserInfo,
    // nextUrl
    nextUrl: null,
    // 记录是否刷新
    isShuaXin: false
  },

  // 后期添加：此次获取到的数据的id，方便下一次获取
  onLoad: function (options) {
    var that = this


    console.log("onload")
    this.renderPage(true, this.data.newsUrl)
  },

  // 刷新
  shuaXin: function () {

    console.log("刷新函数")

    this.setData({
      isShuaXin: true,
      meiShiList: [],
      reBangList: [],
      newList: []
    })
    var url = " "

    if (this.data.tapID == "yk1") {
      // 推荐
      if (this.data.tipText == "默认排序") {
        url = app.globalData.ykUrl + "recommend?school=" + app.globalData.schoolID + "&type=0"
      } else {
        url = app.globalData.ykUrl + "recommend?school=" + app.globalData.schoolID + "&type=1"
      }
    } else if (this.data.tapID == "yk3") {
      // 美食
      if (this.data.tipText == "默认排序") {
        url = app.globalData.ykUrl + "food/rank?school=" + app.globalData.schoolID + "&type=0"
      } else {
        url = app.globalData.ykUrl + "food/rank?school=" + app.globalData.schoolID + "&type=1"
      }
    } else {
      url = app.globalData.ykUrl + "question/hot?school=" + app.globalData.schoolID
    }
    // 请求数据
    this.renderPage(true, url)
  },
  // headerBar点击(话题栏):切换新闻内容
  headerTitleClick: function (e) {
    // 切换新闻内容，先将三个数组全部质空
    this.setData({
      newList: [],
      reBangList: [],
      meiShiList: []
    })

    this.setData({
      tapID: e.target.dataset.id,
      newsUrl: e.target.dataset.url,
    })
    console.log("url:" + e.target.dataset.url)

    var url = null
    if (this.data.tapID == "yk3") {
      // 美食
      this.setData({
        a: 3,
        tipText: "默认排序"
      })

      // 美食按默认排序
      url = app.globalData.ykUrl + "food/rank?school=" + app.globalData.schoolID + "&type=0"
    } else if (this.data.tapID == "yk2") {
      // 热榜
      this.setData({
        a: 2,
        tipText: " "
      })
      url = app.globalData.ykUrl + "question/hot?school=1"
    } else {

      // 推荐      
      this.setData({
        a: 1,
        tipText: "默认排序",
        paixun: 0
      })
      // 推荐按默认排序
      url = app.globalData.ykUrl + "recommend?school=" + app.globalData.schoolID + "&type=0"
    }
    this.renderPage(true, url)
  },


  // 头部导航栏提示内容
  tipChange: function () {
    var url = null
    if (this.data.tapID == "yk1") {
      // 推荐
      if (this.data.tipText == "默认排序") {
        this.setData({
          tipText: "时间排序",
          paixun: 1
        })
        url = app.globalData.ykUrl + "recommend?school=" + app.globalData.schoolID + "&type=1"
      } else {
        this.setData({
          tipText: "默认排序",
          paixun: 0
        })
        url = app.globalData.ykUrl + "recommend?school=" + app.globalData.schoolID + "&type=0"
      }
    } else if (this.data.tapID == "yk3") {
      // 美食
      if (this.data.tipText == "默认排序") {
        this.setData({
          tipText: "时间排序"
        })
        url = app.globalData.ykUrl + "food/rank?school=" + app.globalData.schoolID + "&type=1"
      } else {
        this.setData({
          tipText: "默认排序"
        })
        url = app.globalData.ykUrl + "food/rank?school=" + app.globalData.schoolID + "&type=0"
      }
    } else {
      url = app.globalData.ykUrl + "question/hot"
    }
    // 请求数据
    this.renderPage(true, url)
  },

  // 跳转到详情页面
  newDetail: function (e) {

    var ykID = e.target.id
    var aPath = null
    // 判断是哪一个话题
    if (this.data.a == 1) {
      // 判断是否有回答
      // console.log("我是type：" + type)
      console.log("我是文章ID：" + ykID)

      if (this.data.paixun == 0) {
        // 默认排序
        // 找到id对应的数据
        for (var i = 0; i < this.data.newList.length - 1; i++) {
          if (this.data.newList[i].id == ykID) {
            if (this.data.newList[i].type == 0) {
              console.log("type:1" + this.data.newList[i].type)
              // 为回答
              aPath = '/pages/index/tuijanDetail/tuijanDetail?articleID=' + ykID
            } else {
              console.log("type:2" + this.data.newList[i].type)

              aPath = '/pages/index/tuijanDetail2/tuijanDetail2?articleID=' + ykID
            }
          }
        }
      } else {
        // 按时间排序，直接跳转到问题详情页
        aPath = '/pages/index/tuijanDetail2/tuijanDetail2?articleID=' + ykID
      }
      wx.navigateTo({
        url: aPath,
      })
      console.log("我是路径" + aPath)
    } else if (this.data.a == 2) {
      wx.navigateTo({
        url: '/pages/index/rebanDetail/rebanDetail?articleID=' + ykID,
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/detail/detail?articleID=' + ykID,
      })
    }

    // 记录文章id
    app.globalData.titleID1 = e.target.id

  },

  // 待添加：下拉动作




  // 点击tap栏 获取数据
  renderPage: function (isRefresh, newsurl) {
    console.log("renderpage被调用了")
    console.log("url:" + this.data.nextUrl)

    this.setData({
      nextUrl: null
    })

    var that = this
    if (isRefresh) {
      console.log(newsurl)
      wx.request({
        url: newsurl,
        header: {
          // Authorization: this.data.token
        },
        method: "GET",
        success(res) {
          var data = res.data
          if (that.data.tapID == "yk1") {
            that.setData({
              newList: that.data.newList.concat(data),
              nextUrl: res.data.next
            })
            console.log("推荐获取到的nextUrl：" + res.data.next)
            console.log("推荐获取到的nextUrl：" + res.next)
            for (var i = 0; i < res.data.length; i++) {
              console.log("推荐获取到的数据：" + res.data[i].id)
              console.log("推荐获取到的数据：" + res.data[i].question_title)
              console.log("推荐获取到的数据：" + res.data[i].abstract)
            }
          } else if (that.data.tapID == "yk2") {
            that.setData({
              reBangList: that.data.reBangList.concat(res.data),
              // 没有nextURL
            })
            // console.log("我是nextURL：" + res.data.next)
          } else {
            that.setData({
              meiShiList: that.data.meiShiList.concat(data.results),
              nextUrl: res.data.next
            })
            console.log("我是nextURL：" + res.data.next)
            console.log("我是返回数据：" + res)
            console.log("我是返回数据：" + res.data)
            console.log("我是返回数据：" + res.next)
          }
          // console.log("我是nextURL：" + that.data.nextUrl)
          // wx.hideLoading()
          if (that.data.isShuaXin) {
            wx.showToast({
              title: '刷新成功',
              icon: "none"
            })
            that.setData({
              isShuaXin: false
            })
          }
        },
      })
    }
  },

  // 搜索框
  search: function () {
    wx.navigateTo({
      url: '/pages/index/search/search?search=1',
    })
  },
  // 到发布页
  fabu: function () {
    wx.navigateTo({
      url: '/pages/fabu/fabu',
    })
  },

  //  页面上拉触底事件的处理函数： 获取往期数据
  onReachBottom: function () {
    console.log("到底了:" + this.data.newsUrl)



    if (this.data.tapID == "yk1") {
      console.log("app：" + app.globalData.hasUserInfo)

      if (app.globalData.hasUserInfo == false) {
        // 用户没有登录，让他去登录
        wx.showModal({
          // title: "温馨提示", // 提示的标题
          content: "登录后我们将为您提供更优质的推荐！", // 提示的内容
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
      }

      console.log("我是学校id：" + app.globalData.schoolID)
      if (app.globalData.hasUserInfo == true) {
        if (app.globalData.schoolID == 0) {
          // 默认为 1 
          wx.showModal({
            // title: "温馨提示", // 提示的标题
            content: "完善学校信息我们将为您提供更好的个性化推荐服务", // 提示的内容
            showCancel: true, // 是否显示取消按钮，默认true
            cancelText: "以后再说", // 取消按钮的文字，最多4个字符
            cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
            confirmText: "前往完善", // 确认按钮的文字，最多4个字符
            confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
            success: function (res) {
              // console.log("接口调用成功的回调函数");
              if (res.confirm) {
                console.log('用户点击确定')
                // 调用接口，取消对改用户的关注
                wx.navigateTo({
                  url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + app.globalData.selfID,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          // 已登录，并且学校信息已填写
          if (this.data.nextUrl != null && this.data.tapID == "yk1") {
            this.renderPage(true, this.data.newsUrl)
          } else {
            wx.showToast({
              title: '没有更多数据',
              icon: "none"
            })
          }
        }
      }


    } else if (this.data.tapID == "yk3") {
      if (this.data.nextUrl != null) {
        this.renderPage(true, this.data.newsUrl)
      } else {
        wx.showToast({
          title: '没有更多数据',
          icon: "none"
        })
      }
    }else if(this.data.tapID == "yk2"){
      wx.showToast({
        title: '没有更多数据',
        icon: "none"
      })
    }
  },







  /**
 * 获取公共顶部菜单的高度
 * @param {object} e 
 */
  commonNavAttr(e) {
    console.log(e);
    // if (e.detail) {
    //   this.setData({
    //     commonNavAttr: e.detail
    //   })
    // }
  },
})
