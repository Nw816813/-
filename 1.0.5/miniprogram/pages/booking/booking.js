const db = wx.cloud.database()
Page({
  data: {
    currentMonthDay: [],
    currentTab: 0,
    courseData: [],
    sleft: "", //横向滚动条位置
    list: [1, 2, 3, 4, 5, 6, 7, 22, 32], //测试列表
    fenlei: [],
    timetable: [],
    y: "",
    m: "",
    d: "",
    w: ""
  },

  toDetail(e) {
    console.log(e.currentTarget.dataset.id)
    if(e.currentTarget.dataset.state){
      wx.showToast({
        title: '已过期，不能预约',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/classDetail/classDetail?id=' + e.currentTarget.dataset.id,
    })
    // wx.navigateTo({
    //   url: '/pages/Scheduled/Scheduled?id=' + e.currentTarget.dataset.id,
    // })
  },

  getData(date) {
    wx.showLoading({
      title: '加载中'
    })
    db.collection('course').where({
      courseDate: date
    }).get().then(res => {
      wx.hideLoading()
      console.log(res, 'res')
      //判断时间是否超时
      // 获取当前时间
      var now = new Date();
      var year = now.getFullYear(); // 年
      var month = now.getMonth() + 1; // 月
      var day = now.getDate(); // 日
      var hour = now.getHours(); // 时
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

      // 格式化当前时间
      var nowTime = year + "-" + month + "-" + day + " " + addZero(hour) + ":" + addZero(minute) + ":" + addZero(second);

      // 待处理的数组
      var arr = res.data

      // 遍历数组，判断是否超过当前时间
      arr.forEach(function (item) {
        // 拼接课程时间
        var courseTime = item.courseDate + " " + item.courseTime + ":00";
        console.log(courseTime)
        console.log(nowTime)
        var date1 = new Date(nowTime).getTime();
        var date2 = new Date(courseTime).getTime();
        console.log(date1)
        console.log(date2)
        if (date1 > date2) {
          item.state = true;
        } else {
          item.state = false;
        }
      });

      console.log(arr); // 输出处理后的数组
      this.setData({
        courseData: arr
      })
    })
  },

  judgecurrentTab() {
    let today = this.data.y + '-' + this.data.m + '-' + this.data.d
    console.log(today)
    this.data.currentMonthDay.map((item, index) => {
      if (item == today) {
        this.setData({
          currentTab: index
        }, () => {
          this.getScrollLeft()
        })
      }
    })
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
      w: week
    })
  },

  onShow() {
    this.getDay()
    this.getCurrentMonth()
    this.judgecurrentTab()
    let today = this.data.y + '-' + this.data.m + '-' + this.data.d
    this.getData(today)
  },

  //获取点击数
  handleTabChange(e) {
    let {
      current
    } = e.target.dataset;
    if (this.data.currentTab == current || current === undefined) return;
    this.setData({
      currentTab: current,
    });
    console.log(this.data.currentMonthDay[current])
    this.getData(this.data.currentMonthDay[current])
  },
  handleSwiperChange(e) {
    this.setData({
      currentTab: e.detail.current,
    });
    this.getScrollLeft();
  },
  getScrollLeft() {
    const query = wx.createSelectorQuery();
    query.selectAll(".item").boundingClientRect();
    query.exec((res) => {
      console.log(res, 'check')
      let num = 0;
      for (let i = 0; i < this.data.currentTab; i++) {
        num += res[0][i].width;
      }
      this.setData({
        sleft: Math.ceil(num),
      });
    });
  },
  getCurrentMonth() {
    // 获取标准时间
    const date = new Date();
    // 获取当天日期
    const currentDay = date.getDate();
    // 获取当前月份（实际月份需要加1）
    const currentMonth = date.getMonth() + 1
    // 获取当前年份
    const currentYear = date.getFullYear();
    // 获取当前月有多少天
    const currentMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    console.log(currentMonthDays, 'currentMonthDays')
    // 当前月份所有日期集合
    const currentMonthArr = [];
    for (let day = 1; day <= currentMonthDays; day++) {
      // 年月日(yyyy-MM-dd)
      let dateItem = currentYear + "-" + currentMonth + "-" + day
      currentMonthArr.push(dateItem)
    }
    console.log(currentMonthArr)
    // for (let i = 0; i < currentMonthArr.length; i++) {
    //   let data = {
    //     teacherNameArray: [],
    //     index: 0,
    //     courseTagArray: [],
    //     indexTwo: 0,
    //     teacherName: "小米",
    //     teacherAvatar: "cloud://cloud1-4g08alwo068bf874.636c-cloud1-4g08alwo068bf874-1317434842/myImage/xiaomi.png",
    //     courseDate: currentMonthArr[i],
    //     courseTime: "16:00",
    //     courseTimeEnd: '18:30',
    //     courseNeed: "8",
    //     courseTag: "House",
    //     courseIntroduce: "训练日",
    //     openId: wx.getStorageSync('currentUserInfo')._openid,
    //     time: new Date().getTime() / 1000,
    //     current: {},
    //     editId: "",
    //     teacherBG:"cloud://cloud1-4g08alwo068bf874.636c-cloud1-4g08alwo068bf874-1317434842/teacherImg/xiaomi.jpg"
    //   }
    //   db.collection('course').add({
    //     data:{
    //       ...data
    //     }
    //   }).then(res=>{
    //     console.log(res,'rarasfcsafsafsa')
    //   })
    // }
    this.setData({
      currentMonthDay: currentMonthArr
    })
  },

  //   onLoad:function(options){
  //     let that = this
  //     db.collection('classify').get({
  //       success:function(res){
  //           console.log('获取分类成功',res)
  //           that.setData({
  //               fenlei:res.data
  //           })
  //       },fail:function(res){
  //           console.log('获取分类失败',res)
  //       }
  //     })
  //     // 页面初加载配置
  //     db.collection('TimeTable').where({
  //       num:0
  //     }).get({
  //       success:function(res){
  //           console.log('获取课程表分类成功',res)
  //           that.setData({
  //               timetable:res.data
  //           })
  //       },fail:function(res){
  //           console.log('获取课程表分类失败',res)
  //       }
})


//   }
// });