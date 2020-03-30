// pages/place_order/place_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_id: '',
    shop_data: [],
    orderNo:'',
    orderData: {
      name: '',
      mobile: '',
      address: ''
    }
  },

  //提交订单
  saveOrder: function (e) {
    var that = this;
    var name = e.detail.value.name;
    var mobile = e.detail.value.mobile;
    var address = e.detail.value.address;
    if (name==""){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (mobile == "") {
      wx.showToast({
        title: '请输入联系方式',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (address == "") {
      wx.showToast({
        title: '请输入地址',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var data = {
      op: 'addOrder',
      name: name,
      mobile: mobile,
      address: address,
      shopid: this.data.shop_id, 
      num: 1,
      memberid: wx.getStorageSync('memberid')
    }

    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      // url: getApp().globalData.ApiUrl + 'get_nav',
      data: data,
      method: 'POST',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.isSuccess === 'Y') {
          that.setData({
            orderNo: res.data.data.appflowno
          });
          that.pay();
        }
      }
    })
  },
  //支付
  pay(){

    var that = this;
    wx.showLoading({
      title: '提交中...',
    })
    var data = {
      op: 'CreatOrder',
      appflowno: this.data.orderNo,
      memberid: wx.getStorageSync('memberid')
    }
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      method: 'POST',
      data: data,
      header: getApp().globalData.request_header,
      success(res) {
        wx.hideLoading()
        if (res.data.isSuccess === 'Y') {
          console.log(
            {
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign}
            );
          //发起微信支付
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success(res) {
              console.log('success=' + res);
              wx.showToast({
                title: '支付成功！',
                icon: 'none',
                duration: 2000
              });
              // wx.redirectTo({
              //   url: '../paysuccess/paysuccess?orderId=' + that.data.orderNo
              // })
            },
            fail(res) {
              console.log(res);
              if (res.errMsg === 'requestPayment:fail cancel') {
                wx.showToast({
                  title: '用户取消支付',
                  icon: 'none',
                  duration: 2000
                });
              }
            }
          })
        } else {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '确认购买'
    })
    // if (options.id =='undefined') {
    //   wx.navigateBack({});
    //   return ;
    // }
    if (options.id) {
      this.setData({ shop_id: options.id });
      this.get_shop_info();
    }
  },
  return_product(){
    wx.redirectTo({
      url: '../product_info/product_info?id=' + this.data.shop_id,
    })
  },
  //获取商品详情
  get_shop_info: function () {
    var that = this;
    var data = {
      op: 'GetShopInfo',
      catid: this.data.shop_id
    }

    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      // url: getApp().globalData.ApiUrl + 'get_nav',
      data: data,
      method: 'POST',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.isSuccess === 'Y') {
          that.setData({
            shop_data: res.data.data[0]
          });
          wx.hideLoading()
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})