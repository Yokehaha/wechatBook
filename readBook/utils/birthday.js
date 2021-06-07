//获取事件戳对应的时间
function getTsFormatDate(timeStamp) {
  var date = new Date(timeStamp);
  //console.log(date); 结果为：Tue Apr 02 2019 07:49:23 GMT+0800 (中国标准时间)
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

module.exports = {
  getTsFormatDate
}