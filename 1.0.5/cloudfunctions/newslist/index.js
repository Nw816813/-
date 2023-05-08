// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "cloud1-4g08alwo068bf874" }) // 使用当前云环境
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  var num = event.num;
  return await db.collection("newsList").limit(num).get()


}