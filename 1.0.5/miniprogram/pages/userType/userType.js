// pages/userType.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  toDelete(e){
    db.collection('userType').where({
      _id:e.currentTarget.dataset.id
    }).remove().then(res=>{
      wx.showToast({
        title: '删除成功',
        icon:"success",
        duration:1000
      })
      setTimeout(()=>{
          this.getList()
      },1000)
    })
  },

  toEdit(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/addUserType/addUserType?id=' + e.currentTarget.dataset.id,
    })
  },

  getList(){
    db.collection('userType').get().then(res=>{
        this.setData({
          list:res.data
        })
    })
  },

  jumpAdd(){
    wx.navigateTo({
      url: '/pages/addUserType/addUserType',
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
      title:'会员类型'
    })
    this.getList()
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