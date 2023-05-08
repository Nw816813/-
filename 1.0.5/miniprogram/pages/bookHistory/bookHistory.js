// pages/courseInfo.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  toEdit(e) {
    console.log(e.currentTarget.dataset.item)
    //判断是否可以取消预约
    // 获取当前时间
    var now = new Date();
    var year = now.getFullYear(); // 年
    var month = now.getMonth() + 1; // 月
    var day = now.getDate(); // 日
    var hour = now.getHours() + 2; // 时
    var minute = now.getMinutes(); // 分
    var second = now.getSeconds(); // 秒

    // 补零函数
    function addZero(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return num;
      }
    }
    var item = e.currentTarget.dataset.item
    // 格式化当前时间
    var nowTime = year + "-" + month + "-" + day + " " + addZero(hour) + ":" + addZero(minute) + ":" + addZero(second);
    // 拼接课程时间
    var courseTime = item.courseDate + " " + item.courseTime + ":00";
    console.log(nowTime)
    console.log(courseTime)
    var date1 = new Date(nowTime).getTime();
    var date2 = new Date(courseTime).getTime();
    console.log(date1)
    console.log(date2)
    if (date1 > date2) {
      //不可取消
      console.log('不可取消')
      wx.showToast({
        title: '低于开课时间（前2hours）不得取消',
        icon: 'none'
      })
      return
    }

    //可以取消



    db.collection('courseBook').where({
      courseId: e.currentTarget.dataset._id,
      userOpenId: wx.getStorageSync('currentUserInfo').openId
    }).remove().then(res => {
      let old = wx.getStorageSync('currentUserInfo')
      let copy = wx.getStorageSync('currentUserInfo')
      let oldNum = old.shangkejilu
      let oldNumTwo = old.shenyucishu
      let oldNumThree = old.shangkecishu
      copy.shangkejilu = oldNum - 1
      copy.shenyucishu = oldNumTwo + parseInt(e.currentTarget.dataset.need)
      copy.shangkecishu = oldNumThree - 1
      wx.setStorageSync('currentUserInfo', copy)
      db.collection('user').where({
        openId: wx.getStorageSync('currentUserInfo').openId
      }).update({
        data: {
          shangkejilu: copy.shangkejilu,
          shenyucishu: copy.shenyucishu,
          shangkecishu: copy.shangkecishu,
        }
      }).then(res => {
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 1000
        })
        this.getCourse()
      })
    })
  },
  toAdd() {
    wx.navigateTo({
      url: '/pages/course/course?op=add',
    })
  },

  async getCourse() {
    db.collection('courseBook').where({
      userOpenId: wx.getStorageSync('currentUserInfo').openId
    }).orderBy('_id', 'desc').get().then(res => {
      console.log(res, 'res')
      this.setData({
        course: res.data
      })
      let arr = []
      res.data.map(item => {
        arr.push(new Promise((resolve, rej) => {
          db.collection('course').where({
            _id: item.courseId
          }).get().then(obj => {
            resolve(obj)
          })
        }))
      })
      let ress = Promise.all(arr)
      ress.then(obj => {
        console.log(obj, 'obj')
        let tt = []
        obj.map(item => {
          tt.push({
            ...item.data[0]
          })
        })
        console.log(tt, 'tt')
        this.setData({
          course: tt
        })
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
      title: '课程管理',
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