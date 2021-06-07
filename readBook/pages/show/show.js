//连接云数据库，进入changeList集合
const db = wx.cloud.database();
const books = db.collection('books');
const _ = db.command

Page({
  data: {
    notFound:false,
    booksList:[]
  },
  onLoad: function (event) {
    wx.showToast({
      title: '查询中',
      icon: 'loading',
      duration: 1500,
      mask: true
    })
    setTimeout(() => {
      this.serarch(event.key);
    },1500)
  },
  //搜索事件
  serarch(options){
    //查询数据库内作者或者书名是否有搜索值
    books.where(_.or([
      { author: options },
      { bookName: options }
    ]))
    .get({
      success: (res) => {
        // res.data 是包含以上定义的两条记录的数组
        if(res.data.length){//有数据
          this.putBook(res.data);
        }else{//没数据
          this.setData({
            notFound: true
          })
        }
      }
    })
  },
  //把查询到的书放页面
  putBook(res){
    //中间集合存放从数据库查到的数组
    var a = []
    for(let i=0;i<res.length;i++){
      a.push(res[i])
    }
    this.setData({
      booksList:a
    })
    console.log(this.data.booksList)
  },
  //点击前往书籍详情页
  toDetails(event){
    console.log(event)
    wx.redirectTo({
      url: '../details/details?bookName='+this.data.booksList[event.currentTarget.id].bookName+'&bookImg='+this.data.booksList[event.currentTarget.id].bookImg+'&author='+this.data.booksList[event.currentTarget.id].author
    })
  }
})