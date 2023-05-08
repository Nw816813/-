
// pages/courseInfo.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    course:[],
    today:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDay()
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
      y: y,
      m: m,
      d: d,
      w: week,
      today:y+'-'+m+'-'+d
    })
  },
  toEdit(e){
    console.log(e.currentTarget.dataset._id)
    wx.navigateTo({
      url: '/pages/course/course?op=edd&_id=' + e.currentTarget.dataset._id,
    })
  },
  toAdd(){
    wx.navigateTo({
      url: '/pages/course/course?op=add',
    })
  },

  getCourse(){
    db.collection('courseBook').orderBy('_id', 'desc').get().then(res=>{
      console.log(res,'res')
      res.data = res.data.filter(item=>{
        let day =  item.time.split(' ')
        return this.data.today == day[0]
      })
      this.setData({
        course:res.data
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
      title: '今日课程列表',
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