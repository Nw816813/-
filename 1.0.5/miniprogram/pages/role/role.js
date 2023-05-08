
// pages/role.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  toUserType(){
    wx.navigateTo({
      url: '/pages/userType/userType',
    })
  },

  toUserInfo(){
    wx.navigateTo({
      url: '/pages/userInfo/userInfo',
    })
  },

  toCourseInfo(){
    wx.navigateTo({
      url: '/pages/courseInfo/courseInfo',
    })
  },

  toTodayCourse(){
    wx.navigateTo({
      url: '/pages/todayCourse/todayCourse',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
      title: '管理员入口',
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