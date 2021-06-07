//连接云数据库，进入changeList集合
const db = wx.cloud.database();
const changeList = db.collection('changeList');
Page({
  data: {
    value:'',
    isLink:true,
    bigList:[],//数据库存入的集合
    smallList:[],//取bigList中的集合
    sercherStorage: [],
    StorageFlag: false //显示搜索记录标志位
  },
  onLoad: function (event) {
    console.log('event2',event)
    if(event.id != 1){
      this.setData({
        value: event.id
      })
      this.onSearch();
    }
  },
  onShow(){
    //重新渲染，触发缓存和页面交互事件
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
    //检索缓存打开历史记录
    this.openLocationsercher();
  },
  //搜索
  onSearch(){
    if(this.data.value.length != 0){
      //将搜索记录更新到缓存
      var searchData = this.data.sercherStorage;
      searchData.push({
        id: searchData.length,
        name: this.data.value
      })
      wx.setStorageSync('searchData', searchData);
      // this.setData({ StorageFlag: false, })
      wx.navigateTo({
        url: '../show/show?key=' + this.data.value,
      })
    }else{
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 1500,
        mask:true
    })
    }
  },
  //输入框内容
  onChange(event){
    //获取输入框值
    let evValue = event.detail;
    //去除输入内容中的空格
    evValue = evValue.replace(/\s+/g, '');
    this.setData({
      value:evValue
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
  //点击某个历史记录
  tapSercherStorage(event){
    var evId = parseInt(event.currentTarget.id)
    wx.navigateTo({
      url: '../show/show?key=' + this.data.sercherStorage[evId].name,
    })
  },
  //清除历史记录
  clearSearchStorage: function () {
    wx.removeStorageSync('searchData')
    this.setData({
      sercherStorage: [],
      // StorageFlag: false,
    })
  },
  //打开历史记录列表
  openLocationsercher: function () {
    this.setData({
      sercherStorage: wx.getStorageSync('searchData') || [], 
      // StorageFlag: true,
    })
  },
  //点击标签搜索
  goSearch(event){
    this.setData({
      value: event.currentTarget.id
    })
    this.onSearch();
  }
})