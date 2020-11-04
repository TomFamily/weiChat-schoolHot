// components/rt/rt.js
const qiniuUploader = require("qiniuUploader.js");
const app = getApp()

// 初始化七牛相关参数
function initQiniu() {
  //配置详解 https://github.com/gpake/qiniu-wxapp-sdk/blob/master/README.md
  var options = {
    region: 'ECN', // 华东区 根据存储区域填写
    uptokenURL: 'UpTokenURL.com/uptoken',//// 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "0MLvWPnyy..."}
    //uptoken生成地址：http://pchou.qiniudn.com/qiniutool/uptoken.html deadline的时间设置长一些
    uptoken: getApp().data.qiniu_uptoken,
    domain: getApp().data.qiniu_domain
  };
  qiniuUploader.init(options);
}


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
      value: '发表'
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

    // 美食评分
    meiShiSorce: 0,
    imageList: [],
    // 文章内容（text）
    titleContent: " ",
    isMeishiComment: false,
    // 文章id
    questionID: 0,
    // 发布类型
    type: 0,
    // 问题回复的目标用户
    target_user: 0,

    // 记录1到5颗星是否亮
    yk1:false,
    yk2:false,
    yk3:false,
    yk4:false,
    yk5:false

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

      // 获取上一个页面传过来的标识发布类型的type
      // （1：评论 2：回复 3：短评(评分) 4：美食讨论的评论）
      this.setData({
        questionID: options.articleID,
        target_user: options.articleID2, //可能没有
        type: options.type
      })
      console.log("发布页的questionID：" + this.data.questionID)
      console.log("发布页的targetID：" + this.data.target_user)
      console.log("发布页的targetID：" + options.articleID2)
      console.log("发布页的targetID：" + options.type)
      if (this.data.type == 3) {
        this.setData({
          isMeishiComment: true
        })
      }


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
    undo() { this.editorCtx.undo(); },
    redo() { this.editorCtx.redo(); },
    clear() { this.editorCtx.clear() },

    // 上传图片
    insert_img() {
      var that = this;
      initQiniu();
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

    // 获取短评对美食的评分
    chooseSchool: function (e) {
      var id = e.target.id

      this.data.yk1

      if(id == "yk1"){
        // 判断yk1的状态
        if(this.data.yk1 == false){
          // 没有点亮
          this.setData({
            yk1:true,
            meiShiSorce:1
          })
        }else{
          this.setData({
            yk1:false,
            yk2:false,
            yk3:false,
            yk4:false,
            yk5:false,
            meiShiSorce:0
          })
        }
      }else if(id == "yk2"){
        if(this.data.yk2 == false){
          // 没有点亮
          this.setData({
            yk1:true,
            yk2:true,
            meiShiSorce:2
          })
        }else{
          this.setData({
            yk1:false,
            yk2:false,
            yk3:false,
            yk4:false,
            yk5:false,
            meiShiSorce:0
          })
        }
      }else if(id == "yk3"){
        if(this.data.yk3 == false){
          // 没有点亮
          this.setData({
            yk1:true,
            yk2:true,
            yk3:true,
            meiShiSorce:3
          })
        }else{
          this.setData({
            yk1:false,
            yk2:false,
            yk3:false,
            yk4:false,
            yk5:false,
            meiShiSorce:0
          })
        }
      }else if(id == "yk4"){
        if(this.data.yk4 == false){
          // 没有点亮
          this.setData({
            yk1:true,
            yk2:true,
            yk3:true,
            yk4:true,
            meiShiSorce:4
          })
        }else{
          this.setData({
            yk1:false,
            yk2:false,
            yk3:false,
            yk4:false,
            yk5:false,
            meiShiSorce:0
          })
        }
      }else if(id == "yk5"){
        if(this.data.yk5 == false){
          // 没有点亮
          this.setData({
            yk1:true,
            yk2:true,
            yk3:true,
            yk4:true,
            yk5:true,
            meiShiSorce:5
          })
        }else{
          this.setData({
            yk1:false,
            yk2:false,
            yk3:false,
            yk4:false,
            yk5:false,
            meiShiSorce:0
          })
        }
      }


    },

    //        提交数据
    // form发生submit事件会调用此函数 获取上下文
    formSubmit(e) {

      var that = this
      this.editorCtx.getContents({
        success(res) {
          console.log(res)
          console.log("html:" + res.html)
          console.log("text:" + res.text)
          that.setData({
            titleContent: res.text
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
          }

          if (that.data.type == 3) {
            // 美食发布短评
            if (that.data.meiShiSorce == 0) {
              wx.showToast({
                title: "请给美食打分",
                icon: 'none'
              })
              that.setData({
                meiShiSorce: 0,
              })
              return
            }
          }

          // 发布文件
          // （1：评论 2：回复 3：短评(评分) 4：美食讨论的评论）
          if (that.data.type == 1) {
            wx.request({
              url: app.globalData.ykUrl + "question/comment",
              data: {
                content: that.data.titleContent,
                answer: that.data.questionID
              },
              header: {
                Authorization: app.globalData.token,
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: (res) => {
                if (res.data.status == "ok") {
                  // 发布成功，跳转到一个页面进行提示
                  console.log("res.status:" + res.data.status)
                  wx.showToast({
                    title: '发布成功',
                    icon: "success"
                  })
                } else {
                  console.log("res.status:" + res.data.status)
                  console.log("res.error:" + res.data.error)
                  wx.showToast({
                    title: '发布失败，服务器错误',
                    icon: 'none'
                  });
                }
              },
            })
          } else if (that.data.type == 2) {

            console.log(that.data.titleContent)
            console.log( that.data.questionID)
            console.log(that.data.target_user)
            console.log(app.globalData.token)

            wx.request({
              url: app.globalData.ykUrl + "question/revert",
              data: {
                content: that.data.titleContent,
                // 所属评论
                comment: that.data.questionID,
                target_user: that.data.target_user
              },
              header: {
                Authorization: app.globalData.token,
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: (res) => {
                if (res.data.status == "ok") {
                  // 发布成功，跳转到一个页面进行提示
                  console.log("res.status:" + res.data.status)
                  wx.showToast({
                    title: '发布成功',
                    icon: "success"
                  })
                } else {
                  console.log("res.status:" + res.data.status)
                  console.log("res.error:" + res.data.error.target_user)
                  wx.showToast({
                    title: '发布失败，服务器错误',
                    icon: 'none'
                  });
                }
              },
            })
          } else if (that.data.type == 3) {
            wx.request({
              url: app.globalData.ykUrl + "food/shortcomment",
              data: {
                // 美食content
                content: that.data.titleContent,
                // id
                food: that.data.questionID,
                score: that.data.meiShiSorce,
              },
              header: {
                Authorization: app.globalData.token,
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: (res) => {
                if (res.data.status == "ok") {
                  // 发布成功，跳转到一个页面进行提示
                  console.log("res.status:" + res.data.status)
                  console.log("res.error:" + res.data.error)
                  wx.showToast({
                    title: '发布成功',
                    icon: "success"
                  })
                } else {
                  console.log("res.status:" + res.data.status)
                  console.log("res.error:" + res.data.error)
                  wx.showToast({
                    title: '发布失败，服务器错误',
                    icon: 'none'
                  });
                }
              },
            })
          } else if (that.data.type == 4) {

            console.log("res.error:" + that.data.titleContent)
            console.log("questionID:" + that.data.questionID)
            wx.request({
              url: app.globalData.ykUrl + "food/discuss/comment",
              header: {
                Authorization: app.globalData.token,
              },
              data: {
                content: that.data.titleContent,
                // 文章id
                // discuss: parseInt(that.data.questionID)
                discuss: that.data.questionID
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: (res) => {
                if (res.data.status == "ok") {
                  // 发布成功，跳转到一个页面进行提示
                  console.log("res.status:" + res.data.status)
                  console.log("res.error:" + res.data.error)
                  wx.showToast({
                    title: '发布成功',
                    icon: "success"
                  })
                } else {
                  console.log("res.status:" + res.data.status)
                  console.log("res.error:" + res.data.error.content)
                  console.log("res.error:" + res.data.error.discuss)
                  wx.showToast({
                    title: '发布失败，服务器错误',
                    icon: 'none'
                  });
                }
              },
            })
          }
        }
      })
    },
  }
})
