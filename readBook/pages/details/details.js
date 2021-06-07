// pages/details/details.js
//连接云数据库，进入userInfo集合
const db = wx.cloud.database();
const userInfo = db.collection('userInfo');
const app = getApp();
const _ = db.command;
Page({
  data: {
    bookName:'',
    bookImg:'',
    author:'',
    likeList: [],
    introduction:'',
    motto: '人生悠长，苦乐无常。我们执念于太多的得到与失去，被外物所束缚，而不能顺从自己的内心。只有从容的人生，才能消解世间喧嚣与纷争；只有淡定的心境，才能面对不尽的挫折与坎坷。在这本书中文学大师老舍先生以朴素而深刻的笔所见所闻、所思所悟，真情而诚挚，娓娓道来，如同谈心。片言只语，都能醍醐灌顶，字里行间，再现六十年人生经验。一书读罢，我们终将明白，从容是人生的真义，人生因从容丰盈。',
    isF: true,
    value: '3.5',
    comment: '年轻时，读老舍的《四世同堂》《骆驼祥子》《茶馆》《龙须沟》，只留下对作品的印象，而对作者老舍，却总感觉不如喜欢巴金、冰心一样的喜欢。或许因为年轻，解读力有限...',
    commentTime: '2021年5月21日13:14',
    show: false
  },
  onLoad: function (options) {
    this.setData({
      bookName: options.bookName,
      bookImg: options.bookImg,
      author: options.author
    })
  },
  //介绍展开收缩
  ifSpread: function() {
    this.setData({
      isF: !this.data.isF
    })
  },
  //前往阅读页面
  toRead(){
    if(app.globalData.ifLogin){
      wx.navigateTo({
        url: '../read/read?bookName='+this.data.bookName,
      })
    }else{
      this.onClickShow();
    }
  },
  //前往登录页面
  toLogin(){
    wx.switchTab({
      url: '../info/info',
    })
  },
  onClickShow() {
    this.setData({ show: true });
  },
  onClickHide() {
    this.setData({ show: false });
  },
  //加入书架
  jionShelf(){
    if(app.globalData.ifLogin){
      userInfo.where({
        userName: app.globalData.userName
      }).get({
        success: (res) => {
          console.log('res.data',res.data)
          console.log('1',res.data[0].like)
          if(res.data[0].like.indexOf(this.data.bookName) > -1){//有这本书
            console.log('有书')
            wx.showToast({
              title: '已经在书架了',
              icon: 'none'
            })
          }else{//没有这本书
            userInfo.where({
              userName: app.globalData.userName
            })
            .update({
              // data 传入需要局部更新的数据
              data: {
                // 表示将 done 字段置为 true
                // like: this.data.likeList
                like: _.push(this.data.bookName)
              },
              success: function(res) {
                console.log('res',res)
              }
            })
            console.log('没书')
            wx.showToast({
              title: '加入书架成功',
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  }
})