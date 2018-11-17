// pages/search/search.js
import { Search } from 'search-model.js'
var search = new Search();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索需要的
    categoryId: "",
    searchInput: "",
    orderBy: "",
    pageNum: 1,
    pageSize: 10,
    // 触底事件
    isEmpty: false,
    hasMoreText: "加载中...",
    tab : 1 ,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var keyword = options.keyword
    console.log("传过来的keyword是："+keyword)
    console.log("type是："+options.type)
    //0，无导向；1：导向商品; 2: 导向分类；3导向关键字
    //分类过来的 
    if(options.type == 2){
      this.setData({
        categoryId : keyword 
      })
      console.log("进来这里了")
      this.getGoodsList();
    }

  
    //通过搜索过来的
    if(options.type == 3 ){
      console.log("获得到的keyword是：" + keyword)
      this.setData({
        searchInput: keyword
      })
      this.getGoodsList();
    }


   


  },


  
  //触底事件
  onReachBottom: function () {
    console.log('hi')
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

  onScrollLower: function (event) {
    // var nextUrl = this.data.requestUrl +
    //   "?start=" + this.data.totalCount + "&count=20";
    // util.http(nextUrl, this.processDoubanData)
    // wx.showNavigationBarLoading()
    var that = this
    var totalProduct = {};
    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
   

    var data = {
      keyword: this.data.searchInput,
      categoryId: this.data.categoryId,
      orderBy: this.data.orderBy,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
    }

    search.getProductsData(data, (res) => {
      var productsArr = [];
      totalProduct = {};
      if (!this.data.isEmpty) {
        totalProduct = this.data.goods.concat(res.data.list)

        if (res.data.list >= 10) {
          console.log("有数据" + res.data.list.length)
        } else {
          that.setData({
            hasMoreText: "--我是有底线的--"
          })
        }
      } else {
        totalProduct = res.data.list;
        this.data.isEmpty = false;
      }
      this.setData({
        //productsArr: this.data.productsArr.concat(data.data.list),
        goods: totalProduct
      });
    });
    // console.log("页码"+this.date.pageNum)
    this.data.pageNum += 1;
    console.log(this.data.pageNum);
  },
  toDetailsTap: function (e) {

    console.log("点击的id" + e.currentTarget.dataset.id)

    wx.navigateTo({
      url: "/pages/goods-details/index?keyword=" + e.currentTarget.dataset.id
    })
  },
 //获取商品数据
  getGoodsList: function () {
    
   
    var that = this;
    console.log("到这里")
    var data = {
      keyword: this.data.searchInput,
      categoryId: this.data.categoryId,
      orderBy: this.data.orderBy,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
    }

    search.getProductsData(data , (res) => {
      console.log("商品！！！！")
      console.log(res)
      if(res.data.list.length < 10 ){
        that.setData({
          hasMoreText: "--我是有底线的--"
        })
      }


      that.setData({
        goods: [],
        loadingMoreHidden: true
      });
      var goods = [];
      //TODO 服务器设置当搜索不到产品的时候，code设置不为0的数字  
      if (res.status != 0 || res.data.list.length == 0) {
        that.setData({
          loadingMoreHidden: false,
        });
        return;
      }
      for (var i = 0; i < res.data.list.length; i++) {
        goods.push(res.data.list[i]);
      }
      that.setData({
        goods: goods,
      });
      console.log("走到这里了")
    });





  },



})