// components/rt/rt.js
const qiniuUploader = require("qiniuUploader.js");
const app = getApp()


//获取应用实例
// var app = getApp()

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

    ykFunction: [
      { img: './images/H1.png', text: '标题1', name: 'header', value: 1 },
      { img: './images/H2.png', text: '标题2', name: 'header', value: 2 },
      { img: './images/H3.png', text: '标题3', name: 'header', value: 3 },
      { img: './images/B.png', text: '加粗', name: 'bold' },
      { img: './images/I.png', text: '斜体', name: 'italic' },
      { img: './images/U.png', text: '下划线', name: 'underline' }
    ],
    duanluo: [
      { img: './images/left.png', text: '左对齐', name: 'align', value: 'left' },
      { img: './images/center.png', text: '居中', name: 'align', value: 'center' },
      { img: './images/right.png', text: '右对齐', name: 'align', value: 'right' },
      { img: './images/liangduan.png', text: '两端', name: 'align', value: 'justify' }],
    charu: [
      { img: './images/img.png', text: '图片' },
      { img: './images/rili.png', text: '日期' },
      { img: './images/line.png', text: '分隔线' },
      { img: './images/task.png', text: '待办', name: 'list', value: 'unchecked' },
      { img: './images/youxu.png', text: '编号', name: 'list', value: 'ordered' },
      { img: './images/wuxu.png', text: '列表', name: 'list', value: 'bullet' }],


    imageList: [],
    // 文章标题
    title: " ",
    // 文章内容
    titleContent: " ",
    // 学校信息
    schoolName: "输入学校名",
    schoolID: null,

    // 文章id
    questionID: 0,
    // 记录七牛云的token
    Qtoken: " ",
    // 如果上一个页面是讨论页，则不需要底部功能条
    isMeishiTaolun: false
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
      let { articleID } = options

      this.setData({
        questionID: articleID
      })

      // 判断该页面的上一个页面是问题发布页还是美食讨论页（美食讨论页不需要插入图片等操作）
      var pages = getCurrentPages();
      var prepage = pages[pages.length - 2];//上一页面指针
      if (prepage.route == 'pages/index/detail/taolun/huifu') {
        this.setData({
          isMeishiTaolun: true
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
      console.log("杨康的title2：" + e.detail.value)
      this.setData({
        title: e.detail.value
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
        html: richtext,
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
          console.log("到这")
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
            console.error('图片上传失败: ' + JSON.stringify(error));
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
      // 用户没有填写学校信息，去搜索页填写
      console.log("我是学校名2：" + app.globalData.schoolName2)

      if (this.data.schoolID == null) {
        if (app.globalData.schoolName != null) {
          this.setData({
            schoolName: app.globalData.schoolName,
            schoolID: app.globalData.schoolID
          })
        } else {
          if (app.globalData.schoolName2 != null) {
            this.setData({
              schoolName: app.globalData.schoolName2,
              schoolID: app.globalData.schoolID2
            })
          } else {
            // 判断出没有学校信息，去搜索
            wx.navigateTo({
              url: '/pages/index/search/search',
            })
          }
        }
      }
    },

    //        提交数据
    formSubmit(e) {
      // 获取标题  
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

          if (that.data.title.length < 4) {
            wx.showToast({
              title: '请输入四字以上标题',
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

            // 内容转json
            ykJson = JSON.stringify(that.data.titleContent)
          }

          // 判断学校名是否为空
          if (that.data.isMeishiTaolun == false) {
            if (that.data.schoolName.length < 4) {
              wx.showToast({
                title: '请填写学校名',
                icon: 'none'
              })
              return
            }
          }


          //  发送文件（发表问题）
          if (that.data.isMeishiTaolun == false) {
            // 发布问题
            wx.request({
              url: app.globalData.ykUrl + "question",
              data: {
                content: ykJson,
                school: that.data.schoolID,
                // school: 1,
                title: that.data.title
              },
              header: {
                Authorization: app.globalData.token,
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: (res) => {
                // if (res.statusCode == 201) {
                // 发布成功，跳转到一个页面进行提示
                wx.showToast({
                  title: '发布成功',
                  icon: "success"
                })
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
          } else {
            // 发布美食讨论
            wx.request({
              url: app.globalData.ykUrl + "food/discuss/comment",
              data: {
                // 美食的id
                discuss: that.data.questionID,
                content: that.data.title
              },
              header: {
                Authorization: app.globalData.token,
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: (res) => {
                // if (res.statusCode == 201) {
                // 发布成功，跳转到一个页面进行提示
                wx.showToast({
                  title: '发布成功',
                  icon: "success"
                })
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

        }
      })
    },

    onShow: function () {
      if (app.globalData.schoolName2 != null) {
        this.setData({
          schoolName: app.globalData.schoolName2,
          schoolID: app.globalData.schoolID2
        })
      } else {
        if (app.globalData.schoolName != null) {
          this.setData({
            schoolName: app.globalData.schoolName,
            schoolID: app.globalData.schoolID
          })
        }
      }
    },
  }
})
