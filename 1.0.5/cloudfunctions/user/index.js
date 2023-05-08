// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "cloud1-4g08alwo068bf874"
}) // 使用当前云环境
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.type == 'login','aaaaaaaaaaa')
  if (event.type == 'login') {
    let isExitUser = await db.collection('user').where({
      openId: event.openId
    }).get()
    console.log(isExitUser, 'isExitUser')
    if (isExitUser.length == 0) {
      let res = await db.collection('user').add({
        data: {
          ...event
        }
      })
      console.log(res, 'res')
      if (res) {
        let currentUser = await db.collection('user').where({
          openId: event.openId
        }).get()
        return currentUser;
      } else {
        return -1;
      }
    }
  }
}