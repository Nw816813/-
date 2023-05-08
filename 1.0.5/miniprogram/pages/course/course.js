// pages/course.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherNameArray: [],
    index: 0,
    courseTagArray: [],
    indexTwo: 0,
    teacherName: "",
    teacherAvatar: "",
    courseDate: '',
    courseTime: "请选择",
    courseTimeEnd: '请选择',
    courseNeed: "",
    courseTag: "",
    courseIntroduce: "",
    openId: wx.getStorageSync('currentUserInfo')._openid,
    time: new Date().getTime() / 1000,

    current: {},

    editId: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.getDay()
    this.getTeacherName()
    this.getCourseTag()
    wx.setNavigationBarTitle({
      title: options.op == 'add' ? '添加课程' : '编辑课程',
    })
    if (options._id) {
      this.setData({
        editId: options._id
      })
      this.getCourseInfo(options._id)
    }

  },
  getCourseTag() {
    db.collection('courseTag').get().then(res => {
      console.log(res, 'res')
      this.setData({
        courseTagArray: res.data,
        courseTag: res.data[0].tag
      })
    })
  },
  bindPickerTeacherChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      teacherName: this.data.teacherNameArray[e.detail.value].name
    })
  },
  bindPickerCourseChange(e) {
    this.setData({
      indexTwo: e.detail.value,
      courseTag: this.data.courseTagArray[e.detail.value].tag

    })
  },
  getTeacherName() {
    db.collection('teacherName').get().then(res => {
      console.log(res, 'res')
      this.setData({
        teacherNameArray: res.data,
        teacherName: res.data[0].name
      })
    })
  },

  getCourseInfo(id) {
    db.collection('course').where({
      _id: id
    }).get().then(res => {
      console.log(res)
      this.setData({
        current: res.data[0],
        editId: res.data[0]._id
      })
      for (let k in res.data[0]) {
        this.setData({
          [k]: res.data[0][k]
        })
      }
    })
  },

  submit() {
    console.log(this.data.teacherNameArray[this.data.index].name)
    let name = this.data.teacherNameArray[this.data.index].name
    if(name == "BiuBiu"){
      this.data.teacherBG = 'cloud://cloud1-4g08alwo068bf874.636c-cloud1-4g08alwo068bf874-1317434842/teacherImg/biubiu.jpg'
    }
    if(name == "沸沸"){
      this.data.teacherBG = 'cloud://cloud1-4g08alwo068bf874.636c-cloud1-4g08alwo068bf874-1317434842/teacherImg/feifei.jpg'
    }
    if(name == "毛毛"){
      this.data.teacherBG = 'cloud://cloud1-4g08alwo068bf874.636c-cloud1-4g08alwo068bf874-1317434842/teacherImg/maomao.jpg'
    }
    if(name == "唐棋"){
      this.data.teacherBG = 'cloud://cloud1-4g08alwo068bf874.636c-cloud1-4g08alwo068bf874-1317434842/teacherImg/tangqi.jpg'
    }
    if(name == "小撒"){
      this.data.teacherBG = 'cloud://cloud1-4g08alwo068bf874.636c-cloud1-4g08alwo068bf874-1317434842/teacherImg/xiaosa.jpg'
    }
    if(name == "潇潇"){
      this.data.teacherBG = 'cloud://cloud1-4g08alwo068bf874.636c-cloud1-4g08alwo068bf874-1317434842/teacherImg/xiaoxiao.jpg'
    }
    if(name == "小米"){
      this.data.teacherBG = 'cloud://cloud1-4g08alwo068bf874.636c-cloud1-4g08alwo068bf874-1317434842/teacherImg/xiaomi.jpg'
    }
    if (this.data.editId == -1) {
      delete this.data.editId
      delete this.data.teacherNameArray;
      delete this.data.courseTagArray;
      db.collection('course').add({
        data: {
          ...this.data
        }
      }).then(res => {
        console.log(res, 'res')
        if (res.errMsg == 'collection.add:ok') {
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    } else {
      delete this.data._id;
      delete this.data._openid;

      db.collection('course').where({
        _id: this.data.editId
      }).update({
        data: {
          ...this.data
        }
      }).then(res => {
        console.log(res, 'res')
        if (res.errMsg == "collection.update:ok") {
          wx.showToast({
            title: '编辑成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
    // console.log(this.data)
    // console.log(this.data.teacherAvatar.includes("cloud"))
    // if(!this.data.teacherAvatar.includes("cloud")){
    //   wx.cloud.uploadFile({
    //     cloudPath:'myImage/' + new Date().getTime() + "_" +  Math.floor(Math.random()*1000) + ".jpg",//使用时间戳加随机数作为上传至云端的图片名称
    //     filePath:this.data.teacherAvatar,// 本地文件路径
    //     success:res=>{
    //       console.log(res,'res')
    //       this.setData({
    //         teacherAvatar: res.fileID
    //       },()=>{
    //         db.collection('course').add({
    //           data:{
    //             ...this.data
    //           }
    //         }).then(res=>{
    //           console.log(res,'res')
    //           if(res.errMsg == 'collection.add:ok'){
    //             wx.showToast({
    //               title: '创建成功',
    //               icon:'success',
    //               duration:1000
    //             })
    //             setTimeout(()=>{
    //               wx.navigateBack({
    //                 delta:1
    //               })
    //             },1000)
    //           }
    //         })
    //       })
    //     }
    //   })
    // }else{
    //   delete this.data._id;
    //   delete this.data._openid;
    //   db.collection('course').where({
    //     _id:this.data.current._id
    //   }).update({
    //     data:{
    //       ...this.data
    //     }
    //   }).then(res=>{
    //     console.log(res,'res')
    //     if(res.errMsg == "collection.update:ok"){
    //       wx.showToast({
    //         title: '编辑成功',
    //         icon:'success',
    //         duration:1000
    //       })
    //       setTimeout(()=>{
    //         wx.navigateBack({
    //           delta:1
    //         })
    //       },1000)
    //     }
    //   })
    // }

  },

  getValue(e) {
    console.log(e)
    let id = e.target.id;
    let value = e.detail.value
    this.setData({
      [id]: value
    })
  },

  uoloadAvatar() {
    wx.navigateTo({
      url: '/pages/quickySet/quickySet',
    })
    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'],
    //   sourceType: ['album', 'camera'],
    //   success:res=> {
    //     console.log(res,'reas')
    //     // tempFilePath可以作为img标签的src属性显示图片
    //     const tempFilePaths = res.tempFilePaths
    //     this.setData({
    //       teacherAvatar:res.tempFilePaths[0],
    //     })
    //   }
    // })
  },

  // 获取今天和周几
  getDay() {
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let weekNum = date.getDay()
    let list = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let week = list[weekNum]
    console.log(y, m, d, weekNum, week)
    this.setData({
      courseDate: y + '-' + m + '-' + d,
    })
  },

  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      courseTime: e.detail.value
    })
  },

  bindTimeChangeEnd: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      courseTimeEnd: e.detail.value
    })
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let str = e.detail.value.split('-')
    let m = parseInt(str[1])
    let d = parseInt(str[2])
    let newStr = str[0] + '-' + m + '-' + d
    this.setData({
      courseDate: newStr
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})