// app.js
App({
  //小程序启动便执行
  onLaunch() {
    wx.cloud.init({
      env: 'cloud1-3ghh4jpx16007e93'//云开发环境id
    })
  },
  //全局变量
  globalData:{
    userName:'',
    dataBaseImgUrl:'cloud://cloud1-3ghh4jpx16007e93.636c-cloud1-3ghh4jpx16007e93-1305604874/images',//云数据库图片地址头
    ifLogin:false//是否已登录
  }
})
