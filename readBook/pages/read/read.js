//连接云数据库，进入books集合
const db = wx.cloud.database();
const books = db.collection('books');
Page({
  data: {
    content: '',
    backgroundColor: '#f0f0f0',
    color: '',
    chapter: '一',
    chapterTitle: '',
    bgColor:['lightgreen','white','lightblue'],
    show: false,
    fontSize: '16',
    sideShow: false,
    nightShow: false,
    checked: false,
  },
  onLoad: function (options) {
    books.where({
      bookName: options.bookName
    }).get({
      success: (res) => {
        console.log('res.data',res.data[0])
        this.setData({
          content: res.data[0].bookContent[0],
          chapterTitle: res.data[0].chapterTitle
        })
      }
    })
  },
  //展示底部设置
  showPopup() {
    this.setData({
      show: !this.data.show,
      sideShow: false
    })
  },
  tapDirectory(event){
    console.log(event)
    wx.showToast({
      title: '第七章',
    })
    this.setData({
      sideShow: false
    })
  },
  //关闭底部设置
  onClose() {
    this.setData({ show: false });
  },
  //字体大小事件
  onChange(event) {
    wx.showToast({
      icon: 'none',
      title: `当前值：${event.detail}`,
    });
    this.setData({
      fontSize: event.detail
    })
  },
  //显示侧边栏
  showSide(){
    this.setData({
      sideShow: true
    })
  },
  //背景颜色事件
  onColor(event){
    let bgc;
    switch (event.target.id){
      case "bgBtn0": 
        bgc = 'lightgreen'
        break;
      case "bgBtn1": 
        bgc = 'white'
        break;
      case "bgBtn2": 
        bgc = 'lightblue'
        break;
    }
    this.setData({
      backgroundColor: bgc
    })
  },
  //去目录页
  toDirectory(){
    wx.navigateTo({
      url: '../directory/directory',
    })
  },
  //夜间模式
  onChecked({detail}){
    console.log(detail)
    if(detail){
      this.setData({ 
        checked: detail ,
        backgroundColor: 'black',
        color: 'gray'
      });
    }else{
      this.setData({ 
        checked: detail ,
        backgroundColor: '#f0f0f0',
        color: 'black'
      });
    }
    
  }
})