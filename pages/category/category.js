// pages/category/category.js
import { Category } from 'category-model.js'
var category = new Category();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenuIndex: 0,
    loadedData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData: function () {
    var that = this;
    category.getCategory(0, (categoryData) => {
      var c = []
      c = categoryData
      console.log("category:"+c)
      that.setData({
        categoryTypeArr: categoryData.data,
      });
      category.getCategory(categoryData.data[0].id, (subCategoryData) => {
        console.log("进来二级了")
        console.log(subCategoryData)
        var dataObj = {
          procucts: subCategoryData.data,
          topImgUrl: categoryData.data[0].image.url,
          title: categoryData.data[0].name
        };
        that.setData({
          categoryProducts: dataObj
        });
        this.data.loadedData[0] = dataObj;
      })
    })
  },
  

  //判断当前分类下的商品数据是否已经被加载过
  isLoadedData: function (index) {
    if (this.data.loadedData[index]) {
      return true;
    }
    return false;
  },

  changeCategory: function (event) {
    var index = category.getDataSet(event, 'index'),
      id = category.getDataSet(event, 'id');//获取data-set
    this.setData({
      currentMenuIndex: index
    })
    if (!this.isLoadedData(index)) {
      //如果没有加载过当前分类的商品数据
      console.log("得到的id："+id)
      category.getCategory(id, (data) => {
          var dataObj = {
            procucts: data.data,
            topImgUrl: this.data.categoryTypeArr[index].image.url,
            title: this.data.categoryTypeArr[index].name
          };

          this.setData({
            categoryProducts: dataObj
          })
          this.data.loadedData[index] = dataObj;
        });
    }
    else {
      //已经加载过  直接读取
      this.setData({
        categoryProducts: this.data.loadedData[index]
      })
    }
  },

  //商品跳转
  onProductsItemTap: function (event) {
    var id = category.getDataSet(event, 'id');
    var ids = category.getDataSet(event,'ids')
    var keyword2 = ids.split(",")
    console.log(ids)
    wx.navigateTo({
      url: "/pages/search/search?keyword=" + JSON.stringify(keyword2) + "&type=" + 2
    })
 
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


})