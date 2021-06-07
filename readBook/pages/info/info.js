// pages/userInfo/info.js
//连接云数据库，进入admin用户集合
const db = wx.cloud.database();
const userInfo = db.collection('userInfo');
//引入全局变量
const app = getApp();
Page({
  data:{
    userImg:'',
    userName:'未登录',
    toEditor:'请先登录',
    readTime:'0',
    integral:'0',
    fans:'0',
    isBtnShow:false,
    recently: [
      { 
        bookName: '人生难得是从容',
        bookImg: 'cloud://cloud1-3ghh4jpx16007e93.636c-cloud1-3ghh4jpx16007e93-1305604874/images/index/hot1.jpg'
      },
      { 
        bookName: '三体',
        bookImg: 'cloud://cloud1-3ghh4jpx16007e93.636c-cloud1-3ghh4jpx16007e93-1305604874/images/index/select13.jpg'
      },
      { 
        bookName: '明朝那些事',
        bookImg: 'cloud://cloud1-3ghh4jpx16007e93.636c-cloud1-3ghh4jpx16007e93-1305604874/images/index/select8.jpg'
      },
      { 
        bookName: '斗破苍穹',
        bookImg: 'cloud://cloud1-3ghh4jpx16007e93.636c-cloud1-3ghh4jpx16007e93-1305604874/images/index/select17.jpg'
      },
      { 
        bookName: '麻衣神算子',
        bookImg: 'cloud://cloud1-3ghh4jpx16007e93.636c-cloud1-3ghh4jpx16007e93-1305604874/images/index/select7.jpg'
      },
    ]
  },
  onLoad(){
    //全局用户名是否有值
    if(app.globalData.userName){
      userInfo.where({
        userName:app.globalData.userName
      })
      .get().then(res => {
        this.setData({
          userImg:res.data[0].userImg,
          userName:app.globalData.userName,
          toEditor:'编辑个人资料',
          isBtnShow:true
        })
      })
    }
  },
  onShow(){
    if(app.globalData.ifLogin){
      this.onLoad()
    }
  },
  //退出登录
  outLogin() {
    if(this.data.userImg){
      this.setData({
        userName:'未登录',
        userImg:'',
        toEditor:'请先登录',
        readTime:'0',
        integral:'0',
        fans:'0',
        isBtnShow:false
      })
      app.globalData.ifLogin = false;
      app.globalData.userName = '';
    }
  },
  //前往个人编辑，没登陆则跳往登录
  toEditor(){
    //如果有头像，说明已登录，点击前往编辑
    if(this.data.userImg){
      wx.navigateTo({
        url: '../editor/editor?id=1',
        success:(res)=>{
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('objtArry', {
            data: this.data,//传过去的参数，可直接对象.数组不在需要使用decodeURIComponent
          })
        }
      })
    }else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  }
})