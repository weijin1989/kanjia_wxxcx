// pages/panic_buying/panic_buying.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nav_list: [
      { brand_id: 1, brand_name: '爆款推荐' },
      { brand_id: 2, brand_name: '火锅串串' },
      { brand_id: 3, brand_name: '中餐/西餐' },
      { brand_id: 4, brand_name: '烧烤龙虾' },
      { brand_id: 5, brand_name: '小吃' },
      { brand_id: 6, brand_name: '麻辣烫' },
    ],
    type_id: 1,
    x: '',
    starsData: getApp().globalData.starsData,
  },
  //产品详情
  toProductInfo: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product_info/product_info?id=' + id,
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

  get_nav: function () {

    var that = this;
    wx.request({
      url: getApp().globalData.ApiUrl + 'get_nav',
      data: {},
      method: 'post',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.code === 0) {
          // that.setData({
          //   nav_list: res.data.data
          // });
          for (let i = 0; i < res.data.data.length; i++) {
            if (i == 0) {
              that.setData({
                nav_list: res.data.data,
                type_id: res.data.data[i]['brand_id']
              });

            }
          }
        }
      }
    })
  },

  switchTap(e) { //更换资讯大类
    let screenWidth = wx.getSystemInfoSync().windowWidth;
    let itemWidth = screenWidth / 5;
    let { index, type } = e.currentTarget.dataset;
    const { nav_list } = this.data;
    let scrollX = itemWidth * index - itemWidth * 2;
    let maxScrollX = (nav_list.length + 1) * itemWidth;
    if (scrollX < 0) {
      scrollX = 0;
    } else if (scrollX >= maxScrollX) {
      scrollX = maxScrollX;
    }
    this.setData({
      x: scrollX,
      type_id: type
    })
    this.triggerEvent("switchTap", type); //点击了导航,通知父组件重新渲染列表数据
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.get_nav();

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