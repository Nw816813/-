// pages/editUserInfo.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    op:'login',
    userPhone:"",
    userNickName: "",
    userAvatar: "https://ts1.cn.mm.bing.net/th/id/R-C.91a98c87ee719c8d93fae53b2666d723?rik=i1fomqvSpnZGNQ&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f5657474daecbe02.jpg&ehk=ehi%2fb1N%2brynMsjEQKjtH0Lvrno7RRt3vu8Vgz1dQjHY%3d&risl=&pid=ImgRaw&r=0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      op:options.time
    })
  },
  getPhone(e){
    this.setData({
      userPhone:e.detail.value
    })
  },
  getName(e){
    this.setData({
      userNickName:e.detail.value
    })
  },

  chooseAvatar(e) {
    console.log(e)
    wx.cloud.uploadFile({
      cloudPath:'myImage/' + new Date().getTime() + "_" +  Math.floor(Math.random()*1000) + ".jpg",//使用时间戳加随机数作为上传至云端的图片名称
      filePath:e.detail.avatarUrl,// 本地文件路径
      success:res=>{
        console.log(res,'res')
        this.setData({
          userAvatar: res.fileID
        })
      }
    })
  },

  formsubmit(e) {
    console.log(this.data)
    this.setData({
      userNickName: e.detail.value.nickname
    }, async () => {
      if (this.data.userNickName == '' || this.data.userAvatar == '' || this.data.userPhone == '') {
        wx.showToast({
          title: '请填写完整',
          icon: 'none'
        })
        return
      } else {
        if(this.data.op == 'login'){
          wx.reLaunch({
            url: '/pages/user/user?userNickName=' + this.data.userNickName + '&userAvatar=' + this.data.userAvatar + '&userPhone=' +  this.data.userPhone,
          })
        }else{
          db.collection('user').where({
            openId:wx.getStorageSync('currentUserInfo').openId
          }).update({
            data:{
              userNickName:this.data.userNickName,
              userPhone:this.data.userPhone
            }
          }).then(res=>{
            console.log(res)
            if(res.stats.updated == 0 || res.stats.updated == 1){
              let newUser = wx.getStorageSync('currentUserInfo')
              newUser.userNickName = this.data.userNickName
              newUser.userAvatar = this.data.userAvatar
              newUser.userPhone = this.data.userPhone
              wx.setStorageSync('currentUserInfo', newUser)
              wx.showToast({
                title: '更新成功',
                icon:'none'
              })
              setTimeout(()=>{
                wx.navigateBack({
                  delta:1
                })
              },1000)
            }
          })
        }
      }
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
    if(wx.getStorageSync('currentUserInfo')){
      this.setData({
        userNickName:wx.getStorageSync('currentUserInfo').userNickName,
        userAvatar:wx.getStorageSync('currentUserInfo').userAvatar,
        userPhone:wx.getStorageSync('currentUserInfo').userPhone,
      })
    }
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