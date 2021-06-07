// pages/editor/editor.js
const db = wx.cloud.database();
const userInfo = db.collection('userInfo');
const app = getApp();
import Notify from '@vant/weapp/notify/notify';
//引入时间戳转换时间格式方法
const utilsBirthday = require('../../utils/birthday');
//引入计算年龄方法
const utilsAge = require('../../utils/age');
//引入地区列表
import { areaList } from '../../utils/area';
Page({
  data: {
    userName:'',
    password:'',
    oldPassword:'',//旧密码
    newPassword:'',//新密码
    oldErrMsg:'',//旧密码错误提示信息
    newErrMsg:'',//新密码错误提示信息
    oldError:false,//旧密码是否一致
    newError:false,//新密码是否合法
    passwordShow: false,
    userImg:'',
    sex:'保密',
    sexShow: false,
    actions: [
      {name: '男',},
      {name: '女',},
      {name: '保密',}
    ],
    area:'',
    areaShow: false,
    areaList,
    age:'',
    birthday:'',
    ageShow:'',
    currentDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } 
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel()
    let that = this;
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('objtArry', function (data) {
      that.setData({
        userName:data.data.userName
      })
    })
    userInfo.where({
      userName:this.data.userName
    }).get().then(res => {
      console.log(res);
      this.setData({
        password: res.data[0].password,
        userImg: res.data[0].userImg,
        area: res.data[0].city,
        age: res.data[0].age,
        sex: res.data[0].sex,
        birthday: res.data[0].birthday
      })
    })
  },
  //密码输入框失焦事件
  lostBlur(event){
    //获取输入框标识
    let evName = event.currentTarget.id;
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
    if(evName == 'oldPassword'){//标识是旧密码时
      let res = evValue.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/);
      if(res == null){//没匹配上密码的正则
        this.setData({
          oldPassword:evValue,
          oldErrMsg:'密码格式错误',
          oldError:false
        })
      }else{//匹配上了密码的正则
        if(evValue == this.data.password){
          this.setData({
            oldPassword:evValue,
            oldErrMsg:'',
            oldError:true
          })
        }else{
          this.setData({
            oldPassword:evValue,
            oldErrMsg:'密码错误',
            oldError:false
          })
        }
      }
    }else if(evName == 'newPassword'){//标识是新密码时
      let res = evValue.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/);
      if(res == null){//没有匹配上密码正则
        this.setData({
          newPassword:evValue,
          newErrMsg:'密码格式错误',
          newError:false
        })
      }else{//匹配上密码正则
        if(evValue != this.data.oldPassword){//新旧密码不同
          this.setData({
            newPassword:evValue,
            newError:true,
            newErrMsg:''
          })
        }else{//新旧密码相同
          this.setData({
            newErrMsg:'两次密码不能相同',
            newError:false,
            newPassword:evValue
          })
        }
      }
    }
  },
  //输入框清空去除错误提示
  ifClear(res){
    let whichError = res.currentTarget.id;
    if(whichError == 'oldPassword'){
      this.setData({
        oldErrMsg:''
      })
    }else if(whichError == 'newPassword'){
      this.setData({
        newErrMsg:''
      })
    }
  },
  //修改密码
  changePassword() {
    console.log(this.data.oldError,this.data.newError)
    if(this.data.oldError && this.data.newError){
      this.setData({
        passwordShow:false
      })
      console.log(this.data.newPassword)
      userInfo.where({
        userName: this.data.userName
      }).update({//更新数据库用户密码
        data: {
          password: this.data.newPassword
        },
        success: function(res) {
          console.log('数据库',res.data)
        }
      })
      Notify({ type: 'success', message: '修改密码成功',duration:1000});
      setTimeout(() => {
        wx.reLaunch({
          url: '../login/login?id=1&key=' + this.data.userName
        })
      }, 1000);
    }else{
      this.setData({
        passwordShow:true
      })
      Notify({ type: 'warning', message: '修改密码失败',duratio:1000});
    }
  },
  //动作面板打开
  onOpen(event) {
    let id = event.currentTarget.id;
    if(id == 'sex'){//打开性别面板
      this.setData({ sexShow: true });
    }else if(id == 'area'){//打开地区面板
      this.setData({ areaShow: true });
    }else if(id == 'birthday'){//打开生日面板
      this.setData({ birthdayShow: true });
    }else if(id == 'password'){//打开修改密码面板
      this.setData({ passwordShow:true });
    }else if(id == 'images'){//打开修改头像面板
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths[0]
          // that.uploadFile(tempFilePaths) 如果这里不是=>函数
          //则使用上面的that = this
          this.uploadFile(tempFilePaths) 
        },
      })
    }
  },
  //动作面板关闭
  onClose(event) {
    if(this.data.sexShow){//性别选择关闭
      this.setData({ sexShow: false })
    }else if(this.data.areaShow){//地区选择关闭
      if(event.detail === undefined){
        this.setData({
          areaShow: false
        })
      }else{
        let j = '';
        for(let i in event.detail.values){
          j += event.detail.values[i].name;
        }
        this.setData({
          area: j,
          areaShow: false
        })
      }
    }else if(this.data.birthdayShow){//生日选择关闭
      if(event.detail === undefined){
        this.setData({
          birthdayShow: false
        })
      }else{
        //设置时间戳
        let timeStamp = this.data.currentDate
        let timeStandard = utilsBirthday.getTsFormatDate(timeStamp)
        this.setData({
          birthday: timeStandard,
          birthdayShow: false
        })
        this.onAge(this.data.birthday)
      }
    }
  },
  //动作面板选择
  onSelect(event) {
    //性别设置
    if(event.detail.name != this.data.sex){
      this.setData({ sex: event.detail.name })
    }
  },
  //动作面板取消
  onDown(event) {
    if(event.target.id == 'timePicker'){//生日取消按钮
      this.setData({
        birthdayShow:false
      })
    }else if(event.target.id == 'area'){//地区取消按钮
      this.setData({
        areaShow:false
      })
    }else if(event.target.id == 'password'){//修改密码取消按钮
      setTimeout(() => {
        this.setData({
          oldPassword:'',
          oldErrMsg:'',
          newErrMsg:'',
          newPassword:'',
          passwordShow:false
        })
      }, 1000);
      
    }
  },
  //日期选择器
  onInput(event) {
    //设置事件戳
    this.setData({
      currentDate: event.detail,
    });
  },
  //生日换算年龄
  onAge(res) {
    let age = utilsAge.getAge(res)
    this.setData({
      age:age
    })
  },
  //上传图片
  uploadFile(fileUrl) {
    wx.cloud.uploadFile({
      cloudPath: (new Date()).valueOf()+'.png', // 文件名
      filePath: fileUrl, // 文件路径
      success: res => {
        // res.fileID是刚上传图片的路径
        this.setData({
          userImg: res.fileID
        })
      },
      fail: err => {
        // handle error
        console.log('err:',err)
      }
    })
  },
  //保存全部
  saveAll(){
    // console.log('保存了')
    let that = this;
    userInfo.where({
      userName: that.data.userName
    }).update({
      data:{
        userImg: db.command.set(that.data.userImg),
        city: db.command.set(that.data.area),
        sex: db.command.set(that.data.sex),
        age: db.command.set(that.data.age),
        password: db.command.set(that.data.password),
        birthday: db.command.set(that.data.birthday),
      },
      success(res) {
        // console.log('res',res);
        Notify({ type: 'success', message: '保存成功', duration: 1000});
        setTimeout(function(){//定时跳转到用户页面
          wx.reLaunch({
            url: '../info/info?key=' + that.data.userName
          })
        },1000)
      }
    })
  }
})