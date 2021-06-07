// pages/class/class.js
//连接云数据库，进入books集合
const db = wx.cloud.database();
const books = db.collection('books');
Page({
  data: {
    bookName: '',
    bookImg: '',
    author: '',
    hasBook: false,
    activeKey: 0,
    sexClass:'男生',
    manClass:['玄幻','历史','军事','恐怖','悬疑','职场'],
    womanClass:['爱情','青春','校园','文学','穿越','儿童'],
    allText:[],//所有书籍
    manText:[],//男女生书籍
  },
  onLoad: function (options) {
    this.getAllText();
  },
  //获取所有书籍
  getAllText(){
    books.where({}).get({
      success: (res) => {
        // res.data 包含该记录的数据
        this.setData({
          allText: res.data
        })
        //获取不同分类的书籍
        this.getClassText();
      }
    })
  },
  //获取分类书籍
  getClassText(){
    if(this.data.sexClass == '男生'){
      this.getClass(this.data.manClass[this.data.activeKey])
    }else if(this.data.sexClass == '女生'){
      this.getClass(this.data.womanClass[this.data.activeKey])
    }
  },
  //监听侧边栏切换事件
  onChange(event) {
    if(event.detail.title){//切换的是上边栏
      this.setData({
        sexClass: event.detail.title,
        activeKey: 0
      })
    }else{//切换的是侧边栏
      this.setData({
        activeKey: event.detail
      })
    }
    this.getClassText();
  },
  // 请求分类
  getClass(res){
    this.setData({
      manText:[]
    })
    this.data.allText.forEach(data => {
      if(data.bookClass === res) {
        this.data.manText.push(data)
      }
      this.setData({
        manText: this.data.manText,
        hasBook: true
      })
      if(this.data.manText ==''){
        this.setData({
          hasBook: false
        })
      }
    })
  },
  //去书籍详情页
  toBook(event){
    var a = event.currentTarget.id.split('+')
    wx.navigateTo({
      url: '../details/details?bookName='+a[0]+'&bookImg='+a[1]+'&author='+a[2],
    })
  }
})