// pages/GoodsDetail/GoodsDetail.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Shoplist:[],

  },
  onBack() {
    wx.switchTab({
      url: '/pages/shop/shop',
    })
    console.log(123);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('idis:',options)
    this.getGoodsDetail(options.id)
    this.attention()
    

  },
  getGoodsDetail(id){
    db.collection('AllGoods').where({
      _id:id
    }).get().then(res=>{
      console.log("hey", res)
      wx.setNavigationBarTitle({
        title: res.data[0].name,
      })
      this.setData({
        Shoplist:res.data[0],
      })

    })
  },

  attention(){
    wx.showToast({
      title: '请联系客服购买',
      icon: 'none'
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