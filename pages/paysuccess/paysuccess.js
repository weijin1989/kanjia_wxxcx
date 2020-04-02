// pages/paysuccess/paysuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderNo) {
      this.setData({
        orderNo: options.orderNo
      });
    }

    wx.setNavigationBarTitle({
      title: '支付成功'
    })
  },
  go_order_info(){
    wx.redirectTo({
      url: '../order_info/order_info?orderNo=' + this.data.orderNo
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