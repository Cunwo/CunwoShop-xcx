const app = getApp()

// 弹框需要引入
import myDialog from '../../components/dialog/dialog.js';

import {
  MyModel
} from 'my-model.js'
var myModel = new MyModel();

Page({
	data: {
    balance:0,
    freeze:0,
    score:0,
    score_sign_continuous:0 ,
    userInfo : {
      avatarUrl : "../../images/avatar.jpg" ,
      nickName : "暂未登陆"
    },
    loginButton : "" ,
    usernameText : "hiddle"
  },
	onLoad() {
    
	},	
  onShow() {
    //获取授权 联合登陆myDialog.unionLogin()
    myDialog.unionLogin((res) => {
      console.log("myDialog")
      console.log(res);

      if(res.nickName != null ){
        this.setData({
          userInfo: res ,
          loginButton : "hiddle",
          usernameText : ""
        });
      }else{
        this.setData({
          loginButton: "" ,
          usernameText : "hiddle"
        });
      }

    
    })
    
    this.setData({
      version: app.globalData.version
    });

    this.getUserApiInfo();

    this.getUserAmount();
    this.checkScoreSign();
  },	

  aboutUs : function () {
    wx.showModal({
      title: '关于我们',
      content: '本系统由阔雷科技搭建，\r\n官网https://www.kuolei.com',
      showCancel:false
    })
  },
  getPhoneNumber: function(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
      data: {
        token: app.globalData.token,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.getUserApiInfo();
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  },


  getUserApiInfo: function () {
    var that = this;
    myModel.getUserApiInfo(app.globalData.token, (res) => {
      if (res.status == 0) {
        that.setData({
          apiUserInfoMap: res.data,
          //userMobile: res.data.data.base.mobile
          userMobile: res.data.mobile
        });
      }
    })
  },

  getUserAmount: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            balance: res.data.data.balance,
            freeze: res.data.data.freeze,
            score: res.data.data.score
          });
        }
      }
    })
  },
  
  checkScoreSign: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/today-signed',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            score_sign_continuous: res.data.data.continuous
          });
        }
      }
    })
  },
  scoresign: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/sign',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.getUserAmount();
          that.checkScoreSign();
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  relogin:function(){
    var that = this;
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        app.globalData.token = null;
        app.login();
        wx.showModal({
          title: '提示',
          content: '重新登陆成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.onShow();
            }
          }
        })
      },
      fail(res){
        console.log(res);
        wx.openSetting({});
      }
    })
  },
  recharge: function () {
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  withdraw: function () {
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  },
})