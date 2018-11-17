var app = getApp();


import {
  OrderDetails
} from 'order-detail-model.js'
var orderDetail = new OrderDetails();

Page({
    data:{
      orderId:0,
        goodsList:[],
        yunPrice:"0.00"
    },
    onLoad:function(e){
      var that = this;

      var orderId = e.id;
      console.log("" + orderId)
      this.data.orderId = orderId;
      this.setData({
        orderId: orderId
      });
    },
    onShow : function () {


      orderDetail.getOrderDetail(this.data.orderId, (res) => {
        wx.hideLoading();
        console.log(res.status)
        if (res.status != 0) {
          wx.showModal({
            title: '错误',
            content: res.message,
            showCancel: false
          })
          return;
        }

        this.setData({
          orderDetail: res.data
        });
        console.log("this.data.orderDetail")
        console.log(this.data.orderDetail)

      })

      var yunPrice = parseFloat(this.data.yunPrice);
      var allprice = 0;
      var goodsList = this.data.goodsList;
      for (var i = 0; i < goodsList.length; i++) {
        allprice += parseFloat(goodsList[0].price) * goodsList[0].number;
      }
      this.setData({
        allGoodsPrice: allprice,
        yunPrice: yunPrice
      });
    },


    wuliuDetailsTap:function(e){
      var orderId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "/pages/wuliu/index?id=" + orderId
      })
    },
    confirmBtnTap:function(e){
      let that = this;
      let orderId = this.data.orderId;
      let formId = e.detail.formId;
      wx.showModal({
          title: '确认您已收到商品？',
          content: '',
          success: function(res) {
            if (res.confirm) {
              wx.showLoading();

              orderDetail.deliveryOrder(that.data.orderDetail.orderInfo.id, (res) => {
                wx.hideLoading();
                console.log(res.status)
                if (res.status != 0) {
                  wx.showModal({
                    title: '错误',
                    content: res.message,
                    showCancel: false
                  })
                  return;
                }

              
                that.onShow();
                // 模板消息，提醒用户进行评价
                let postJsonString = {};
                postJsonString.keyword1 = { value: that.data.orderDetail.orderInfo.orderNumber, color: '#173177' }
                let keywords2 = '您已确认收货，期待您的再次光临！';
                if (app.globalData.order_reputation_score) {
                  keywords2 += '立即好评，系统赠送您' + app.globalData.order_reputation_score + '积分奖励。';
                }
                postJsonString.keyword2 = { value: keywords2, color: '#173177' }
                app.sendTempleMsgImmediately('uJL7D8ZWZfO29Blfq34YbuKitusY6QXxJHMuhQm_lco', formId,
                  '/pages/order-details/index?id=' + orderId, JSON.stringify(postJsonString));
                
              })

            }
          }
      })
    },
    submitReputation: function (e) {
      let that = this;

      console.log("数据")
      console.log(e.detail)


      let formId = e.detail.formId;
      let postJsonString = {};
      //postJsonString.token = app.globalData.token;
       postJsonString.orderId =  this.data.orderId + "";
      let reputations = [];
      let i = 0;
      while (e.detail.value["orderGoodsId" + i]) {
        let orderGoodsId = e.detail.value["orderGoodsId" + i];
        let goodReputation = e.detail.value["goodReputation" + i];
        let goodReputationRemark = e.detail.value["goodReputationRemark" + i];

        let reputations_json = {};
        reputations_json.id = orderGoodsId;
        reputations_json.reputation = goodReputation;
        reputations_json.remark = goodReputationRemark;

        reputations.push(reputations_json);
        i++;
      }
      postJsonString.reputations = JSON.stringify(reputations);
      wx.showLoading();



      orderDetail.reputation(postJsonString, (res) => {
        wx.hideLoading();
        console.log(res.status)
        if (res.status != 0) {
          wx.showModal({
            title: '错误',
            content: res.message,
            showCancel: false
          })
          return;
        }

        wx.hideLoading();
    
        that.onShow();
        // 模板消息，通知用户已评价
        let postJsonString = {};
        postJsonString.keyword1 = { value: that.data.orderDetail.orderInfo.orderNumber, color: '#173177' }
        let keywords2 = '感谢您的评价，期待您的再次光临！';
        if (app.globalData.order_reputation_score) {
          keywords2 += app.globalData.order_reputation_score + '积分奖励已发放至您的账户。';
        }
        postJsonString.keyword2 = { value: keywords2, color: '#173177' }
        app.sendTempleMsgImmediately('uJL7D8ZWZfO29Blfq34YbuKitusY6QXxJHMuhQm_lco', formId,
          '/pages/order-details/index?id=' + that.data.orderId, JSON.stringify(postJsonString));
        

      })


      // wx.request({
      //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/reputation',
      //   data: {
      //     postJsonString: postJsonString
      //   },
      //   success: (res) => {
      //     wx.hideLoading();
      //     if (res.data.code == 0) {
      //       that.onShow();
      //       // 模板消息，通知用户已评价
      //       let postJsonString = {};
      //       postJsonString.keyword1 = { value: that.data.orderDetail.orderInfo.orderNumber, color: '#173177' }
      //       let keywords2 = '感谢您的评价，期待您的再次光临！';
      //       if (app.globalData.order_reputation_score) {
      //         keywords2 += app.globalData.order_reputation_score + '积分奖励已发放至您的账户。';
      //       }
      //       postJsonString.keyword2 = { value: keywords2, color: '#173177' }
      //       app.sendTempleMsgImmediately('uJL7D8ZWZfO29Blfq34YbuKitusY6QXxJHMuhQm_lco', formId,
      //         '/pages/order-details/index?id=' + that.data.orderId, JSON.stringify(postJsonString));
      //     }
      //   }
      // })
    }
})