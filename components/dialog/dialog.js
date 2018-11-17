// components/dialog/dialog.js
//获取应用实例
var app = getApp()
import Component from "../components";
import { Base } from '../../utils/base.js'
var base = new Base()

export default {
  //默认数据
  data() {
    return {
      title: "提示",
      content: "提示内容",
      showCancel: !0,
      cancelText: "取消",
      cancelType: "button",
      confirmText: "确定",
      confirmType: "button",
      confrimOpenType: "",
      success: () => {

      },
      fail: () => {

      },
      complete: () => {

      }
    }
  },

  /**
   * 创建组件
   */
  open(opts = {}) {
    const options = Object.assign({
      visible: !1
    }, this.data(), opts);

    const component = new Component({
      scope: `myDialog`,
      data: options,
      methods: {
        //隐藏
        hide(cb) {
          this.setHidden();
          setTimeout(() => typeof cb === 'function' && cb());
        },
        //显示
        show() {
          this.setVisible();
        },
        //按钮回调
        buttonTapped(e) {
          const index = e.currentTarget.dataset.index;
          const button = options.buttons[index];
          this.hide(() => {
            if (options.buttons.length > 1) {
              if (index < 1) {
                typeof options.fail === `function` && options.fail(e);
              }
            } else {
              typeof options.success === `function` && options.success(e);
            }
          });
        },
        //用户信息回调
        getUserInfo(e) {
          this.hide(() => {
            if (e.detail.userInfo) {
              // 成功获得用户信息
              typeof options.success === `function` && options.success(e);
            } else {
              // 用户拒绝,走fail方法
              typeof options.fail === `function` && options.fail(e);
            }
            typeof options.complete === `function` && options.complete(e);
          });
        }
      }
    });

    component.show();
    return component.hide;
  },

  /**
   * 显示弹框
   */
  showModal(opts) {
    const options = Object.assign({
      visible: !1
    }, this.data(), opts);

    let buttons = [];

    //声明取消按钮
    let cancel_btn = {
        text: options.cancelText,
        type: options.cancelType,
        onTap: (e) => {
          options.fail === 'function' && options.fail(e)
        }
      },
      //声明确定按钮
      confirm_btn = {
        text: options.confirmText,
        type: options.confirmType,
        openType: options.confirmOpenType,
        className: "modal-btn-primary",
        onTap: (e) => {
          options.success === 'function' && options.success(e);
        }
      };

    //是否显示取消按钮
    if (options.showCancel) {
      buttons[0] = cancel_btn;
      buttons[1] = confirm_btn;
    } else {
      buttons[0] = confirm_btn;
    }

    return this.open(Object.assign({
      buttons
    }, options));
  },



  //联合登陆
  unionLogin: function (unionLoginCallback) {
    var that = this
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权了")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log("授权获得的信息"+res.userInfo)
              unionLoginCallback && unionLoginCallback(res.userInfo);
            }
          })
        } else {
          console.log("没有授权")
          that.authDialog((res) => {
            console.log("authDialog的返回")
            console.log("authDialog的返回"+res.nickName);
            unionLoginCallback && unionLoginCallback(res);
          })
        }
        
      }
    })
  },
  //弹框授权
  authDialog: function (authDialogCallback) {
    var that = this
    wx.login({
      success: (n) => {

        console.log("获取到的code是" + n.code)
        //登陆（首次登陆会自动注册）
        base.doLoginByCode(n.code, (res) => {
          console.log("注册")
          console.log(res);
          //数据绑定
          // this.setData({
          //   'banners': res.data
          // });
        });

        console.log("到这里了")

        that.showModal({
          title: "提示",
          content: "需要您授权",
          confirmOpenType: "getUserInfo",
          success: (e) => {
            console.log("e", e);
            let userInfo = e.detail.userInfo;
            wx.setStorageSync("userInfo", userInfo);




            app.globalData.userInfo = userInfo
            authDialogCallback && authDialogCallback(userInfo);

            //更新用户信息
            base.updateUserInfo()
          }
        });
      }
    });
  },


};