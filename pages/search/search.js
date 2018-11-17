// pages/search/search.js
import {
  Search
} from 'search-model.js'
var search = new Search();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索需要的
    categoryId: "",
    searchInput: "",
    pageSize: 10,
    // 触底事件
    isEmpty: false,
    hasMoreText: "加载中...",
    tab: 1,
    activeCategoryId: 0,
    loadingMoreHidden: {},
    pageNum: {},
    isEnd: {},
    hasMoreTextTemp: {},
    totalProductTemp: {},
    productTempArr: [],
    activeSortId: 0,
    direction: 5,
    reputation: 1,
    orderBy: "default",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var keyword = options.keyword
    console.log("传过来的keyword是：" + keyword)
    console.log("type是：" + options.type)
    //0，无导向；1：导向商品; 2: 导向分类；3导向关键字
    //分类过来的 
    // if (options.type == 2) {
    //   this.setData({
    //     categoryId: keyword
    //   })
    //   console.log("进来这里了")
    //   this.getGoodsList(that.data.orderBy);
    // }

    //分类过来的 

    

    if (options.type == 2) {
      console.log("keyword")
      console.log(keyword)
      var keyword2 = keyword.split(",")
      this.setData({
        //categoryIds: JSON.stringify(keyword2).
        categoryIds : keyword
      })
      console.log("进来这里了")
      this.getGoodsList(that.data.orderBy);
    }

    //通过搜索过来的
    if (options.type == 3) {
      console.log("获得到的keyword是：" + keyword)
      this.setData({
        searchInput: keyword
      })
      this.getGoodsList(that.data.orderBy);
    }
  },
  toDetailsTap: function (e) {

    console.log("点击的id" + e.currentTarget.dataset.id)

    wx.navigateTo({
      url: "/pages/goods-details/index?keyword=" + e.currentTarget.dataset.id
    })
  },
  // 排序的点击
  tabClick: function(e) {
    var that = this
    if (e.currentTarget.dataset.id == 3) {
      var direction = e.currentTarget.dataset.direction;
      0 == direction ?
        that.setData({
          direction: 1,
          tab: e.currentTarget.dataset.id,
          orderBy: 'priceDown'
        }) :
        that.setData({
          direction: 0,
          tab: e.currentTarget.dataset.id,
          orderBy: 'priceUp'
        })

    } else {
      this.setData({
        tab: e.currentTarget.dataset.id,
        direction: e.currentTarget.id,
        orderBy: e.currentTarget.dataset.orderBy
      })
    }
    this.getGoodsList(this.data.orderBy)

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
    this.getGoodsList(this.data.orderBy)
  },

  //获取商品数据
  getGoodsList: function(orderBy) {
    var that = this;
    //当第一次点击的时候，为所需的参数赋值
    if (!that.data.loadingMoreHidden[orderBy]) {
      that.data.pageNum[orderBy] = 1
      that.data.isEnd[orderBy] = false
      that.data.loadingMoreHidden[orderBy] = true

      // var hasMoreTextTemp = []
      that.data.hasMoreTextTemp[orderBy] = "加载中..."
      that.setData({
        hasMoreText: that.data.hasMoreTextTemp[orderBy]
      })
    }
    if (!that.data.isEnd[orderBy]) {
      search.getProductsData(
        this.data.searchInput,
        this.data.categoryId,
        this.data.categoryIds,
        this.data.pageNum[orderBy],
        this.data.pageSize,
        this.data.orderBy,
        (res) => {

          //赋值
          if (that.data.totalProductTemp[orderBy]) {
            //结果要先转为数组才可以使用，productTempArr为中介，不可以省 
            //第二次开始是相加
            that.data.productTempArr = that.data.totalProductTemp[orderBy].concat(res.data.list)
            that.data.totalProductTemp[orderBy] = that.data.productTempArr
          } else {
            //第一次是赋值
            that.data.productTempArr = res.data.list
            that.data.totalProductTemp[orderBy] = that.data.productTempArr
          }
          if (res.data.list.length < 10) {
            console.log("执行了我是有底线的赋值")
            that.data.hasMoreTextTemp[orderBy] = "--我是有底线的--"
            that.setData({
              hasMoreText: that.data.hasMoreTextTemp[orderBy]
            })
            that.data.isEnd[orderBy] = true;
          }
          that.setData({
            goods: that.data.productTempArr
          })
          this.data.pageNum[orderBy] += 1;
          console.log("下一次要查询的页码是" + this.data.pageNum[orderBy]);
        });
    } else {
      that.setData({
        goods: that.data.totalProductTemp[orderBy]
      })
    }
  },

  clearSearch:function(){
    this.setData({
      searchInput: ""
    })
  },

  //搜索内容
  listenerSearchInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      searchInput: e.detail.value
    })
  },
  //搜索
  toSearch: function () {
    this.setData({
      categoryId : "",
      orderBy    : "",
      isEmpty: false,
      hasMoreText: "加载中...",
      tab: 1,
      activeCategoryId: 0,
      loadingMoreHidden: {},
      pageNum: {},
      isEnd: {},
      hasMoreTextTemp: {},
      totalProductTemp: {},
      productTempArr: [],
      activeSortId: 0,
      direction: 5,
      reputation: 1,
      orderBy: "default",
    },()=>{
      this.getGoodsList()
    })
    // wx.navigateTo({
    //   url: "/pages/search/search?keyword=" + this.data.searchInput + "&type=" + 3
    // })
  },


})