// pages/index/new/detail.js
const wxParse = require('../../../components/wxParse/wxParse.js')
const util = require('../../../utils/util.js')
const request = require('../../../utils/request.js')
const app = getApp()

Page({
  data: {
    imageList: [
      { id: 1 },
      { id: 1 },
      { id: 1 },
      { id: 1 },
      { id: 1 },
      { id: 1 }
    ],
    pinLunList: [
      { name: 1, id: 1 },
      { name: 2, id: 2 },
      { name: 2, id: 2 },
      { name: 2, id: 2 },
      { name: 2, id: 2 },
      { name: 2, id: 2 },
      { name: 3, id: 3 }
    ],
    isEat: "吃过",
    isWantEat: "想吃",
    // 美食
    meishiContent: {},
    // 美食id
    meishiID: 0,
    // 短评和讨论的数组
    duanpingDiv: {},
    duanpinList: [],
    taolunDiv: {},
    taolunList: [],
    // 记录用户是否点赞
    // isDianzan: false,

    // 记录用户token
    token: app.globalData.token
  },

  // 预览图片
  preView: function (e) {
    var url = e.target.url
    wx.previewImage({
      urls: [url],
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("美食token:" + app.globalData.token)

    var that = this;
    // 传递过来的URL
    let { articleID } = options
    var id = articleID



    // 获取美食详情
    wx.request({
      url: app.globalData.ykUrl + "food/info?food=" + id,
      header: {
        Authorization: app.globalData.token,
      },
      dataType: 'json',
      data: {
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        console.log("我是美食：" + res.data)
        that.setData({
          meishiContent: res.data
        })

        // 获取美食id
        this.setData({
          meishiID: this.data.meishiContent.id
        })

        console.log("我是想吃的状态：" + that.data.meishiContent.is_want_eat)
        console.log("我是是否吃的状态：" + that.data.meishiContent.is_eat)

        // 判断用户是否想吃或是是否吃过（将点击结果返还给服务器端）
        if (that.data.meishiContent.is_want_eat == 1) {
          // 用户已经点过想吃
          this.setData({
            isWantEat: "已想吃"
          })
        }
        if (that.data.meishiContent.is_eat == 1) {
          // 用户吃过了
          this.setData({
            isEat: "已吃过"
          })
        }
      }
    })


    // 获取短评
    wx.request({
      url: app.globalData.ykUrl + "food/shortcomment?food=" + id + "&type=0",
      header: {
        Authorization: app.globalData.token,
      },
      dataType: 'json',
      data: {
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        // this.setData({
        //   duanpingDiv: res.data
        // })
        // var a = JSON.parse(this.data.duanpingDiv).results
        // this.setData({
        //   duanpinList: a
        // })

        this.setData({
          duanpinList: res.data.results
        })
        console.log("短评：" + res.data)
        console.log("短评：" + this.data.duanpinList[0].user_head_portrait)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })

    // 获取讨论
    wx.request({
      url: app.globalData.ykUrl + "food/discuss/rank?food=" + id + "&type=0",
      header: {
        Authorization: app.globalData.token,
      },
      dataType: 'json',
      data: {
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        // this.setData({
        //   taolunDiv: res.data
        // })
        // var a = JSON.parse(this.data.taolunDiv).results
        // this.setData({
        //   taolunList: a
        // })

        this.setData({
          taolunList: res.data.results
        })
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })

    // console.log("吃过记录："  + this.data.meishiContent.eat_record.approval_number)
    // console.log("吃过记录："  + app.globalData.ykUrl + "food/info?food=" + id)
  },

  // 导航
  nevigation: function () {
    wx.openLocation({ /*使用微信内置地图查看位置*/
      // 经度
      // longitude: 105.59605496681215,
      longitude: parseFloat(this.data.meishiContent.longitude),
      // longitude: parseFloat(105.59605496681215),
      // 维度
      latitude: parseFloat(this.data.meishiContent.latitude)
      // latitude: 29.40335429765741,
      // scale: 110
    })
    console.log("我是经纬度：" + this.data.meishiContent.latitude)
  },

  isEat: function () {
    // if (this.data.isEat == "吃过") {
    //   this.setData({
    //     isEat: "已吃过"
    //   })
    // }

    wx.request({
      url: app.globalData.ykUrl + "operation/approval?eated=" + this.data.meishiID,
      header: {
        Authorization: app.globalData.token,
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        if (res.data.status == "ok") {
          // 关注成功
          if (this.data.isEat == "吃过") {
            this.setData({
              isEat: "已吃过"
            })
          } else {
            this.setData({
              isEat: "吃过"
            })
          }
        }
        console.log("我是返回的状态：" + res.data.status)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },

  // 是否想吃
  isWeat: function () {
    // if (this.data.isWantEat == "想吃") {
    //   this.setData({
    //     isWantEat: "已想吃"
    //   })
    // }

    wx.request({
      url: app.globalData.ykUrl + "operation/approval?want_eat=" + this.data.meishiID,
      header: {
        Authorization: app.globalData.token,
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        if (res.data.status == "ok") {
          // 关注成功
          if (this.data.isWantEat == "想吃") {
            this.setData({
              isWantEat: "已想吃"
            })
          } else {
            this.setData({
              isWantEat: "想吃"
            })
          }
        }
        console.log("我是返回的状态 想吃：" + res.data.status)
      },
      fail: function (res) { },
      complete: function (res) {
      },
    })


  },

  // 跳转到短评
  jumpToDuanping: function () {
    wx.navigateTo({
      url: '/pages/index/detail/duanping/huifu?articleID=' + this.data.meishiID,
    })
  },
  // 跳转到讨论
  jumpToTaolun: function () {
    wx.navigateTo({
      url: '/pages/index/detail/taolun/huifu?articleID=' + this.data.meishiID,
    })
  },

  // 点赞操作
  isDianzan: function (e) {
    var id = e.target.id
    console.log("我是短评id:" + id )

    if (this.data.duanpinList.length > 0) {
      for (var i = 0; i < this.data.duanpinList.length; i++) {
        if (id == this.data.duanpinList[i].id) {
          var isApprove = this.data.duanpinList[i].is_approval
          console.log("我是短评id:" + isApprove )
          wx.request({
            url: app.globalData.ykUrl + "operation/approval?short_comment=" + id,
            header: {
              Authorization: app.globalData.token,
            },
            method: 'GET',
            responseType: 'text',
            success: (res) => {
              console.log("res.data.status:" + res.data.status )
              if (res.data.status == "ok") {
                // 关注成功
                if (isApprove == 0) {
                  // this.data.duanpinList[i].is_approval = 1
                  wx.showToast({
                    title: "点赞成功",
                    icon: "none",
                    mask: false,
                    duration: 1000
                  })
                } else {
                  // this.data.duanpinList[i].is_approval = 0
                  wx.showToast({
                    title: "点赞取消",
                    icon: "none",
                    mask: false,
                    duration: 1000
                  })
                }
              }
            },
            fail: function (res) { },
            complete: function (res) {
            },
          })

        }
      }
    }

  },
  // 跳转到用户信息页
  jumpToPeplo:function(e){
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + e.target.id,
    })
  },
  jumpToDeatil: function (e) {
    console.log(e.target.id)
    wx.navigateTo({
      url: '/pages/index/detail/taolun/huifu/huifu?articleID=' + e.target.id,
    })
  },
})