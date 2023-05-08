// pages/recharPay.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{
      id:1,
      time:1,
      price:1,
      isSelect:false
    },{
      id:2,
      time:10,
      price:8,
      isSelect:false

    },
    {
      id:3,
      time:20,
      price:12,
      isSelect:false

    },
    {
      id:4,
      time:30,
      price:15,
      isSelect:false

    },
    {
      id:5,
      time:40,
      price:20,
      isSelect:false

    },
    {
      id:6,
      time:100,
      price:50,
      isSelect:false

    }],
    selectIndex:-1,
  },

  select(e){
    let data = this.data.list
    data.map(item=>{
      item.isSelect = false
    })
    this.setData({
      list:data
    },()=>{
      this.setData({
        selectIndex:e.currentTarget.dataset.inx,
        ['list['+ e.currentTarget.dataset.inx +'].isSelect']:!this.data.list[e.currentTarget.dataset.inx].isSelect
      })
    })
  },

  submit(){
    console.log(this.data.list)
    let time = this.data.list.filter(item=>{
      return item.isSelect == true
    })
    if(time.length == 0){
      wx.showToast({
        title: '请选择充值次数',
        icon:"none"
      })
      return
    }else{
      wx.showModal({
        title: '充值次数',
        content: `确定充值${time[0].time}么？`,
        complete: (res) => {
          if (res.cancel) {
            
          }
      
          if (res.confirm) {
            let old = wx.getStorageSync('currentUserInfo')
            let newObj = wx.getStorageSync('currentUserInfo')
            newObj.shenyucishu = parseInt(old.shenyucishu) + parseInt(time[0].time)
            db.collection('user').where({
              openId:wx.getStorageSync('currentUserInfo').openId
            }).update({
              data:{
                shenyucishu:newObj.shenyucishu
              }
            }).then(res=>{
              wx.showToast({
                title: '充值成功',
                icon:'success',
                duration:1000
              })
              wx.setStorageSync('currentUserInfo', newObj)
              setTimeout(()=>{
                wx.navigateBack()
              },1000)
            })
          }
        }
      })
    }
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
      title: '剩余次数重置',
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