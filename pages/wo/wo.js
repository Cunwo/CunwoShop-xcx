// 弹框需要引入
import myDialog from '../../components/dialog/dialog.js';


// pages/wo/wo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isjqr: !1,
    isdd: !0,
    isaddsp: !1,
    isqzgz: !1,
    sswitch: !1,
    credit1: "0",
    credit2: "0.00",
    favnum: "0",
    dclnum: "0",
    yclnum: "0",
    type: 0,
    pid: "",
    isshmode: !0,
    isucti: 0,
    isdiyuc: 2,
    spadmin: 0,
    siteroot: "",
    hiddenmodalput: !0,
    tempmobile: "",
    mobiletxt: "设置",
    passW: "",
    passWre: "",
    openid: "",
    weid: "",
    shopid: 0,
    hbpic: "none",
    nofans: "none",
    needreset: !1,
    mplogo: "",
    s_w: "",
    s_h: "",
    diymenu: [] ,
    baseInfo : wx.getStorageSync('baseInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取授权 联合登陆myDialog.unionLogin()
    myDialog.unionLogin((res) => {
      console.log("myDialog")
      console.log(res);

      if (res.nickName != null) {
        this.setData({
          userInfo: res,
          loginButton: "hiddle",
          usernameText: ""
        });
      } else {
        this.setData({
          loginButton: "",
          usernameText: "hiddle"
        });
      }


    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindgetuserinfo: function(t) {
    var e = this;
    console.log(t.detail);
    var o = t.detail.userInfo,
      a = {};
    a.nickname = t.detail.userInfo.nickName, a.avatar = t.detail.userInfo.avatarUrl,
      e.setData({
        userInfo: a
      }), app.util.getUserInfo_bak(function(a) {
        a.memberInfo.nickname = o.nickName, a.memberInfo.avatar = o.avatarUrl, a.memberInfo.city = o.city,
          a.memberInfo.country = o.country, a.memberInfo.province = o.province, a.memberInfo.gender = o.gender,
          wx.getStorage({
            key: "userInfo",
            success: function(t) {
              if (void 0 !== t.data.memberInfo.sitetitle) {
                wx.setStorageSync("sptit", t.data.memberInfo.sitetitle);
                t.data.memberInfo.sitetitle;
              }
              void 0 !== t.data.memberInfo.enunid && (wx.setStorageSync("enunid", t.data.memberInfo.enunid),
                  e.setData({
                    enunid: t.data.memberInfo.enunid
                  })), void 0 !== t.data.memberInfo.xcxoid && (wx.setStorageSync("xcxoid", t.data.memberInfo.xcxoid),
                  e.setData({
                    xcxoid: t.data.memberInfo.xcxoid
                  })), void 0 !== t.data.memberInfo.tb_pid && wx.setStorageSync("tb_pid", t.data.memberInfo.tb_pid),
                void 0 !== t.data.memberInfo.nofans && wx.setStorage({
                  key: "nofans",
                  data: t.data.memberInfo.nofans
                }), void 0 !== t.data.memberInfo.shopid && wx.setStorageSync("shopid", t.data.memberInfo.shopid),
                e.addhspid_band(a.memberInfo);
            }
          });
      });
  },
  jumpPhone: function () {
    console.log("打电话")
    wx.makePhoneCall({
      //phoneNumber: "13055741236",
      phoneNumber: this.data.baseInfo.mobile,
      success: function () {
      },
      fail: function () {
      }
    })
  },
  aboutUs: function () {
    wx.showModal({
      title: '关于我们',
      content: '本系统由阔雷科技搭建，\r\n官网https://www.kuolei.com',
      showCancel: false
    })
  },
})