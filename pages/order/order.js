// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'order_type':0,//订单类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type){
      this.setData({
        order_type: options.type
      });
    }
    wx.setNavigationBarTitle({
      title: '订单列表'
    })
  },
  get_order_list(e){
    let type = e.currentTarget.dataset.type;
    console.log(type);
    this.setData({
      order_type: type
    });
  },
  go_order_info(e) {
    let order_id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '../order_info/order_info?order_id=' + order_id,
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