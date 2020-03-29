// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: wx.getStorageSync('userInfo'),
    is_showModal: 0,
    code:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          that.bindCode();
        }
      }
    })
    // console.log('memberid='+wx.getStorageSync('memberid'));
    if (!wx.getStorageSync('memberid') || wx.getStorageSync('memberid') == '' || wx.getStorageSync('memberid') == null) {
      // wx.navigateTo({
      //   url: '../login/login',
      // })
      this.setData({
        is_showModal: 1
      });
    }else{
      this.setData({
        user_info: wx.getStorageSync('userInfo')
      });
    }
  },//获取用户手机号码
  getPhoneNumber: function (e) {
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: getApp().globalData.ApiUrl + 'server.php',
        data: {
          'lng': getApp().globalData.longitude,
          'lat': getApp().globalData.latitude,
          'op': 'GetMember',
          'code': that.data.code,
          'encryptedData': e.detail.encryptedData,
          'iv': e.detail.iv
        },
        method: 'post',
        header: getApp().globalData.request_header,
        success(res) {
          if (res.data.isSuccess === 'Y') {
            wx.hideLoading()
            wx.setStorageSync('memberid', res.data.data[0].memberid)
            // wx.setStorageSync('session_key', res.data.sessionKey)
            wx.setStorageSync('userInfo', res.data.data[0]);
            
            that.setData({
              is_showModal: 0,
              user_info: res.data.data[0]
            });

            wx.showToast({
              title: '登陆成功',
              icon: 'none',
              duration: 2000
            });
          }
          // wx.showLoading({
          //   title: '登陆成功',
          // })
          // wx.hideLoading()
          // wx.hideLoading()
        }
      })
    } else {
      wx.showToast({
        title: '【小程序】需要获取你的信息，请确认授权',
        icon: 'none'
      })
      // wx.navigateBack()
      // wx.navigateTo({
      //   url: '../index/index',
      // })
      // wx.navigateTo({
      //   url:'../index/index'
      // });
    }

  },
  bindCode() {
    let that = this;
    wx.login({
      success: res => {
        that.setData({
          code: res.code
        });
      }
    })
  },
  //去订单
  go_order:function(e){
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../order/order?type=' + type,
    })
  },
  go_order_info(e){
    let order_id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '../order_info/order_info?order_id=' + order_id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    wx.setNavigationBarTitle({
      title: '个人中心'
    })
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