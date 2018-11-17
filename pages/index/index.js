//index.js
//获取应用实例
var app = getApp()

// 弹框需要引入
import myDialog from '../../components/dialog/dialog.js';

import {
  Model
} from 'index-model.js'
var model = new Model();

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false, // loading
    userInfo: {},
    swiperCurrent: 0,
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    scrollTop: "0",
    loadingMoreHidden: {},
    hasNoCoupons: true,
    coupons: [],
    bannerId: 1,
    //阔雷额外新增的
    searchInput: '',

    categoryId: 0,
    orderBy: "",
    pageNum: {},
    pageSize: 10,
    // 触底事件
    isEmpty: false,
    hasMoreText: "加载中...",
    hasMoreTextTemp: {},
    tab: 1,
    // 用于存放商品缓存
    loadedData: {},
    loadedDataIndex: 0,

    totalProductTemp: {},
    productTempArr: [],

    isEnd: {}
  },
  onLoad: function() {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    // 获取频道数据
    model.getBannerData(2, (res) => {
      console.log("channel")
      console.log(res);
      //数据绑定
      this.setData({
        'channelArr': res.data
      });
    });
    //只要这行代码就可以实现弹窗了
    //如果不要返回值的话，用myDialog.unionLogin() ，如果要返回值，用下面的方法
    myDialog.unionLogin((res) => {
      console.log("unionLogin")
      console.log(res);
    })
    //阔雷 获得轮播图h
    model.getBannerData(this.data.bannerId, (res) => {
      //数据绑定
      this.setData({
        'banners': res.data
      });
    });

    //获得分类数据
    model.getCategoryData(this.data.categoryId, (res) => {
      console.log("category")
      console.log(res);
      //数据绑定
      var categories = [{
        id: 0,
        name: "全部"
      }];
      if (res.status == 0) {
        for (var i = 0; i < res.data.length; i++) {
          categories.push(res.data[i]);
        }
      }
      that.setData({
        categories: categories,
        activeCategoryId: 0
      });

      //获取商品数据
      that.getGoodsList();

    });
    that.getNotice();
    //that.getCoupons();
  },


  _loadData: function() {
    var that = this;
    category.getCategory(0, (categoryData) => {
      console.log(categoryData)
      that.setData({
        categoryTypeArr: categoryData.data,
      });
      category.getCategory(categoryData.data[0].id, (subCategoryData) => {
        console.log("进来二级了")
        console.log(subCategoryData)
        var dataObj = {
          procucts: subCategoryData.data,
          topImgUrl: categoryData.data[0].topImageUrl,
          title: categoryData.data[0].name
        };
        that.setData({
          categoryProducts: dataObj
        });
        this.data.loadedData[0] = dataObj;
      })
    })
  },




  tabClick: function(e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },

  
  //事件处理函数
  swiperchange: function(e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  toDetailsTap: function(e) {

    console.log("点击的id" + e.currentTarget.dataset.id)

    wx.navigateTo({
      url: "/pages/goods-details/index?keyword=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    //0 没有导向
    //1 导向产品
    //2 导向分类
    //3 导向关键字
    //导向产品页
    if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: "/pages/goods-details/index?keyword=" + e.currentTarget.dataset.keyword
      })
    }
    //导向搜索页面
    else if (e.currentTarget.dataset.type == 2) {
      wx.navigateTo({
        url: "/pages/search/search?keyword=" + e.currentTarget.dataset.keyword + "&type=" + e.currentTarget.dataset.type
      })
    } else if (e.currentTarget.dataset.type == 3) {
      wx.navigateTo({
        url: "/pages/search/search?keyword=" + e.currentTarget.dataset.keyword + "&type=" + e.currentTarget.dataset.type
      })
    }
  },
  bindTypeTap: function(e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  scroll: function(e) {
    //  console.log(e) ;
    var that = this,
      scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
  },



  //触底事件
  onReachBottom: function() {
    console.log('触底事件')
    //如果不考虑频繁刷新 这个方法放上面
    this.onScrollLower();
    if (this.data.loading) return;
    this.setData({
      loading: true
    });
    //这个方法放下面每2秒才会刷新一次
    //  this.onScrollLower();
    setTimeout(() => {
      this.setData({
        loading: false,
        // words: words
      })
    }, 2000)
  },

  onScrollLower: function(event) {
    this.getGoodsList(this.data.activeCategoryId)
  },



  //获取商品数据
  getGoodsList: function(tapId) {
    var that = this;
    //当第一次点击的时候，为所需的参数赋值
    if (!that.data.loadingMoreHidden[that.data.activeCategoryId]) {
      that.data.pageNum[that.data.activeCategoryId] = 1
      that.data.isEnd[that.data.activeCategoryId] = false
      that.data.loadingMoreHidden[that.data.activeCategoryId] = true

     // var hasMoreTextTemp = []
      that.data.hasMoreTextTemp[that.data.activeCategoryId] = "加载中..."
      that.setData({
        hasMoreText: that.data.hasMoreTextTemp[that.data.activeCategoryId]
      })
    }

    if (!that.data.isEnd[that.data.activeCategoryId]) {
       model.getProductsData(
        that.data.searchInput,
        that.data.activeCategoryId,
        this.data.pageNum[that.data.activeCategoryId],
        this.data.pageSize,
        this.data.orderBy,
        (res) => {
          
          //赋值
          if (that.data.totalProductTemp[that.data.activeCategoryId]) {
            //结果要先转为数组才可以使用，productTempArr为中介，不可以省 
            //第二次开始是相加
            that.data.productTempArr = that.data.totalProductTemp[that.data.activeCategoryId].concat(res.data.list)
            that.data.totalProductTemp[that.data.activeCategoryId] = that.data.productTempArr
          } else {
            //第一次是赋值
            that.data.productTempArr = res.data.list
            that.data.totalProductTemp[that.data.activeCategoryId] = that.data.productTempArr
          }
          if (res.data.list.length < 10) {
            console.log("执行了我是有底线的赋值")
            that.data.hasMoreTextTemp[that.data.activeCategoryId] = "--我是有底线的--"
            that.setData({
              hasMoreText: that.data.hasMoreTextTemp[that.data.activeCategoryId]
            })
            that.data.isEnd[that.data.activeCategoryId] = true;
          }
          that.setData({
            goods: that.data.productTempArr
          })
          this.data.pageNum[that.data.activeCategoryId] += 1;
          console.log("下一次要查询的页码是"+this.data.pageNum[that.data.activeCategoryId]);
        });
    }else{
      that.setData({
        goods: that.data.totalProductTemp[tapId]
      })
    }
  },
  //获得公告
  getNotice: function() {
    var that = this;
    var pageNum = 1
    var pageSize = 5
    //阔雷 获得轮播图
    model.getNoticeData(pageNum, pageSize, (res) => {
      console.log("notice")
      console.log(res);
      if (res.status == 0) {
        that.setData({
          noticeList: res.data
        });
      }
    });
  },
  //搜索内容
  listenerSearchInput: function(e) {
    this.setData({
      searchInput: e.detail.value
    })
  },
  //搜索
  toSearch: function() {
    console.log(this.data.searchInput)
    wx.navigateTo({
      url: "/pages/search/search?keyword=" + this.data.searchInput + "&type=" + 3
    })
  },










  //分享商城
  onShareAppMessage: function() {
    return {
      title: wx.getStorageSync('mallName') + '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  //获取优惠券
  getCoupons: function() {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/coupons',
      data: {
        type: ''
      },
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            hasNoCoupons: false,
            coupons: res.data.data
          });
        }
      }
    })
  },
  // 领取优惠券
  gitCoupon: function(e) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
      data: {
        id: e.currentTarget.dataset.id,
        token: app.globalData.token
      },
      success: function(res) {
        if (res.data.code == 20001 || res.data.code == 20002) {
          wx.showModal({
            title: '错误',
            content: '来晚了',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20003) {
          wx.showModal({
            title: '错误',
            content: '你领过了，别贪心哦~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 30001) {
          wx.showModal({
            title: '错误',
            content: '您的积分不足',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20004) {
          wx.showModal({
            title: '错误',
            content: '已过期~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功，赶紧去下单吧~',
            icon: 'success',
            duration: 2000
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