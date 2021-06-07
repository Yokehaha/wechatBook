//连接云数据库，进入admin用户集合
const db = wx.cloud.database();
const userInfo = db.collection('userInfo');
import Notify from '@vant/weapp/notify/notify';
Page({
  data:{
    psdPrompt:'密码至少包含 数字 和 英文,长度6-20',
    userName:'',
    password:'',
    rePassword:'',
    ifRegister:false,//判断用户名是否允许注册
    ifPassword:false,//判断密码是否合规
    ifRePassword:false,//判断两次密码是否一致
    userNameErrorMessage:'',//用户错误提示信息
    passwordErrorMessage:'',//密码错误提示信息
    rePasswordErrorMessage:'',//确认密码错误提示信息
  },
  //输入框失焦事件
  lostBlur(event){
    //获取输入框标识
    let evName = event.currentTarget.dataset.name;
    //获取输入框值
    let evValue = event.detail.value;
    //去除输入内容中的空格
    evValue = evValue.replace(/\s+/g, '');
    if(evValue){//如果有值的话
      this.checkIt(evName,evValue);
    }
  },
  //检查用户名，密码，确认密码是否合规
  checkIt(evName,evValue){
    if(evName == 'userName'){//标识是用户名时
      // console.log('这是用户名',evValue);
      userInfo.where({
        userName:evValue
      }).get()
      .then(res => {
        if(res.data.length != 0){//数据库查询为有，不允许注册
          this.setData({
            userNameErrorMessage:'用户名已被注册'
          })
        }else{//数据库查询为无，允许注册
          this.setData({
            userName:evValue,
            ifRegister:true
          })
        }
      })
    }else if(evName == 'password'){//标识是密码时
      let res = evValue.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/);
      if(res == null){
        this.setData({
          password:evValue,
          passwordErrorMessage:'密码格式错误'
        })
      }else{
        this.setData({
          password:evValue,
          ifPassword:true
        })
      }
    }else if(evName == 'rePassword'){//标识是确认密码时
      if(evValue === this.data.password){
        this.setData({
          rePassword:evValue,
          ifRePassword:true
        })
      }else{
        this.setData({
          rePasswordErrorMessage:'两次密码不一致'
        })
      }
    }
  },
  //输入框清空去除错误提示
  ifClear(res){
    let whichError = res.currentTarget.dataset.name;
    if(whichError == 'userName'){
      this.setData({
        userNameErrorMessage:''
      })
    }else if(whichError == 'password'){
      this.setData({
        passwordErrorMessage:''
      })
    }else if(whichError == 'rePassword'){
      this.setData({
        rePasswordErrorMessage:''
      })
    }
  },
  //是否符合注册条件
  ifRegister(){
    let that = this.data;
    if(that.ifRegister && that.ifPassword && that.ifRePassword){//都为true允许注册
      //将注册的用户名和密码上传到云数据库
      userInfo.add({
        data:{
          userName:that.userName,
          password:that.password,
          age:'',
          city:'',
          fans:'',
          like: [],
          readtime:'',
          sex:'保密',
          userImg:'https://img.yzcdn.cn/vant/cat.jpeg'
        }
      })
      Notify({ type: 'success', message: '注册成功，即将前往登录页', duration: 1000 });
      //一秒后跳转到登录页
      setTimeout(function(){
        let pages = getCurrentPages();//当前页面
        let prevPage = pages[pages.length-2];//上一页面
        prevPage.setData({//直接给上一页面赋值
          userName:that.userName,
        });
        wx.navigateBack({//返回
          delta:1
        })
      },1000)
    }else{//有一个不为true不允许注册
      Notify({ type: 'danger', message: '注册失败，请检查', duration: 1000 });
    }
  }
})