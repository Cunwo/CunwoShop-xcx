//获取应用实例
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');



import {
  GoodsDetailModel
} from 'goods-details-model.js'
var model = new GoodsDetailModel();

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail: {},
    swiperCurrent: 0,
    hasMoreSelect: false,
    selectSize: "选择：",
    selectSizePrice: 0,
    shopNum: 0,
    hideShopPopup: true,
    buyNumber: 0,
    buyNumMin: 1,
    buyNumMax: 0,

    propertyChildIds: "",
    propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo: {},
    shopType: "addShopCar", //购物类型，加入购物车或立即购买，默认为加入购物车
    hasProperty : true ,
  },

  //事件处理函数
  swiperchange: function(e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  //首次加载事件
  onLoad: function(e) {
    console.log("详情页的id：" + e.keyword)
    //定义的id
    if (e.inviter_id) {
      wx.setStorage({
        key: 'inviter_id_' + e.keyword,
        data: e.inviter_id
      })
    }
    var that = this;
    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function(res) {
        that.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        });
      }
    })
    
    console.log("详情页的id2：" + e.keyword)
    model.getDetailInfo(e.keyword, (res) => {
      console.log("商品详情"+res)
      //规格选择栏
      var selectSizeTemp = "";
      if (res.data.productPropertyList) {
        for (var i = 0; i < res.data.productPropertyList.length; i++) {
          selectSizeTemp = selectSizeTemp + " " + res.data.productPropertyList[i].parentProperty.name;
        }
        that.setData({
          hasMoreSelect: true,
          selectSize: that.data.selectSize + selectSizeTemp,
          selectSizePrice: res.data.price,
        });
      }
      that.data.goodsDetail = res.data;
      //TODO 视频
      // if (res.data.data.basicInfo.videoId) {
      //   that.getVideoSrc(res.data.data.basicInfo.videoId);
      // }
      that.setData({
        goodsDetail: res.data,
        selectSizePrice: res.data.price,
        buyNumMax: res.data.stock,
        buyNumber: (res.data.stock > 0) ? 1 : 0
      });
      WxParse.wxParse('article', 'html', res.data.detail, that, 5);
    })

   

    this.reputation(e.id);
    this.getKanjiaInfo(e.id);
  },




  goShopCar: function() {
    wx.reLaunch({
      url: "/pages/shop-cart/index"
    });
  },
  toAddShopCar: function() {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
  },
  tobuy: function() {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap();
    // if (this.data.goodsDetail.properties && !this.data.canSubmit) {
    //   this.bindGuiGeTap();
    //   return;
    // }
    // if (this.data.buyNumber < 1) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '暂时缺货哦~',
    //     showCancel: false
    //   })
    //   return;
    // }
    // this.addShopCar();
    // this.goShopCar();
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function() {
    this.setData({
      hideShopPopup: false
    })
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function() {
    this.setData({
      hideShopPopup: true
    })
  },
  numJianTap: function() {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap: function() {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  /**
   * 选择商品规格
   * @param {Object} e
   */
  labelItemTap: function(e) {
    var that = this;
    /*
    console.log(e)
    console.log(e.currentTarget.dataset.propertyid)
    console.log(e.currentTarget.dataset.propertyname)
    console.log(e.currentTarget.dataset.propertychildid)
    console.log(e.currentTarget.dataset.propertychildname)
    */
    // 取消该分类下的子栏目所有的选中状态
    var childs = that.data.goodsDetail.productPropertyList[e.currentTarget.dataset.propertyindex].childPropertyList;
    for (var i = 0; i < childs.length; i++) {
      that.data.goodsDetail.productPropertyList[e.currentTarget.dataset.propertyindex].childPropertyList[i].active = false;
    }
    // 设置当前选中状态
    that.data.goodsDetail.productPropertyList[e.currentTarget.dataset.propertyindex].childPropertyList[e.currentTarget.dataset.propertychildindex].active = true;
    // 获取所有的选中规格尺寸数据
    var needSelectNum = that.data.goodsDetail.productPropertyList.length;
    console.log("多少")
    console.log(needSelectNum)

    var curSelectNum = 0;
    var propertyChildIds = "";
    var propertyChildNames = "";
    for (var i = 0; i < that.data.goodsDetail.productPropertyList.length; i++) {
      childs = that.data.goodsDetail.productPropertyList[i].childPropertyList;
      for (var j = 0; j < childs.length; j++) {
        if (childs[j].active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + that.data.goodsDetail.productPropertyList[i].parentProperty.id + ":" + childs[j].id + ",";
          propertyChildNames = propertyChildNames + that.data.goodsDetail.productPropertyList[i].parentProperty.name + ":" + childs[j].name + "  ";
        }
      }
    }
    var canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    // 计算当前价格
    if (canSubmit) {

      model.getProductPriceInfo(that.data.goodsDetail.id, propertyChildIds, (res) => {
        console.log(res)
        //数据绑定
        if(res.status == 0 ){
          console.log("1111111111111")
          that.setData({
            selectSizePrice: res.data.price,
            propertyChildIds: propertyChildIds,
            propertyChildNames: res.data.name,
            buyNumMax: res.data.stocks,
            buyNumber: (res.data.stocks > 0) ? 1 : 0 ,
            hasProperty: true
          });
        }else{
          console.log("2222222222")
          that.setData({
            hasProperty : false 
          });
        }
       
       
      })

    }
    this.setData({
      goodsDetail: that.data.goodsDetail,
      canSubmit: canSubmit
    })

  
  },
  /**
   * 加入购物车
   */
  addShopCar: function() {
    if (!this.data.hasProperty) {
      // wx.showModal({
      //   title: '提示',
      //   content: '该属性信息不全，请电脑端添加！',
      //   showCancel: false
      // })
      return ;
    }

    console.log("this.data.goodsDetail.productPropertyList")
    console.log(this.data.goodsDetail.productPropertyList.length)


    if (this.data.goodsDetail.productPropertyList && !this.data.canSubmit && this.data.goodsDetail.productPropertyList.length != 0  ) {
     
      console.log("33333333333")
     
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo();

    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    });

    // 写入本地存储
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
    this.closePopupTap();
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
    //console.log(shopCarInfo);

    //shopCarInfo = {shopNum:12,shopList:[]}
  },
  /**
   * 立即购买
   */
  buyNow: function() {

    console.log("立即购买")



    console.log(this.data.canSubmit)
    console.log(this.data.goodsDetail.properties)



    if (this.data.goodsDetail.productPropertyList && !this.data.canSubmit && this.data.goodsDetail.productPropertyList.length != 0) {

      console.log("33333333333")

      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      return;
    }



    // if (this.data.goodsDetail.properties && !this.data.canSubmit) {
    //   if (!this.data.hasProperty) {
    //     wx.showModal({
    //       title: '提示',
    //       content: '该属性信息不全，请电脑端添加！',
    //       showCancel: false
    //     })
    //   }
    //   if (!this.data.canSubmit) {
    //     wx.showModal({
    //       title: '提示',
    //       content: '请选择商品规格！',
    //       showCancel: false
    //     })
    //   }
    //   this.bindGuiGeTap();
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先选择规格尺寸哦~',
    //     showCancel: false
    //   })
    //   return;
    // }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建立即购买信息
    var buyNowInfo = this.buliduBuyNowInfo();
    // 写入本地存储
    wx.setStorage({
      key: "buyNowInfo",
      data: buyNowInfo
    })
    this.closePopupTap();

    wx.navigateTo({
      url: "/pages/to-pay-order/index?orderType=buyNow"
    })
  },

  toIndex : function(){
    console.log("进来了")
    wx.reLaunch({
      url: "/pages/index/index"
    });
  },




  /**
   * 组建购物车信息
   */
  bulidShopCarInfo: function() {
    // 加入购物车
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.id;
    shopCarMap.pic = this.data.goodsDetail.mainImg.url ;
    shopCarMap.name = this.data.goodsDetail.name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
   // shopCarMap.propertyChildIds = res.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    //TODO 物流模板
    //shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    //TODO 不知道这是什么
    //shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    return shopCarInfo;
  },
  /**
   * 组建立即购买信息
   */
  buliduBuyNowInfo: function() {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.id;
    shopCarMap.pic = this.data.goodsDetail.mainImg.url;
    shopCarMap.name = this.data.goodsDetail.name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logistics = this.data.goodsDetail.logistics;

    var shopCarInfo = {};
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }

    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }

    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }
      
    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }

    return shopCarInfo;

  },
  onShareAppMessage: function() {
    return {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + app.globalData.uid,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  reputation: function(goodsId) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/reputation',
      data: {
        goodsId: goodsId
      },
      success: function(res) {
        if (res.data.code == 0) {
          //console.log(res.data.data);
          that.setData({
            reputation: res.data.data
          });
        }
      }
    })
  },
  getVideoSrc: function(videoId) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/media/video/detail',
      data: {
        videoId: videoId
      },
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            videoMp4Src: res.data.data.fdMp4
          });
        }
      }
    })
  },
  getKanjiaInfo: function(gid) {
    var that = this;
    if (!app.globalData.kanjiaList || app.globalData.kanjiaList.length == 0) {
      that.setData({
        curGoodsKanjia: undefined
      });
      return;
    }
    let curGoodsKanjia = app.globalData.kanjiaList.find(ele => {
      return ele.goodsId == gid
    });
    if (curGoodsKanjia) {
      that.setData({
        curGoodsKanjia: curGoodsKanjia
      });
    } else {
      that.setData({
        curGoodsKanjia: undefined
      });
    }
  },
  goKanjia: function() {
    var that = this;
    if (!that.data.curGoodsKanjia) {
      return;
    }
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/kanjia/join',
      data: {
        kjid: that.data.curGoodsKanjia.id,
        token: app.globalData.token
      },
      success: function(res) {
        if (res.data.code == 0) {
          console.log(res.data);
          wx.navigateTo({
            url: "/pages/kanjia/index?kjId=" + res.data.data.kjId + "&joiner=" + res.data.data.uid + "&id=" + res.data.data.goodsId
          })
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
})