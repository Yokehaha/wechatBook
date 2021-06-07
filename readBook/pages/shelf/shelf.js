// pages/shelf/shelf.js
//连接云数据库，进入userInfo集合
const db = wx.cloud.database();
const userInfo = db.collection('userInfo');
const books = db.collection('books');
const _ = db.command;
const app = getApp();
let noticeTime;
Page({
  data: {
    isLogin: false,
    notLogin: true,
    noBooks: false,
    noticeText: '',
    noticeList:[
      { text: '长按书籍页面可以从书架删除该书籍' },
      { text: '活动特价积分限时充一百送一百' },
      { text: '每周免费书籍书单已经更新，快看看有哪些吧' },
      { text: '上个月reader们最爱的书是<斗破苍穹>'},
      { text: '由于版权原因，部分书籍已于上周末下架' },
      { text: '书是人类进步的阶梯，电子书是信息时代人类进步的电梯' },
      { text: '恭喜网络书城注册用户超过一千人了' }
    ],
    hasBook:false,
    whichBook: '',
    oldBooks:[],//存用户书架有哪些书
    newBooks:[],//存书的具体信息
    books:[],
    show: false,
    actions: [
      { name: '确定' },
    ],
  },
  onLoad: function (options) {
    this.setData({
      noticeText:'欢迎欢迎，热烈欢迎'
    })
  },
  //通知栏事件
  notice(){
    var a = [];
    var d = Math.ceil(Math.random()*6).toString();
    a.push(this.data.noticeList[d].text);
    this.setData({
      noticeText: a
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){
    if(app.globalData.ifLogin){
      this.setData({
        isLogin: true
      })
    }
    this.setData({
      isLogin: app.globalData.ifLogin,
      notLogin: !app.globalData.ifLogin,
      oldBooks: [],
      newBooks: []
    })
    noticeTime = setInterval(this.notice, 9000);
    if(app.globalData.ifLogin){
      userInfo.where({
        userName: app.globalData.userName
      }).get({
        success: (res) => {
          // res.data 包含该记录的数据
          this.setData({
            oldBooks: res.data[0].like
          })
          this.showBook();
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(noticeTime)
  },
  //显示书籍
  showBook(){
    if(this.data.oldBooks.length){
      this.data.oldBooks.forEach(ele => {
        books.where({
          bookName: ele
        }).get({
          success: (res) => {
            this.data.newBooks.push(res.data[0])
            this.setData({
              books: this.data.newBooks,
              noBooks: false
            })
          }
        })
      })
    }else{
      this.setData({
        noBooks: true
      })
    }
  },
  //去登录
  toSinup(){
    wx.switchTab({
      url: '../info/info',
    })
  },
  //去阅读
  toRead(event){
    console.log(event)
    let a;
    a = event.currentTarget.id.split('+');
    console.log(a)
    wx.navigateTo({
      url: '../details/details?bookName='+a[0]+'&bookImg='+a[1]+'&author='+a[2],
    })
  },
  //删除书
  deleteBook(event){
    this.setData({
      show: true,
      whichBook: event.currentTarget.id.split('+')[0]
    })
  },
  //确认删除书
  sureDelete(event){
    console.log(this.data.whichBook)
    console.log('event',event)
    userInfo.where({
      userName: app.globalData.userName
    }).update({
      data: {
        like: _.pull(this.data.whichBook)
      }
    })
    this.setData({
      show: false
    })
    setTimeout(() => {
      this.onShow();
    }, 700);
  },
  //解决长按事件和点击事件冲突
  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  },
  bindTap: function(e) {
    if(this.endTime  - this.startTime < 350) {
      this.toRead(e);
    }
  },
  //取消
  noDelete(){
    this.setData({
      show: false
    })
  }
})