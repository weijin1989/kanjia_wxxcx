// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'order_type': 0,//订单类型
    'order_list': [],
    'order_list_length': 0,
    'orderNo':'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type) {
      this.setData({
        order_type: options.type
      });
    }
    wx.setNavigationBarTitle({
      title: '订单列表'
    })
    this.get_order_list();
  },
  //支付
  pay(e){
    let appflowno = e.currentTarget.dataset.order_no;
    var that = this;
    this.setData({
      orderNo: appflowno
    });
    wx.showLoading({
      title: '提交中...',
    })
    var data = {
      op: 'CreatOrder',
      appflowno: appflowno,
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
              paySign: res.data.data.paySign
            }
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
              wx.redirectTo({
                url: '../paysuccess/paysuccess?orderNo=' + that.data.orderNo
              })
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
  //获取订单列表
  get_order_list() {
    let data = {
      op: "GetOrder",
      memberid: wx.getStorageSync('memberid'),
      status:this.data.order_type
    };
    wx.showLoading({
      title: '加载中...',
    })
    let that = this;
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      // url: getApp().globalData.ApiUrl + 'get_nav',
      data: data,
      method: 'POST',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.isSuccess === 'Y') {
          that.setData({
            order_list: res.data.data,
            order_list_length: res.data.data.length > 0 ? true : false
          });

          wx.hideLoading()
        }
      }
    })
  },
  //
  chang_order_type(e){
    let type = e.currentTarget.dataset.type;
    this.setData({
      order_type: type
    });
    this.get_order_list();
  },
  go_order_info(e) {
    let order_no = e.currentTarget.dataset.order_no;
    wx.navigateTo({
      url: '../order_info/order_info?orderNo=' + order_no,
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

    if (res.from === 'button') {
      return {
        title: '原价' + res.target.dataset.obj.price + ',最低砍价至￥1！' + res.target.dataset.obj.subject,
        path: '/pages/produdct_info/product_info?id=' + res.target.dataset.obj.shop_id
      }
    }
    return {
      title: '【萧一萧】一个价格你做主的小程序',
      path: '/pages/index/index'
    }
  }
})