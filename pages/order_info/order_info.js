// pages/product_info/product_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_no: '',
    order_info:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderNo) {
      this.setData({
        order_no: options.orderNo
      });
      this.get_order_info();
    }
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
  },
  get_order_info() {
    let data = {
      op: "GetOrderInfo",
      memberid: wx.getStorageSync('memberid'),
      appflowno: this.data.order_no
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
            order_info: res.data.data[0]
          });

          wx.hideLoading()
        }
      }
    })
  },
  //去地图
  go_map() {
    // console.log('../map/map?lat=' + this.data.order_info.lat + '&lng=' + this.data.order_info.lng);
    wx.navigateTo({
      url: '../map/map?lat=' + this.data.order_info.lat + '&lng=' + this.data.order_info.lng,
    })
  },
  //拨打电话
  freeTell() {
    wx.makePhoneCall({
      phoneNumber: this.data.order_info.mobile,
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
        path: '/pages/product_info/product_info?id=' + res.target.dataset.obj.shopid
      }
    }
    return {
      title: '【萧一萧】一个价格你做主的小程序',
      path: '/pages/index/index'
    }
  }
})