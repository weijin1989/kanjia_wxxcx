// pages/panic_buying/panic_buying.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nav_list: [],
    type_id: 1,
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

  //附近美食
  get_cate_shop: function () {
    var that = this;
    var data = {
      op: 'GetCateShops',
      catid: this.data.type_id
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
            cp_list: res.data.data
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

  get_nav: function () {

    var that = this;

    var data = {
      op: 'GetCategory',
      type: 'shops'
    }
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      // url: getApp().globalData.ApiUrl + 'get_nav',
      data: data,
      method: 'POST',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.isSuccess === 'Y') {
          // that.setData({
          //   nav_list: res.data.data
          // });
          
          for (let i = 0; i < res.data.data.length; i++) {
            if (i == 0) {
              that.setData({
                nav_list: res.data.data,
                type_id: res.data.data[i]['catid']
              });
              that.get_cate_shop();

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
    this.get_cate_shop();
    this.triggerEvent("switchTap", type); //点击了导航,通知父组件重新渲染列表数据
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_nav();

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