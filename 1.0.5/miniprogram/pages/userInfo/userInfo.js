const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUser()
  },
  jumpTo(e) {
    wx.navigateTo({
      url: '/pages/oneUserType/oneUserType?id=' + e.currentTarget.dataset.openid,
    })
  },
  editTime(e) {
    wx.showModal({
      editable: true,
      title: '配置到期时间',
      content: e.currentTarget.dataset.time,
      complete: (res) => {
        if (res.cancel) {
          console.log(res)
        }

        if (res.confirm) {
          console.log(res.content)
          db.collection('user').where({
            openId: e.currentTarget.dataset.openid
          }).update({
            data: {
              daoqishijian: res.content
            }
          }).then(res => {
            console.log(res)
            if (res.errMsg == "collection.update:ok") {
              wx.showToast({
                title: '配置成功',
                icon: 'success',
                duration: 1000
              })
            }
            this.getUser()
          })
        }
      }
    })
  },
  edit(e) {
    console.log(e.currentTarget.dataset.openid, 'e')
    let time = e.currentTarget.dataset.time + ''
    wx.showModal({
      editable: true,
      title: '配置剩余次数',
      content: time,
      complete: (res) => {
        if (res.cancel) {
          console.log(res)
        }

        if (res.confirm) {
          console.log(res.content)
          // let time = parseInt(res.content)
          db.collection('user').where({
            openId: e.currentTarget.dataset.openid
          }).update({
           data:{
            shenyucishu: res.content
           }
          }).then(resT => {
            console.log(resT)
            if (resT.errMsg == "collection.update:ok") {
              if (e.currentTarget.dataset.openid == wx.getStorageSync('currentUserInfo').openId) {
                let newItem = wx.getStorageSync('currentUserInfo')
                newItem.shenyucishu =  res.content
                wx.setStorageSync('currentUserInfo', newItem)
              }
              wx.showToast({
                title: '配置成功',
                icon: 'success',
                duration: 1000
              })
            }
            this.getUser()
          })
        }
      }
    })
  },

  getUser() {
    db.collection('user').orderBy('role', 'desc').get().then(res => {
      console.log(res, 'res')
      this.setData({
        user: res.data
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
      title: '用户管理',
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