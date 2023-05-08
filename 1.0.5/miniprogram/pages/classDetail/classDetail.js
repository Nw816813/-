const db = wx.cloud.database()
Page({
  data: {
  isDisable:false,
  isBook:false,
  courseId:"",
  courseDetail:[],
  pics: [
    'https://tdesign.gtimg.com/miniprogram/images/avatar1.png',
    'https://tdesign.gtimg.com/miniprogram/images/avatar2.png',
    'https://tdesign.gtimg.com/miniprogram/images/avatar3.png',
    'https://tdesign.gtimg.com/miniprogram/images/avatar4.png',
    'https://tdesign.gtimg.com/miniprogram/images/avatar5.png',
    'https://tdesign.gtimg.com/miniprogram/images/avatar1.png',
  ],
  
},

onLoad(options){
  console.log(options)
  this.getCouseDetail(options.id)
  this.check(options.id)
  this.setData({
    courseId:options.id
  })
  if(options.disabled == "true"){
    this.setData({
      isDisable:true,
    })
  }else{
    this.setData({
      isDisable:false
    })
  }
},

getCouseDetail(id){
  db.collection('course').where({
    _id:id
  }).get().then(res=>{
    console.log(res)
    this.setData({
      courseDetail:res.data
    })
  })
},

check(id){
  db.collection('courseBook').where({
    courseId:id
  }).get().then(res=>{
    console.log(res,'res')
    let picNew = []
    res.data.map(item=>{
      picNew.push(item.userAvatar)
    })
    this.setData({
      pics:picNew
    })
    let arr = []
    arr = res.data.filter(item=>{
      return item.userOpenId == wx.getStorageSync('currentUserInfo').openId
    })
    if(arr.length > 0){
      this.setData({
        isBook:true
      })
    }else{
      this.setData({
        isBook:false
      })
    }
  })
},
      onBack() {
      wx.switchTab({
        url: '/pages/booking/booking',
      })
      console.log(123);
    },
      navigateToPage: function() {
        console.log(this.data)
        if(this.data.isDisable){

          wx.showToast({
            title: '你已经预约过了哦～',
            icon:"none"
          })
          return
        }
        wx.navigateTo({
          url: '/pages/Scheduled/Scheduled?id=' + this.data.courseId
        })
      }

})

// Component({
//   data: {
//     isDisable:false,
    
//     pics: [
//       'https://tdesign.gtimg.com/miniprogram/images/avatar1.png',
//       'https://tdesign.gtimg.com/miniprogram/images/avatar2.png',
//       'https://tdesign.gtimg.com/miniprogram/images/avatar3.png',
//       'https://tdesign.gtimg.com/miniprogram/images/avatar4.png',
//       'https://tdesign.gtimg.com/miniprogram/images/avatar5.png',
//       'https://tdesign.gtimg.com/miniprogram/images/avatar1.png',
//     ],
    
//   },

//   onLoad(options){
//     console.log(options)
//   },



//   methods: {
//     onBack() {
//       wx.navigateBack();
//       console.log(123);
//     },
//     navigateToPage: function() {
//         wx.navigateTo({
//           url: '/pages/Scheduled/Scheduled'
//         })
//       }
//   },
// });