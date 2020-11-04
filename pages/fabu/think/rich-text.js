// components/rt/rt.js
const qiniuUploader = require("qiniuUploader.js");
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    readOnly: {
      type: Boolean,
      value: false
    },
    button_text: {
      type: String,
      value: '发布'
    },
    html: {
      type: String,
      value: ''
    }
  },


  data: {
    false: 'false',
    selected_function1: '文本',
    function1: ['文本', '段落', '插入'],

    imageList: [],
    // 美食标题
    title: " ",
    // 美食介绍（text）
    ykText: " ",


    firstImage: " ",
    image1: false,
    secondImage: " ",
    image2: false,
    thirdImage: " ",
    image3: false,
    forthImage: " ",
    image4: false,
    firImage: " ",
    image5: false,
    sixImage: " ",
    image6: false,

    // 用于上传的图片链接
    f1: " ",
    f2: " ",
    f3: " ",
    f4: " ",
    f5: " ",
    f6: " ",

    // 美食所属学校
    schoolName: "搜索学校.. ",
    schoolID: 0,


    // 美食地址
    address1: "请选择..",
    // latitude 纬度
    latitude: 0,
    // 经度
    longitude: 0,
    // 口味数组（保存了id和name）
    tasteArray: [],
    // 保存口味签的id
    tasteArray2: [],

    questionID: 0,
    Qtoken: " ",
    // 记录是否有草稿信箱跳转过来
    isBox: false
  },

  attached() {
    this.setData({
      function2: this.data.wenben
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function (options) {

      this.setData({
        questionID: options.articleID,
        isBox: options.isBox
      })
      console.log("我是发布美食")
      var that = this

      if (this.data.isBox) {
        // 由草稿信箱跳转过来
        wx.request({
          url: app.globalData.ykUrl + "draft/food?draft=" + that.data.questionID,
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
              title: res.data.name,
              address1: res.data.address,
              latitude: res.data.latitude,
              longitude: res.data.longitude


              // name: that.data.title,
              // desc: that.data.ykText,
              // address: that.data.address1,

              // longitude: that.data.longitude,
              // latitude: that.data.latitude,
              // flavour: that.data.tasteArray2,
              // image_first: that.data.firstImage,
              // image_second: that.data.secondImage,
              // address_image: that.data.thirdImage,

              // school: that.data.schoolID,
              // image_third: that.data.forthImage,
              // image_fourth: that.data.firImage,
              // image_fifth: that.data.sixImage,
            })
            
            console.log("我是美食title：" + that.data.title)
          },
        })
      }

      // 获取七牛云token
      wx.request({
        url: app.globalData.ykUrl + "upload",
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
            Qtoken: res.data.uptoken
          })
          console.log("uptoken:" + this.data.Qtoken)
        },
      })
    },

    // 获取键盘高度e
    keyHeight(e) {
      wx.onKeyboardHeightChange((result) => {
        console.log("键盘高度")
        console.log(result.height)
      })
    },

    ykInput: function (e) {
      // console.log("杨康的title2：" + e.detail.value)
      this.setData({
        title: e.detail.value
      })
      console.log("杨康的title：" + this.data.title)
    },

    change_function1(e) {
      var selected = e.currentTarget.dataset.selected
      if (selected == '文本') {
        var function2 = this.data.wenben
      } else if (selected == '段落') {
        var function2 = this.data.duanluo
      } else if (selected == '插入') {
        var function2 = this.data.charu
      }
      this.setData({
        selected_function1: selected,
        function2
      })
    },

    //编辑器初始化完成时触发
    onEditorReady() {
      console.log('编辑器初始化完成时触发')
      // 返回一个 SelectorQuery 对象实例。在自定义组件或包含自定义组件的页面中，应使用this.createSelectorQuery()来代替。
      // https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createSelectorQuery.html 
      this.createSelectorQuery().select('#editor').context(res => {
        console.log('createSelectorQuery=>', res)
        this.editorCtx = res.context;
        this.setContents(this.data.html); //设置富文本内容
      }).exec();


    },

    //设置富文本内容
    setContents(richtext) {
      this.editorCtx.setContents({
        // html: richtext,
        // html: '<p>绕弯儿无若<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1602602644467&di=16f346f1cd1c7f78b56ecb9932330794&imgtype=0&src=http%3A%2F%2Ft8.baidu.com%2Fit%2Fu%3D3571592872%2C3353494284%26fm%3D79%26app%3D86%26f%3DJPEG%3Fw%3D1200%26h%3D1290" data-custom="id=imgage"></p><p><br></p>',
        success: res => {
          console.log('[setContents success--]', res)
        }
      })
    },

    // 通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式
    onStatusChange(res) {
      const formats = res.detail;
      var function2 = this.data.function2
      if (JSON.stringify(formats) == '{}') {//format为空时，清空所有选中
        for (var i = 0; i < function2.length; i++)function2[i]['selected'] = false
      }

      for (var i = 0; i < function2.length; i++) {//循环function2列表
        for (var key in formats) {//循环formats获取键值对
          if (function2[i]['name'] == key) {//function2中对name，对应formats中对键
            if (!function2[i]['value']) {//若function2中，只有name，没有value，则当name和key一样时，就是被选中
              function2[i]['selected'] = true
              break;//如果此function2是被选中的，那么就终止format循环，并判断下一个function2是否被选中
            }
            else if (function2[i]['value'] == formats[key]) {//function2中对value，对应formats中的值
              function2[i]['selected'] = true//值相等，肯定是被选中的
              break;
            }
            else {
              function2[i]['selected'] = false
            }
          }
          else {
            function2[i]['selected'] = false
          }
        }
      }
      this.setData({
        function2
      })

      //console.log('onStatusChange=>',formats,'\n',function2)
    },

    // 美食上传图片
    insert_img2(e) {
      var that = this;
      var id = e.target.id
      console.log("我是id：" + id)
      console.log("yk" + id)
      this.initQiniu();
      wx.chooseImage({
        count: 1,
        success: res => {

          var path = res.tempFilePaths[0];
          var seePath = " "
          var index = this.data.imageList.length;
          this.data.imageList[index] = path;

          // 交给七牛上传 （判断是哪个位置的图片）
          qiniuUploader.upload(path, (res) => {
            // 得到上传后的图片链接
            seePath = res.imageURL
            console.log("图片地址：" + seePath)
            if (id == 1) {
              this.setData({
                firstImage: seePath,
                image1: true
              })
            } else if (id == 2) {
              this.setData({
                secondImage: seePath,
                image2: true
              })
            } else if (id == 3) {
              this.setData({
                thirdImage: seePath,
                image3: true
              })
            } else if (id == 4) {
              this.setData({
                forthImage: seePath,
                image4: true
              })
            } else if (id == 5) {
              this.setData({
                firImage: seePath,
                image5: true
              })
            } else if (id == 6) {
              this.setData({
                sixImage: seePath,
                image6: true
              })
            }
          }, (error) => {
            wx.showToast({
              title: '图片上传失败,请重新上传',
              icon: "none"
            })
            console.error('error: ' + JSON.stringify(error));
          });
        }
      })
    },
    // 初始化七牛相关参数
    initQiniu() {
      //配置详解 https://github.com/gpake/qiniu-wxapp-sdk/blob/master/README.md
      var that = this
      var options = {
        region: 'SCN', // 华南 
        uptoken: that.data.Qtoken,
        domain: getApp().data.qiniu_domain1
      };
      qiniuUploader.init(options);
      console.log("七牛云：" + this.data.Qtoken)
    },

    ykaddress: function () {
      wx.chooseLocation({
        success: res => {
          this.setData({
            address1: res.address,
            longitude: res.longitude,
            latitude: res.latitude
          })
          console.log("杨康:" + res.address)
          console.log("杨康:" + this.data.longitude)
          console.log("杨康:" + this.data.latitude)
        }
      })
    },
    chooseSchool: function (e) {
      console.log("杨康")
      wx.navigateTo({
        url: '/pages/index/search/search',
      })
    },
    chooseTaste: function (e) {
      console.log("杨康")
      // search（等于1，搜索框来的,2:口味搜索）
      wx.navigateTo({
        url: '/pages/index/search/search?search=2',
      })
    },

    //保存草稿
    save: function () {
      var that = this
      console.log("我是save")
      wx.request({
        url: app.globalData.ykUrl + "draft/food",
        data: {
          name: that.data.title,
          address: that.data.address1,
          longitude: that.data.longitude,
          latitude: that.data.latitude,
        },
        header: {
          Authorization: app.globalData.token,
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          if (res.data.status == "ok") {
            console.log("res.status:" + res.data.status)
            // 发布成功，跳转到一个页面进行提示
            wx.showToast({
              title: '以保存到草稿信箱',
              icon: "success"
            })
          } else {
            console.log("失败数据:" + res.data.error)
            wx.showToast({
              title: '保存失败，服务器错误',
              icon: 'none'
            });
          }
        },
      })

      var that = this
      this.editorCtx.getContents({
        success(res) {
          // 富文本编辑器
          console.log(res)
          console.log("html:" + res.html)
          console.log("text:" + res.text)
          // console.log("detail:" + res.detail)

          that.setData({
            ykText: res.text
          })
          if (that.data.title.length == 0 || that.data.title.length == 1) {
            wx.showToast({
              title: '输入两字以上标题才能保存',
              icon: 'none'
            })
            return
          }

          // 判断地址
          if (that.data.address1.length < 4) {
            wx.showToast({
              title: '选择美食地址才能保存',
              icon: 'none'
            })
            return
          }


          //  发送文件(发布美食)
          wx.request({
            url: app.globalData.ykUrl + "draft/food",
            data: {
              name: that.data.title,
              desc: that.data.ykText,
              address: that.data.address1,

              longitude: that.data.longitude,
              latitude: that.data.latitude,
              flavour: that.data.tasteArray2,
              image_first: that.data.firstImage,
              image_second: that.data.secondImage,
              address_image: that.data.thirdImage,

              school: that.data.schoolID,
              image_third: that.data.forthImage,
              image_fourth: that.data.firImage,
              image_fifth: that.data.sixImage,

            },
            header: {
              Authorization: app.globalData.token,
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
              if (res.data.status == "ok") {
                console.log("res.status:" + res.data.status)
                // 发布成功，跳转到一个页面进行提示
                wx.showToast({
                  title: '已保存到草稿信箱',
                  icon: "success"
                })
              } else {
                wx.showToast({
                  title: '保存失败，服务器错误',
                  icon: 'none'
                });
                console.log("res.error:" + res.data.error)
              }
            },
          })
        }
      })
    },

    //   提交数据
    // form发生submit事件会调用此函数 获取上下文
    formSubmit(e) {
      var that = this
      this.editorCtx.getContents({
        success(res) {
          // 富文本编辑器
          console.log(res)
          console.log("html:" + res.html)
          console.log("text:" + res.text)
          // console.log("detail:" + res.detail)
          that.setData({
            ykText: res.text
          })

          if (that.data.title.length == 0 || that.data.title.length == 1) {
            wx.showToast({
              title: '请输入两字以上标题',
              icon: 'none'
            })
            return
          }
          if (res.text.length == 0 || res.text.length == 1) {
            wx.showToast({
              title: '写一些文字再发表吧',
              icon: 'none'
            })
            return
          } else {
            wx.showLoading({
              title: '发布中...',
            })
          }
          // 判断图片量
          if (that.data.firstImage == " ") {
            wx.showToast({
              title: '请上传第一张图片',
              icon: 'none'
            })
            return
          }
          if (that.data.secondImage == " ") {
            wx.showToast({
              title: '请上传第二张图片',
              icon: 'none'
            })
            return
          }
          if (that.data.thirdImage == " ") {
            wx.showToast({
              title: '请上传第三张图片',
              icon: 'none'
            })
            return
          }


          // 判断地址
          if (that.data.address1.length < 4) {
            wx.showToast({
              title: '请选择美食地址',
              icon: 'none'
            })
            return
          }

          //判断学校名
          if (that.data.schoolID == 0) {
            wx.showToast({
              title: '请选择学校',
              icon: 'none'
            })
            return
          }

          // 判断美食口味：
          if (this.data.tasteArray2.length < 2) {
            wx.showToast({
              title: '最少添加两个美食标签',
              icon: 'none'
            })
            return
          }

          console.log("杨康：" + that.data.title)
          console.log("杨康：" + that.data.ykText)
          console.log("杨康：" + that.data.firstImage)
          console.log("杨康：" + that.data.secondImage)
          console.log("杨康：" + that.data.thirdImage)
          console.log("杨康：" + that.data.address1)
          console.log("杨康：" + that.data.schoolName)
          console.log("that.data.latitude：" + that.data.latitude)
          console.log("that.data.longitude：" + that.data.longitude)

          //  发送文件(发布美食)
          wx.request({
            url: app.globalData.ykUrl + "food/info",
            data: {
              name: that.data.title,
              desc: that.data.ykText,
              address: that.data.address1,

              longitude: that.data.longitude,
              latitude: that.data.latitude,
              flavour: that.data.tasteArray2,
              image_first: that.data.firstImage,
              image_second: that.data.secondImage,
              address_image: that.data.thirdImage,

              school: that.data.schoolID,
              image_third: that.data.forthImage,
              image_fourth: that.data.firImage,
              image_fifth: that.data.sixImage,

            },
            header: {
              Authorization: app.globalData.token,
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
              if (res.data.status == "ok") {
                console.log("res.status:" + res.data.status)
                // 发布成功，跳转到一个页面进行提示
                wx.showToast({
                  title: '发布成功',
                  icon: "success"
                })
              } else {
                console.log("res.status:" + res.data.status)
                // console.log("res.status:" + res.error.name)
                console.log("res.status:" + res.data.error.desc)
                console.log("res.status:" + res.data.error.address)
                console.log("res.status:" + res.data.error.longitude)
                console.log("res.status:" + res.data.error.latitude)
                console.log("res.status:" + res.data.error.image_first)
                console.log("res.status:" + res.data.error.image_second)
                console.log("res.status:" + res.data.error.address_image)
                console.log("res.status:" + res.data.error.flavour)
                console.log("res.status:" + res.data.error.school)
                wx.showToast({
                  title: '发布失败，服务器错误',
                  icon: 'none'
                });
              }

            },
            fail: (res) => {
              wx.showToast({
                title: '发布失败',
                icon: 'none'
              });
              console.log("发布失败:" + res.data)
            },
            complete: (res) => {
              wx.hideLoading();
            },
          })
        }
      })
    },

    onShow: function () {
      console.log("美食口味变迁:" + this.data.tasteArray)
      for (var i = 0; i < this.data.tasteArray.length; i++) {
        console.log(this.data.tasteArray[i].name)
        console.log(this.data.tasteArray[i].id)
        this.data.tasteArray2.push(this.data.tasteArray[i].id)
      }
    },
  }
})
