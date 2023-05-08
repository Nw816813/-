// pages/Scheduled/Scheduled.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userTypeName:"",
    courseInfo:{},
    y:"",
    m:"",
    d:"",
    isLastTime:false,
    str:""
  },

   // 获取今天和周几
   getDay() {
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let h = date.getHours()
    let min = date.getMinutes()
    let weekNum = date.getDay()
    let list = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let week = list[weekNum]
    console.log(y, m, d, weekNum, week)
    this.setData({
      str:y+'-'+m+'-'+d + ' ' + h + ':' + min,
      w: week
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.getDay()
    this.getCourseDetail(options.id)
    this.getUser()
  },
  getUser(){
    db.collection('user').where({
      openId:wx.getStorageSync('currentUserInfo').openId
    }).get().then(res=>{
      this.setData({
        userTypeName:res.data[0].userTypeName
      })
    })
  },
  showText(){
    let old = wx.getStorageSync('currentUserInfo')
    if(old.shenyucishu <= 0 || old.shenyucishu < parseInt(this.data.courseInfo.courseNeed)){
      wx.showToast({
        title: '剩余次数不足,请先前往充值',
        icon:'none'
      })
      return
    }
    if(!wx.getStorageSync('currentUserInfo')){
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
      return
    }
    let data = {
      teacherId:this.data.courseInfo.teacherName,
      teacherAvatar:this.data.courseInfo.teacherAvatar,
      courseId:this.data.courseInfo._id,
      courseIntroduce:this.data.courseInfo.courseIntroduce,
      courseTag:this.data.courseInfo.courseTag,
      courseNeed:this.data.courseInfo.courseNeed,
      userOpenId:wx.getStorageSync('currentUserInfo').openId,
      userAvatar:wx.getStorageSync('currentUserInfo').userAvatar,
      userNickName:wx.getStorageSync('currentUserInfo').userNickName,
      time:this.data.courseInfo.courseDate + ' ' + this.data.courseInfo.courseTime + '-' + this.data.courseInfo.courseTimeEnd,
    }
    db.collection('courseBook').add({
      data:{
        ...data
      }
    }).then(res=>{
      let old = wx.getStorageSync('currentUserInfo')
      let copy = wx.getStorageSync('currentUserInfo')
      let oldNum = old.shangkejilu
      let oldNumTwo = old.shenyucishu
      let oldNumThree = old.shangkecishu
      copy.shangkejilu = oldNum + 1
      copy.shenyucishu = oldNumTwo - parseInt(this.data.courseInfo.courseNeed)
      copy.shangkecishu = oldNumThree + 1
      wx.setStorageSync('currentUserInfo', copy) 
      db.collection('user').where({
        openId: wx.getStorageSync('currentUserInfo').openId
      }).update({
        data:{
          shangkejilu:copy.shangkejilu,
          shenyucishu: copy.shenyucishu,
          shangkecishu: copy.shangkecishu,
        }
      }).then(res=>{
        wx.showToast({
          title: '预约成功',
          icon:"success",
          duration:2000
        })
        setTimeout(()=>{
          wx.reLaunch({
            url: '/pages/booking/booking',
          })
        },2000)
      })

    })
  },
  onGoHome(){
    wx.reLaunch({
      url: '/pages/booking/booking',
    })
  },

  getCourseDetail(id){
    db.collection('course').where({
      _id:id
    }).get().then(res=>{
      console.log(res)
      let currentTime = this.data.str;
      let courseTime = res.data[0].courseDate + ' ' + res.data[0].courseTimeEnd
      let first = new Date(currentTime).getTime()
      let second = new Date(courseTime).getTime()
      console.log(currentTime,courseTime)
      this.setData({
        courseInfo:res.data[0],
        y:res.data[0].courseDate.split('-')[0],
        m:res.data[0].courseDate.split('-')[1],
        d:res.data[0].courseDate.split('-')[2],
        isLastTime:first <= second ? false : true
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

// Component({
//   methods: {
//     onBack() {
//       wx.navigateTo({
//         url: '/pages/booking/booking',
//       })
//     },
//     showText(){
//       wx.showToast({
//         title: '预约成功',
//         icon: 'none',
//         complete: function() {
//           setTimeout(function(){
//             wx.navigateTo({
//               url: '/pages/classDetail/classDetail?disabled=true',
//             })
//           }, 1000);

//         }
//       });
//     },
//     onGoHome(){
//       wx.reLaunch({
//         url: '/pages/booking/booking',
//       })
//     }
//   },
// });