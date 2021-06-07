//连接云数据库，进入changeList集合
const db = wx.cloud.database();
const changeList = db.collection('changeList');
Page({
  data: {
    value:'',
    isFixed: false,
    fixedTop: 0,
    bigList:[],//数据库存入的集合
    smallList:[],//取bigList中的集合
    scroll:[
      {
        bookName:'人生难得是从容',
        author:'老舍',
        people:'454',
        bookImg:'cloud://cloud1-3ghh4jpx16007e93.636c-cloud1-3ghh4jpx16007e93-1305604874/images/index/hot1.jpg'
      },
      {
        bookName:'麻衣神算子',
        author:'骑马钓鱼',
        people:'255',
        bookImg:'cloud://cloud1-3ghh4jpx16007e93.636c-cloud1-3ghh4jpx16007e93-1305604874/images/index/select7.jpg'
      },
      {
        bookName:'三体',
        author:'刘慈欣',
        people:'1024',
        bookImg:'cloud://cloud1-3ghh4jpx16007e93.636c-cloud1-3ghh4jpx16007e93-1305604874/images/index/select13.jpg'
      },
      {
        bookName:'斗破苍穹',
        author:'天蚕土豆',
        people:'2021',
        bookImg:'cloud://cloud1-3ghh4jpx16007e93.636c-cloud1-3ghh4jpx16007e93-1305604874/images/index/select17.jpg'
      },
      {
        bookName:'明朝那些事',
        author:'当年明月',
        people:'985',
        bookImg:'cloud://cloud1-3ghh4jpx16007e93.636c-cloud1-3ghh4jpx16007e93-1305604874/images/index/select8.jpg'
      }
    ]
  },
  onLoad: function () {
    wx.createSelectorQuery().in(this).select('.search').boundingClientRect(rect => { 
      this.setData({ 
        fixedTop:rect.top
      })
    }).exec();
    var a = [];//连接云和本地list的中间数组
    changeList.get({
      success:(res) =>  {
        // res.data 包含该记录的数据
        a.push(res.data[0].list)
        a = a[0]
        this.setData({
          bigList:a
        })
      this.change();
      }
    })
  },
  //页面滑动
  onPageScroll: function (e) {
    if (e.scrollTop > this.data.fixedTop + 20) {
      this.setData({ isFixed: true })
    } else if(e.scrollTop < this.data.fixedTop + 20){
      this.setData({ isFixed: false })
    }
  },
  //去搜索页面
  toSearch(){
    wx.navigateTo({
      url: '../search/search?id=1'
    })
  },
  //热门搜索换一换
  change(){
    var b = [];//把从大集合里拿到得数据存进这个集合里
    let c = [];//把取过得随机数存进这个集合里
    for(let i=0;i<7;i++){
      var d = Math.ceil(Math.random()*33).toString()
      if(c.indexOf(d)>-1){//c里有过d了
        i = i-1;
      }else if(c.indexOf(d) == -1){//c里还没有这个d
        b.push(this.data.bigList[d]);
        c.push(d);
      }
    }
    this.setData({
      smallList:b//把拿到的数据加入小集合里
    })
  },
  //去书籍详情页
  toDetails(event){
    wx.navigateTo({
      url: '../details/details?bookName='+this.data.scroll[event.currentTarget.id].bookName+'&author='+this.data.scroll[event.currentTarget.id].author+'&bookImg='+this.data.scroll[event.currentTarget.id].bookImg,
    })
  },
  //点击标签搜索
  goSearch(event){
    wx.navigateTo({
      url: '../search/search?id='+event.currentTarget.id,
    })
  }
})