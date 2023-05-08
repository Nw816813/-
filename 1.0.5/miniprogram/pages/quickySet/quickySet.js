
// pages/quickySet.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherAvatar: [],
    selectAvatarIndex: -1,
    courseTag: [],
    selectCourseTagIndex: -1,
    teacherNameList: [],
    selectTeacherNameIndex: -1,

    courseIntroduce:[],
    selectCourseIntroduceIndex: -1,
  },

  sureSubmit() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]; //上一页面
    if (this.data.selectAvatarIndex !== -1) {
      let url = this.data.teacherAvatar[this.data.selectAvatarIndex].fileID
      console.log(url)
      prevPage.setData({
        teacherAvatar:url
      });
    }
    if (this.data.selectCourseTagIndex !== -1) {
      let string = this.data.courseTag[this.data.selectCourseTagIndex].tag
      prevPage.setData({
        courseTag:string,
        indexTwo:this.data.selectCourseTagIndex
      });
    }
    if (this.data.selectCourseIntroduceIndex !== -1) {
      let string = this.data.courseIntroduce[this.data.selectCourseIntroduceIndex].introduce
      prevPage.setData({
        courseIntroduce:string,
      });
    }

    if (this.data.selectTeacherNameIndex !== -1) {
      let string = this.data.teacherNameList[this.data.selectTeacherNameIndex].name
      console.log(string,'stringstring')
      prevPage.setData({
        teacherName:string,
        index:this.data.selectTeacherNameIndex
      });
    }
    wx.navigateBack(1)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTeacherAvatar()
    this.getCourseTag()
    this.getTeacherName()
    this.getCourseIntroduce()

  },
  selectTeacherName(e) {
    this.setData({
      selectTeacherNameIndex: e.currentTarget.dataset.inx
    })
  },
  selectCourseIntroduce(e){
    this.setData({
      selectCourseIntroduceIndex: e.currentTarget.dataset.inx
    })
  },
  addCourseIntroduce(){
    wx.showModal({
      editable: true,
      title: 'addCourseIntroduce',
      complete: (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          console.log(res.content)
          db.collection('courseIntroduce').add({
            data: {
              introduce: res.content
            }
          }).then(res => {
            this.getCourseIntroduce()
          })
        }
      }
    })
  },
  getCourseIntroduce() {
    db.collection('courseIntroduce').get().then(res => {
      console.log(res, 'res')
      this.setData({
        courseIntroduce: res.data
      })
    })
  },
  getTeacherName() {
    db.collection('teacherName').get().then(res => {
      console.log(res, 'res')
      this.setData({
        teacherNameList: res.data
      })
    })
  },
  addTeacherName() {
    wx.showModal({
      editable: true,
      title: 'addTeacherName',
      complete: (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          console.log(res.content)
          db.collection('teacherName').add({
            data: {
              name: res.content
            }
          }).then(res => {
            this.getTeacherName()
          })
        }
      }
    })
  },
  selectCourseTag(e) {
    this.setData({
      selectCourseTagIndex: e.currentTarget.dataset.inx
    })
  },
  getCourseTag() {
    db.collection('courseTag').get().then(res => {
      console.log(res, 'res')
      this.setData({
        courseTag: res.data
      })
    })
  },
  addTag() {
    wx.showModal({
      editable: true,
      title: 'addTag',
      complete: (res) => {
        if (res.cancel) {

        }
        if (res.confirm) {
          console.log(res.content)
          db.collection('courseTag').add({
            data: {
              tag: res.content
            }
          }).then(res => {
            this.getCourseTag()
          })
        }
      }
    })
  },

  selectAvatar(e) {
    this.setData({
      selectAvatarIndex: e.currentTarget.dataset.inx
    })
    console.log(e.currentTarget.dataset.inx)
  },

  uploadImg() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: res => {
        wx.cloud.uploadFile({
          cloudPath: 'myImage/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg", //使用时间戳加随机数作为上传至云端的图片名称
          filePath: res.tempFilePaths[0], // 本地文件路径
          success: res => {
            console.log(res, 'res')
            db.collection('teacherAvatar').add({
              data: {
                fileID: res.fileID
              }
            }).then(res => {
              this.getTeacherAvatar()
            })
          }
        })
      }
    })
  },

  getTeacherAvatar() {
    db.collection('teacherAvatar').get().then(res => {
      console.log(res, 'res')
      this.setData({
        teacherAvatar: res.data
      })
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
    wx.setNavigationBarTitle({
      title: '快速选择',
    })
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