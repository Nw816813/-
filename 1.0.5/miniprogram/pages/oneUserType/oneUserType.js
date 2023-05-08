// pages/oneUserType.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userNickName: "",
    userTypeBg: "",
    userTypeEndTime: "",
    userTypeName: "",
    date: "",
    array: [],
    index: 0,
    allArray: [],
    userId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.getUser(options.id)
    this.setData({
      userId: options.id
    })
  },

  submit() {
    console.log(this.data)
    db.collection('user').where({
      openId: this.data.userId,
    }).update({
      data: {
        userTypeName: this.data.userTypeName,
        userTypeBg: this.data.userTypeBg,
        userTypeEndTime: this.data.userTypeName == '普通用户' ? '' : this.data.date,
      }
    }).then(res => {
      let newStorage = wx.getStorageSync('currentUserInfo')
      newStorage.userTypeName = this.data.userTypeName
      newStorage.userTypeBg = this.data.userTypeBg
      newStorage.userTypeEndTime = this.data.userTypeName == '普通用户' ? '' : this.data.date
      wx.setStorageSync('currentUserInfo', newStorage)
      wx.showToast({
        title: '配置成功',
        icon: 'success',
        duration: 1000
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/user/user',
        })
      }, 1000)
    })
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      userTypeBg: this.data.allArray[e.detail.value].img,
      userTypeName: this.data.allArray[e.detail.value].type,
    })
  },

  getAllType() {
    db.collection('userType').get().then(res => {
      let copyArray = JSON.parse(JSON.stringify(this.data.array))
      res.data.map(item => {
        copyArray.push(item.type)
      })
      this.setData({
        allArray: res.data,
        array: copyArray
      }, () => {
        console.log(this.data.array)
        console.log(this.data.userTypeName)
        let inx = -1
        for(let i=0;i<this.data.array.length;i++){
          if(this.data.array[i] == this.data.userTypeName){
            inx = i
          }
        }
        console.log(inx)
        this.setData({
          index: inx
        })
      })
    })
  },

  getUser(id) {
    db.collection('user').where({
      openId: id
    }).get().then(res => {
      console.log(res, 'res')
      this.setData({
        userNickName: res.data[0].userNickName,
        userTypeBg: res.data[0].userTypeBg,
        userTypeName: res.data[0].userTypeName,
        userTypeEndTime: res.data[0].userTypeEndTime,
        date: res.data[0].userTypeEndTime,
      }, () => {
        this.getAllType()

      })
      wx.setNavigationBarTitle({
        title: `配置${res.data[0].userNickName}用户会员类型`
      })
    })
  },

  getOneUser() {},

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