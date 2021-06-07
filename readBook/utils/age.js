
// 根据出生日期计算年龄周岁 参数2019-12-09 小于10补0
function getAge(strBirthday) {
  var returnAge = '';
  var mouthAge = '';
  var strBirthdayArr = strBirthday.split("-");
  var birthYear = strBirthdayArr[0];
  var birthMonth = strBirthdayArr[1];
  var birthDay = strBirthdayArr[2];
  var d = new Date();
  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();
  if (nowYear == birthYear) {
    // returnAge = 0; //同年 则为0岁
    var monthDiff = nowMonth - birthMonth; //月之差 
    if (monthDiff < 0) {
    } else {
      mouthAge = monthDiff + '个月';
    }
  } else {
    var ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay; //日之差 
        if (dayDiff < 0) {
          returnAge = ageDiff - 1 + '岁';
        } else {
          returnAge = ageDiff + '岁';
        }
      } else {
        var monthDiff = nowMonth - birthMonth; //月之差 
        if (monthDiff < 0) {
          returnAge = ageDiff - 1 + '岁';
        } else {
          mouthAge = monthDiff + '个月';
          returnAge = ageDiff + '岁';
        }
      }
    } else {
      returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge + mouthAge; //返回周岁年龄+月份
}
module.exports = {
  getAge
}