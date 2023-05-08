// pages/addUserType.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
    date: '请选择到期时间',
   * 
   */
  data: {
    id:"",
    img:"",
    type:"",
    // time:"",
  },

  submit(){
    console.log(this.data)
    delete this.data._openid
    if(this.data.id == ""){
      db.collection('userType').add({
        data:{
          img:this.data.img,
          type:this.data.type
        }
      }).then(res=>{
        wx.showToast({
          title: '添加成功',
          icon:'success',
          duration:1000
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          })
        },1000)
      })
    }else{
      let id = this.data.id
      delete this.data.id
      delete this.data._openid
      delete this.data._id
      db.collection('userType').where({
       _id:id
      }).update({
        data:{
          img:this.data.img,
          type:this.data.type
        }
      }).then(res=>{
        wx.showToast({
          title: '编辑成功',
          icon:'success',
          duration:1000
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          })
        },1000)
      })
    }
  },

  getInput(e){
    this.setData({
      type:e.detail.value
    })
  },

  uploads(){
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: res => {
        wx.cloud.uploadFile({
          cloudPath: 'myImage/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg", //使用时间戳加随机数作为上传至云端的图片名称
          filePath: res.tempFilePaths[0], // 本地文件路径
          success: res => {
            console.log(res, 'res')
            this.setData({
              img:res.fileID
            })
          }
        })
      }
    })
  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title:options.id ? '编辑会员类型' : '添加会员类型'
    })
    if(options.id){
      this.setData({
        id:options.id
      })
      this.getDetail(options.id)
    }
  },

  getDetail(id){
    db.collection('userType').where({
      _id:id
    }).get().then(res=>{
      for (let k in res.data[0]) {
        this.setData({
          [k]: res.data[0][k]
        })
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