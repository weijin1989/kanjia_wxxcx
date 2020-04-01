// pages/panic_buying/panic_buying.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nav_list: [],
    type_id: 1,
    siteurl: '',
    x: '',
    starsData: getApp().globalData.starsData,
  },
  search() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  //产品详情
  toProductInfo: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product_info/product_info?id=' + id,
    })
  },

  //内组件调用外部方法
  get_cate_shop_event: function (e) {
    var type_id = e.detail.type_id;
    this.setData({
      type_id: type_id
    });
    this.get_cate_shop();
  },
  //附近美食
  get_cate_shop: function () {
    var that = this;
    var data = {
      op: 'GetCateShops',
      catid: this.data.type_id,
      memberid: wx.getStorageSync('memberid')
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
          let list=[];
          for (let i = 0; i < res.data.data.length; i++) {
              list[i] = res.data.data[i];
              res.data.data[i]['subject'] = res.data.data[i]['subject'].substring(0, 6); //要截取字段的字符串
          }
          that.setData({
            cp_list: res.data.data,
            siteurl: res.data.siteurl
          });

          wx.hideLoading()
        }
      }
    })
  },
  //获取搜索框的值
  changeCon(e) {
    var val = e.detail.value;
    this.setData({
      'searchParams.keyword': val
    })
    console.log(val);
    // this.getSizeListFn(this.data.searchParams);
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: '附近'
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