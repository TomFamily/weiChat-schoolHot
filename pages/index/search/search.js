// pages/index/search/search.js
const app = getApp()
const wxParse = require("../../../components/wxParse/wxParse.js")

// 向上一页携带数据
// let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
// let prevPage = pages[pages.length - 2];

Page({
  data: {
    // 热门搜索
    list: [
      { name: "何为设备的独立性？", show: true, search: "何为设备的独立性？" },
      { name: "中国自然式山水园", show: true, search: "中国自然式山水园" },
      { name: "集中式总线仲裁有几种控制方法", show: true, search: "集中式总线仲裁有几种控制方法" },
      { name: "杨康", show: false, search: "杨康" },
      { name: "兴义市第一人民医院", show: true, search: "兴义市第一人民医院" }
    ],
    sLIst: [
      { name: '话题', id: 1 },
      { name: '美食', id: 2 },
      { name: '用户', id: 3 },
    ],
    // 记录当前是哪个话题栏
    tapID: 1,
    // 记录输入框的内容
    Div: {},
    content: [],
    // 记录上一页的路径
    path: " ",
    // 判断是否搜索学校
    searchSchool: false,
    // 记录搜索后选择的学校id
    schoolID: 0,
    schoolName: " ",
    // 保存搜索的口味的数组
    tasteA: [],
  },

  //键盘输入时实时调用搜索方法（即时搜索）
  input(e) {
    var that = this

    console.log(e)
    console.log("我是：" + e.detail.value)
    let value = e.detail.value
    console.log("tapID：" + this.data.tapID)
    this.setData({
      content: e.detail.value
    })

    // 每次点击搜索时，都先将list列表质空
    this.setData({
      list: []
    })
    // 将输入的内容提交给后端 在这里获取后端数据
    // 判断搜索框是否为空
    var ykurl = " "
    if (this.data.content != null) {

      if (this.data.tapID == 1) {
        // 话题
        ykurl = app.globalData.ykUrl + "search/question/?text=" + this.data.content
      } else if (this.data.tapID == 2) {
        // 美食
        if (app.globalData.schoolID == 1) {
          // 用户没有填写学校id
          ykurl = app.globalData.ykUrl + "search/food/?text=" + this.data.content + "&school=1"
        } else {
          ykurl = app.globalData.ykUrl + "search/food/?text=" + this.data.content + "&school=" + app.globalData.schoolID
        }
      } else if (this.data.tapID == 3) {
        // 用户
        ykurl = app.globalData.ykUrl + "search/user/?text=" + this.data.content
      } else if (this.data.tapID == 4) {
        // 学校搜索
        ykurl = app.globalData.ykUrl + "search/school/?text=" + this.data.content + "&type=1"
      } else if (this.data.tapID == 5) {
        // 美食口味搜索
        ykurl = app.globalData.ykUrl + "search/flavour/?text=" + this.data.content
      }
    }

    // console.log("http://10.129.71.144:8000/search/food/?text=" + value + "&school=1")
    console.log(ykurl)

    wx.request({
      url: ykurl,
      data: '',
      method: "GET",
      success: function (res) {
        if (that.data.tapID == 1) {
          // 话题
          let searchData = res.data.results.map(function (res) {
            return { key: value, name: res.object.title }
          })
          that.setData({
            searchData,
            searchResultDatas: res.data.results
          })
          console.log("我是搜索结果:" + that.data.searchResultDatas[3].object.id)

        } else if (that.data.tapID == 2) {
          // 美食
          let searchData = res.data.results.map(function (res) {
            return { key: value, name: res.object.name }
          })
          that.setData({
            searchData,
            searchResultDatas: res.data.results
          })
          console.log("我是结果:" + that.data.searchResultDatas[0].object.name)

        } else if (that.data.tapID == 3) {
          let searchData = res.data.results.map(function (res) {
            return { key: value, name: res.object.nick_name }
          })
          that.setData({
            searchData,
            searchResultDatas: res.data.results
          })
          console.log("我是结果:" + that.data.searchResultDatas[0].object.desc)
        } else if (that.data.tapID == 4) {
          let searchData = res.data.results.map(function (res) {
            return { key: value, name: res.object.name }
          })
          that.setData({
            searchData,
            searchResultDatas: res.data.results
          })
          console.log("我是结果:" + that.data.searchResultDatas[0].object.name)
        } else if (that.data.tapID == 5) {
          // 口味
          let searchData = res.data.results.map(function (res) {
            return { key: value, name: res.object.name }
          })
          that.setData({
            searchData,
            searchResultDatas: res.data.results,
            content:res.data.results
          })
          console.log("我是结果:" + that.data.searchResultDatas[0].object.name)
        }
      },
      fail: function (res) { },
    })


    // 本次搜索结束，将content转为null
    this.setData({
      content: null
    })

  },

  //点击完成按钮时触发 (搜索)
  confirm(e) {
    console.log("搜索：" + e.detail.value)
    // 每次点击搜索时，都先将list列表质空
    this.setData({
      list: []
    })
    // 将输入的内容提交给后端 在这里获取后端数据
    // 判断搜索框是否为空
    var ykurl = " "
    if (this.data.content != null) {

      if (this.data.tapID == 1) {
        // 话题
        ykurl = app.globalData.ykUrl + "search/question?text=" + this.data.content
      } else if (this.data.tapID == 2) {
        // 美食
        if (app.globalData.schoolID == 1) {
          // 用户没有填写学校id
          ykurl = app.globalData.ykUrl + "search/food?text=" + this.data.content + "&school=1"
        } else {
          ykurl = app.globalData.ykUrl + "search/food?text=" + this.data.content + "&school=" + app.globalData.schoolID
        }
      } else if (this.data.tapID == 3) {
        // 用户
        ykurl = app.globalData.ykUrl + "search/user?text=" + this.data.content
      } else if (this.data.tapID == 4) {
        // 学校搜索
        ykurl = app.globalData.ykUrl + "search/school?text=" + this.data.content + "&type=1"
      } else if (this.data.tapID == 5) {
        // 美食口味搜索
        ykurl = app.globalData.ykUrl + "search/flavour?text=" + this.data.content
      }
    }

    // 搜索
    wx.request({
      url: ykurl,
      header: {},
      dataType: 'json',
      data: {
      },
      method: 'GET',
      responseType: 'text',
      success: (res) => {
        console.log("我是返回数据：" + res.data)
        console.log("我是返回数据：" + res.data.results[0].object.head_portrait)
        // console.log("我是返回数据：" + res.data.results[0].object.school)
        // console.log("我是返回数据：" + res.data.results[0].object.highlighted)
        // console.log("我是返回数据：" + res.data.results[0].object.scan_number)
        this.setData({
          content: res.data.results
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })

    // 本次搜索结束，将content转为null
    this.setData({
      content: null
    })
  },

  // headerBar点击(话题栏):切换搜索主题（并且告诉后端此搜索话题）
  headerTitleClick: function (e) {
    this.setData({
      tapID: e.target.dataset.id,
      // 将数组质空
      content: []
    })
    console.log("我是：" + this.data.tapID)
  },

  // 用户点击取消，返回上一页
  quxiao: function () {
    console.log("取消被点及了：" + this.data.path)

    wx.switchTab({
      url: '/pages/index/index'
    })

  },



  onLoad: function (options) {

    let { search } = options
    console.log("我是search：" + search)
    if (search != 1 && search != 2) {
      // 搜索学校（等于1，搜索框来的,2:口味搜索）
      this.setData({
        searchSchool: true,
        tapID: 4
      })
    } else if (search == 2) {
      // 搜索口味
      this.setData({
        searchSchool: true,
        tapID: 5
      })
    }

    // 判断上一个页面
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    this.setData({
      path: prevPage
    })
  },

  // 选择学校
  chooseSchool: function (e) {
    var that = this
    this.setData({
      schoolID: e.target.id
    })
    // console.log("学校id：" + e.target.id)
    // console.log("获取到学校名了  无法：" + this.data.searchResultDatas.length)
    var yk = this.data.searchResultDatas.length
    // 遍历content数组，找到id对应的学校名
    for (var i = 0; i < yk; i++) {
      if (this.data.searchResultDatas[i].object.id == this.data.schoolID) {
        that.setData({
          schoolName: this.data.searchResultDatas[i].object.name
        })

        console.log("获取到学校名了：" + this.data.searchResultDatas[i].object.name)

        console.log("我是路径：" + this.data.path)
        this.data.path.setData({
          schoolID: this.data.schoolID,
          schoolName: this.data.searchResultDatas[i].object.name
        })
        // 返回上一页
        wx.navigateBack()
      }
    }
    // 将学校名返还给上一页(如果上一页是用户信息页，则将学校信息永久保存)
    // 是用户在填写永久信息

    console.log("我是学校名：" + this.data.schoolName)
  },

  // 选择口味
  chooseTaste: function (e) {
    var id = e.target.id

    if(this.data.tasteA.length > 5){
      wx.showToast({
        title:"美食标签最多5个",
        icon:"none"
      })
    }

    for (var i = 0; i < this.data.content.length; i++) {
      if (id == this.data.content[i].object.id) {
        // 用当前页面的数组保存选中的口味
        // this.data.tasteA.push(this.data.content[i].object)
        console.log("我是tasteA长度：" + this.data.tasteA.length)
        // 判读要加入的数组中是否有当前要加的元素
        if(this.data.tasteA.length > 0){
          var yk = false
          for(var j = 0;j < this.data.tasteA.length;j++){
            if(this.data.tasteA[j].id == id){
              yk = true
            }
            console.log("我是tasteA：" + this.data.tasteA[j].name)
          }
          if(yk == false){
            this.data.tasteA.push(this.data.content[i].object)
          }
        }else{
          this.data.tasteA.push(this.data.content[i].object)
        }
        
        wx.showToast({
          title:"添加了标签：" + this.data.content[i].object.name,
          icon:"none"
        })

        // 对上一个页面的口味数组进行赋值
        this.data.path.setData({
          tasteArray: this.data.tasteA
        })

        // return
      }
    }
  },

  // 跳转到用户信息页
  peopleInfo: function (e) {
    wx.navigateTo({
      url: '/pages/wode/secondPart/pInfo/pInfo?Yid=' + e.target.id,
    })
  },

  // 跳转到新闻详情
  jumpToDetail: function (e) {
    console.log("我是新闻id：" + e.target.id)
    wx.navigateTo({
      url: '/pages/index/tuijanDetail2/tuijanDetail2?articleID=' + e.target.id,
    })
  },

  // 跳转到美食详情
  jumpToMeishi: function (e) {
    console.log("我是美食id:" + e.target.id)
    wx.navigateTo({
      url: '/pages/index/detail/detail?articleID=' + e.target.id,
    })
  },


  /**
  * 生命周期函数--监听页面加载
  */




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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})