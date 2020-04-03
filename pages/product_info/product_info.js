// pages/product_info/product_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starsData: getApp().globalData.starsData,
    shop_id:'',
    userInfo: wx.getStorageSync('userInfo'),
    shop_data:[],
    siteurl: '',
    memberid: getApp().globalData.memberid,
    but_type:0,  //1下单，2砍价
  },
  //去下单页面
  go_place_order(){
    let that=this;
    if(this.data.but_type==1){
      wx.redirectTo({
        url: '../place_order/place_order?id=' + this.data.shop_id,
      })
    }

    if (this.data.but_type == 2) {//砍价
      wx.request({
        url: getApp().globalData.ApiUrl + 'server.php',
        data: {
          op: 'Bargain',
          memberid: wx.getStorageSync('memberid'),
          shopid: this.data.shop_id,
        },
        method: 'post',
        header: getApp().globalData.request_header,
        success(res) {
          if (res.data.isSuccess === 'Y') {
            let title = '恭喜，砍了【' + res.data.data.bargain + '元】！';
            wx.showToast({
              title: title, // 标题
              icon: 'none',  // 图标类型，默认success
              duration: 1500  // 提示窗停留时间，默认1500ms
            })
            that.get_shop_info(0);
          } else {
            wx.showToast({
              title: '砍价失败,或者您已经砍过价！', // 标题
              icon: 'none',  // 图标类型，默认success
              duration: 1500  // 提示窗停留时间，默认1500ms
            })
          }
        }
      })
    }
  },
  //下单
  place_order(e){
    this.setData({
      but_type: e.currentTarget.dataset.type
    });
    this.go_place_order();
  },
  //获取用户手机号码
  getPhoneNumber: function (e) {
    var that = this;
    this.setData({
      but_type: e.currentTarget.dataset.type
    });
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: getApp().globalData.ApiUrl + 'server.php',
        data: {
          lng: getApp().globalData.longitude,
          lat: getApp().globalData.latitude,
          op: 'GetMember',
          code: getApp().globalData.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        method: 'post',
        header: getApp().globalData.request_header,
        success(res) {
          if (res.data.isSuccess === 'Y') {
            wx.setStorageSync('memberid', res.data.data[0].memberid)
            wx.setStorageSync('userInfo', res.data.data[0]);
            that.setData({
              memberid: res.data.data[0].memberid
            })
            that.get_shop_info(3);
          }
        }
      })
    } else {
      // wx.showToast({
      //   title: '【小程序】需要获取你的信息，请确认授权',
      //   icon: 'none'
      // })
    }

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
    // if (options.id =='undefined') {
    //   wx.navigateBack({});
    //   return ;
    // }
    if (options.id) {
      this.setData({ shop_id: options.id});
      this.get_shop_info(1);
    }
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
  //获取商品详情
  get_shop_info: function (is_loading) {
    var that = this;
    var data = {
      op: 'GetShopInfo',
      shopid: this.data.shop_id,
      memberid: wx.getStorageSync('memberid')
    }
    if (is_loading == 1 || is_loading == 3){
      wx.showLoading({
        title: '加载中...',
      })
    }
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      // url: getApp().globalData.ApiUrl + 'get_nav',
      data: data,
      method: 'POST',
      header: getApp().globalData.request_header,
      success(res) {
        if (is_loading == 1) {
          wx.hideLoading()
        }
        if (res.data.isSuccess === 'Y') {
          that.setData({
            shop_data: res.data.data[0],
            siteurl: res.data.siteurl
          });
          if (is_loading == 3) {
            wx.showToast({
              title: '登陆成功,请立即购买吧',
              icon: 'none',
              duration: 2000
            });
          }
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
  onShareAppMessage: function (res) {

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