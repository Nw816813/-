// pages/shop/shop.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newUserType: "",
    newUserBg: "",
    newUserEndTime: "",
    yuetongkayear: "",
    yuetongkamonth: "",
    yuetongkaday: "",
    currentUserInfo: {},
    openId: null,
    userPhone: '',
    userNickName: '',
    userAvatar: '',
    imageSrc: 'https://636c-cloud1-4g08alwo068bf874-1317434842.tcb.qcloud.la/icons/filter.png?sign=ca9f0852aa90089375330a86289f081b&t=1683279811',
    imageSrc1: 'https://636c-cloud1-4g08alwo068bf874-1317434842.tcb.qcloud.la/icons/mark.png?sign=54706306dbfbfb9c97ba541a520a9f64&t=1683279891',
    imageSrc2: 'https://636c-cloud1-4g08alwo068bf874-1317434842.tcb.qcloud.la/icons/profile.png?sign=086ced2bdea5512f36690823545b309d&t=1683279912',
  },
  toRecharPay() {
    wx.navigateTo({
      url: '/pages/recharPay/recharPay',
    })
  },
  jump() {
    wx.navigateTo({
      url: '/pages/bookHistory/bookHistory',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.userNickName) {
      console.log(options)
      this.setData({
        userNickName: options.userNickName,
        userAvatar: options.userAvatar,
        userPhone: options.userPhone
      }, () => {
        this.loginOp()
      })
    }
  },

  // 退出登录
  logoutOut() {
    wx.removeStorageSync('currentUserInfo')
    this.setData({
      currentUserInfo: {},
    }, () => {
      wx.showToast({
        title: '退出成功',
        icon: 'none'
      })
    })
  },

  // 执行登录逻辑
  loginOp() {
    wx.showModal({
      title: '请授权',
      content: '是否同意授权登录获取微信头像,昵称等信息',
      success: (res) => {
        if (res.cancel) {
          return
        }
        if (res.confirm) {
          wx.getUserProfile({
            desc: '必须授权才能继续使用', // 必填 声明获取用户个人信息后的用途，后续会展示在弹窗中
            success: async (res) => {
              console.log('授权成功', res);
              let newInfo = {
                type: 'login',
                yuetongka: true,
                yuetongkaTime: '2024-3-10',
                shenyucishu: 0,
                shangkecishu: 0,
                shangkejilu: 0,
                daoqishijian: '',
                openId: this.data.openId,
                role: 0,
                userNickName: this.data.userNickName,
                userAvatar: this.data.userAvatar,
                userPhone: this.data.userPhone,
                userTypeEndTime: "",
                userTypeBg: "cloud://cloud1-4g08alwo068bf874.636c-cloud1-4g08alwo068bf874-1317434842/myImage/1681318623496_488.jpg",
                userTypeName: "普通用户",
                ...res.userInfo
              }
              let isExitUser = await db.collection('user').where({
                openId: this.data.openId
              }).get()
              console.log(isExitUser, 'isExitUser')
              if (isExitUser.data.length == 0) {
                let res = await db.collection('user').add({
                  data: {
                    ...newInfo
                  }
                })
                console.log(res, 'rsesa')
                if (res._id) {
                  let res = await db.collection('user').where({
                    openId: this.data.openId
                  }).get()
                  wx.setStorageSync('currentUserInfo', res.data[0])
                  let handler = wx.getStorageSync('currentUserInfo').yuetongkaTime.split('-')
                  this.setData({
                    currentUserInfo: res.data[0],
                    yuetongkayear: handler[0],
                    yuetongkamonth: handler[1],
                    yuetongkaday: handler[2],
                    newUserType: res.data[0].userTypeName,
                    newUserBg: res.data[0].userTypeBg,
                    newUserEndTime: res.data[0].userTypeEndTime
                  }, () => {
                    wx.showToast({
                      title: '登录成功',
                    })
                  })
                }
              } else {
                wx.setStorageSync('currentUserInfo', isExitUser.data[0])
                let handler = wx.getStorageSync('currentUserInfo').yuetongkaTime.split('-')

                this.setData({
                  currentUserInfo: isExitUser.data[0],
                  yuetongkayear: handler[0],
                  yuetongkamonth: handler[1],
                  yuetongkaday: handler[2],
                  newUserType: isExitUser.data[0].userTypeName,
                  newUserBg: isExitUser.data[0].userTypeBg,
                  newUserEndTime: isExitUser.data[0].userTypeEndTime
                }, () => {
                  wx.showToast({
                    title: '登录成功',
                  })
                })
              }
            },
          })
        }
      },
      complete: res => {
        return
      }
    })
  },
  // 获取用户openId
  getOpenid() {
    wx.cloud.callFunction({
      name: 'getOpenid',
      success: res => {
        console.log('云函数获取到的openid: ', res)
        var openid = res.result.openid;
        this.setData({
          openId: openid
        })
      }
    })
  },

  toEdit() {
    wx.navigateTo({
      url: '/pages/editUserInfo/editUserInfo?time=edit',
    })
  },

  toRole() {
    wx.navigateTo({
      url: '/pages/role/role',
    })
  },

  // 登录
  async loginUser() {
    let isExitUser = await db.collection('user').where({
      openId: this.data.openId
    }).get()
    if (isExitUser.data.length == 0) {
      wx.navigateTo({
        url: '/pages/editUserInfo/editUserInfo?time=login',
      })
    } else {
      wx.setStorageSync('currentUserInfo', isExitUser.data[0])
      this.setData({
        currentUserInfo: isExitUser.data[0]
      }, () => {
        wx.showToast({
          title: '登录成功',
        })
      })
    }

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
    if (wx.getStorageSync('currentUserInfo')) {
      let handler = wx.getStorageSync('currentUserInfo').yuetongkaTime.split('-')
      console.log(handler, 'handler')
      this.setData({
        currentUserInfo: wx.getStorageSync('currentUserInfo'),
        yuetongkayear: handler[0],
        yuetongkamonth: handler[1],
        yuetongkaday: handler[2],
        newUserType: wx.getStorageSync('currentUserInfo').userTypeName,
        newUserBg: wx.getStorageSync('currentUserInfo').userTypeBg,
        newUserEndTime: wx.getStorageSync('currentUserInfo').userTypeEndTime
      })
    }
    this.getOpenid()
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