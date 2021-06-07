//连接云数据库，进入admin用户集合
const db = wx.cloud.database();
const userInfo = db.collection('userInfo');
import Notify from '@vant/weapp/notify/notify';
const app = getApp();
Page({
  data: {
    userName:'',
    password:''
  },
  onLoad(event){
    if(event.key){
      this.setData({
        userName:event.key
      })
    }
  },
  ifCheck(){
    var that = this.data
    if(that.userName && that.password){
      userInfo.where({
        userName:that.userName,
        password:that.password
      })
      .get()
      .then(res => {
        if(res.data.length){//查询结果有长度，说明有数据，允许登录
          Notify({ type: 'success', message: '登录成功', duration: 1000});
          app.globalData.userName = that.userName;
          app.globalData.ifLogin = true;
          setTimeout(function(){//定时跳转到用户页面
            wx.switchTab({
              url: '../info/info'
            })
          },1000)
        }else{//查询没长度，没数据，不允许登录
          Notify({ type: 'danger', message: '账号或密码错误', duration: 1000});
        }
      })
    }else{
      Notify({ type: 'warning', message: '内容不能为空', duration: 1000});
    }
  }
})