// pages/product_info/product_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starsData: getApp().globalData.starsData,
    shop_id:'',
    shop_data:[]
  },
  return_page:function(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      mydata: {
        id: 1,
        b: 125
      }
    })
    wx.navigateBack({//返回
      delta: 1
    })
  },
  //去地图
  go_map(){

    wx.redirectTo({
      url: '../map/map?lat=' + this.data.shop_data.lat + '&lng=' + this.data.shop_data.lng,
    })
  },
  //拨打电话
  freeTell(){
    wx.makePhoneCall({
      phoneNumber: this.data.shop_data.mobile,
    })
  },
  //返回首页
  returnHome() {
    wx.reLaunch({
      // delta: 2
      url: '../index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '产品详情'
    })
    if (options.id) {
      this.setData({ shop_id: options.id});
      this.get_shop_info();
    }
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