const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');
cloud.init()
 
// 云函数入口函数
exports.main = async (event, context) => {
  let url = 'http://39.105.38.10:8081/book/top250?page=0';
  return await rp(url)
    .then(function (res) {
      return res
    })
    .catch(function (err) {
      return err
    });
}