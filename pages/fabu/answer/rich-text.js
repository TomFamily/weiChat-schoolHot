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

  /**
   * 组件的初始数据
   */
  data: {
    false: 'false',
    selected_function1: '文本',
    function1: ['文本', '段落', '插入'],
    wenben: [
      { img: '../editor/images/B.png', text: '加粗', name: 'bold' },
      { img: '../editor/images/I.png', text: '斜体', name: 'italic' },
      { img: '../editor/images/U.png', text: '下划线', name: 'underline' },
      { img: '../editor/images/img.png', text: '图片' },
      { img: '../editor/images/youxu.png', text: '编号', name: 'list', value: 'ordered' },
    ],


    imageList: [],
    // 文章标题
    title: " ",
    // 文章内容
    titleContent: " ",
    // 记录编辑器
    editor:null,
    // 学校名
    schoolName: " ",
    //文章id
    questionID: 0,
    // 记录用户是否匿名,默认为0，不匿名
    is_anonymity: 0,
    isLimingText: "否",
    // 草稿id
    draft: 0,
    // 七牛云token
    Qtoken: null,
    // 记录是否由草稿信箱跳转过来
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
      // let { articleID } = options
      // 如果是草稿页跳转过来，articleID是草稿id，当获取到草稿详情时，将其赋值为草稿所属问题id
      var that = this
      this.setData({
        questionID: options.articleID,
        isBox: options.isBox
      })

      console.log("我是发布问题回答:" + that.data.isBox)

      if (that.data.isBox) {

        that.setData({
          draft: that.data.questionID
        })

        console.log("你好啊")
        // 由草稿信箱跳转过来，获取草稿数据
        wx.request({
          url: app.globalData.ykUrl + "draft/answer?draft=" + that.data.questionID,
          header: {
            Authorization: app.globalData.token,
          },
          dataType: 'json',
          data: {},
          method: 'GET',
          responseType: 'text',
          success: (res) => {
            // console.log("我是HTML：" + res.data.concat)
            that.setData({
              // 文章内容
              titleContent: JSON.parse(res.data.content),
              questionID: res.data.question,
              is_anonymity: res.data.is_anonymity
            })
            console.log("文章内容(onLoad中):" + that.data.titleContent)
            if(that.data.editor != null){
              that.data.editor.setContents({html:that.data.titleContent})
            }


            if (that.data.is_anonymity == 0) {
              that.setData({
                isLimingText: "否"
              })
            } else {
              that.setData({
                isLimingText: "时"
              })
            }
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
          that.setData({
            Qtoken: res.data.uptoken
          })
          // console.log("uptoken:" + this.data.Qtoken)
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
    onEditorReady(options) {
      console.log('编辑器初始化完成时触发')

      // 返回一个 SelectorQuery 对象实例。在自定义组件或包含自定义组件的页面中，应使用this.createSelectorQuery()来代替。
      // https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createSelectorQuery.html 

      // this.createSelectorQuery().select('#editor').context(res => {
      //   console.log('createSelectorQuery=>', res)
      //   this.editorCtx = res.context;
      //   // this.setContents(this.data.titleContent); //设置富文本内容

      //   this.editorCtx.setContents({ html:this.dataa.title})
      // }).exec();

      const that = this
      wx.createSelectorQuery().select('#editor').context(function (res) {
        that.editorCtx = res.context
        // that.editorCtx.setContents({ html: '123' })

        console.log("编辑器初始化时接收到的HTML:" + that.data.titleContent)
        that.editorCtx.setContents({html:that.data.titleContent})
        that.setData({
          editor:that.editorCtx
        })
      }).exec()
    },

    //设置富文本内容

    setContents(richtext) {
      if (this.data.isBox) {
        this.editorCtx.setContents({
          html: richtext,
          success: res => {
            console.log('[setContents success--]', res)
          }
        })
      }

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

    //每次点击功能栏时，都会触发此函数
    format(res) {
      let {
        name,
        value
      } = res.currentTarget.dataset;
      if (!name) this.insert(res);
      this.editorCtx.format(name, value);
    },

    insert(e) {
      var text = e.currentTarget.dataset.text
      if (text == "图片") {
        this.insert_img()
      } else if (text == "日期") {
        this.insert_date()
      } else if (text == "分隔线") {
        this.insert_line()
      }
    },

    /*下面一段，都是十分简单的，调用一下接口而已，看起来复杂，其实很简单*/
    undo() {
      this.editorCtx.undo();
    },
    redo() {
      this.editorCtx.redo();
    },
    clear() {
      this.editorCtx.clear()
    },

    // 上传图片
    insert_img() {
      var that = this;
      this.initQiniu();
      wx.chooseImage({
        count: 1,
        success: res => {

          var path = res.tempFilePaths[0];
          var seePath = " "
          var index = this.data.imageList.length;
          this.data.imageList[index] = path;

          // 交给七牛上传
          qiniuUploader.upload(path, (res) => {
            // 得到上传后的图片链接
            seePath = res.imageURL
            console.log("图片地址：" + seePath)

            // 预览图片
            that.insertImageMethod(seePath).then(res => {
              console.log('[insert image success callback]=>', res)
            }).catch(res => {
              console.log('[insert image fail callback]=>', res)
            });
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

    // 预览图片
    insertImageMethod(path) {
      return new Promise((resolve, reject) => {
        this.editorCtx.insertImage({
          src: path,

          data: {
            id: 'imgage',
          },
          success: res => {
            resolve(res);
            console.log("图片")
          },
          fail: res => {
            reject(res);
          }
        })
      })
    },

    insert_date() {
      const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
      }

      const str_date = date => {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()

        return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
      }
      this.editorCtx.insertText({
        text: str_date(new Date())
      })
    },

    insert_line() {
      this.editorCtx.insertDivider({
        success: res => {
          console.log('[insert line success]', res)
        }
      })
    },

    // 获取学校名
    chooseSchool: function (e) {
      this.setData({
        schoolName: e.detail.value
      })
      console.log("杨康:" + this.data.schoolName)
    },

    // 用户是否匿名
    isLIMing: function () {
      if (this.data.isLimingText == "否") {
        this.setData({
          isLimingText: "是",
          is_anonymity: 1
        })
      } else {
        this.setData({
          isLimingText: "否",
          is_anonymity: 0
        })
      }
    },

    // 保存到草稿信箱
    save: function () {
      // 将用户要发布的信息转为json格式
      var ykJson = " "

      var that = this
      this.editorCtx.getContents({
        success(res) {
          console.log(res)
          console.log("html:" + res.html)
          console.log("text:" + res.text)
          that.setData({
            titleContent: res.html
          })



          if (res.text.length == 0 || res.text.length == 1) {
            wx.showToast({
              title: '没有文章内容不能保存！',
              icon: 'none'
            })
            return
          } else {
            wx.showLoading({
              title: '保存中...',
            })
            // 内容转json
            ykJson = JSON.stringify(that.data.titleContent)
          }

          var sendMessod = "POST"
          if (that.data.isBox) {
            sendMessod = "PUT"
          }

          //  发送文件（发布回答）
          wx.request({
            url: app.globalData.ykUrl + "draft/answer",
            data: {
              content: ykJson,
              // 回到所属问题id
              question: that.data.questionID,
              // 是否匿名（0：不匿名）
              is_anonymity: that.data.is_anonymity,
              // 草稿id
              draft: that.data.draft
            },
            header: {
              Authorization: app.globalData.token,
            },
            method: sendMessod,
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
              if (res.data.status == "ok") {
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
              }
            },
          })
        }
      })
    },

    //        提交数据
    // form发生submit事件会调用此函数 获取上下文
    formSubmit(e) {
      // 将用户要发布的信息转为json格式
      var ykJson = " "

      var that = this
      this.editorCtx.getContents({
        success(res) {
          console.log(res)
          console.log("html:" + res.html)
          console.log("text:" + res.text)
          that.setData({
            titleContent: res.html
          })



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
            // 内容转json
            ykJson = JSON.stringify(that.data.titleContent)
          }

          // // 将HTML转化为json
          // var string  = JSON.stringify(res.html)
          // console.log("json字符串：" + string)

          //  发送文件（发布回答）
          wx.request({
            url: app.globalData.ykUrl + "question/answer",
            data: {
              content: ykJson,
              // id
              question: that.data.questionID,
              // 是否匿名（0：不匿名）
              is_anonymity: that.data.is_anonymity
            },
            header: {
              Authorization: app.globalData.token,
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
              if (res.statusCode == 200) {
                // 发布成功，跳转到一个页面进行提示
                wx.showToast({
                  title: '发布成功',
                  icon: "success"
                })
              } else {
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
  }
})
