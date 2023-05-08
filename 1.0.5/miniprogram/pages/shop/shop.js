// pages/shop/shop.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    value:'',
    tabs: ['ALL', '次卡', '通卡'],
    tabIndex: 0,
    allGoods:[]
  },

  onTabClick(e) {
    let id = e.currentTarget.id;
    this.setData({
      tabIndex: id,
    })
  },

  getTopList(){ 
   
    wx.cloud.database().collection('shopSwiper').get()
    .then(res => { 
     
    console.log("数据上传成功",res)
    this.setData ({ 
     
      list:res.data 
    })
  })
  },

  getGoods(){ 
   
    wx.cloud.database().collection('AllGoods').get()
    .then(res => { 
     
    console.log("商品上传成功",res)
    this.setData ({ 
     
      allGoods:res.data 
    })
  })
  },
  toDetail(e){
    console.log("获取的值是", e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/GoodsDetail/GoodsDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function() {
    this.getTopList()
    this.getGoods()

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

