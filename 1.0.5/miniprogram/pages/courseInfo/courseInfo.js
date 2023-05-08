// pages/courseInfo.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  toDel(e) {
    console.log(e.currentTarget.dataset._id)
    db.collection('course').where({
      _id: e.currentTarget.dataset._id
    }).remove().then(res => {
      wx.showToast({
        title:'删除成功',
        icon:"success"
      })
      this.getCourse()
    })
  },
  toEdit(e) {
    console.log(e.currentTarget.dataset._id)
    wx.navigateTo({
      url: '/pages/course/course?op=edd&_id=' + e.currentTarget.dataset._id,
    })
  },
  toAdd() {
    wx.navigateTo({
      url: '/pages/course/course?op=add',
    })
  },

  getCourse() {
    db.collection('course').orderBy('time', 'desc').get().then(res => {
      console.log(res, 'res')
      this.setData({
        course: res.data
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
      title: '课程管理',
    })
    this.getCourse()
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