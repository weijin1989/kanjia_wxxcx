// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_showModal: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查看是否授权
    var that=this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          that.bindGetUserInfo();
        }
      }
    })
  },
  bindGetUserInfo(){
    let that = this;
    wx.login({
      success: res => {
        that.setData({
          code: res.code
        });
        // this.globalData.code = res.code; //返回code
        // this.wxUserInfos();
      }
    })
  },

  //获取用户手机号码
  getPhoneNumber: function (e) {
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: getApp().globalData.ApiUrl + 'server.php',
        data: {
          'lng': getApp().globalData.longitude,
          'lat': getApp().globalData.latitude,
          'op': 'UpdateMemberMobile',
          'code': that.data.code,
          'encryptedData': e.detail.encryptedData,
          'iv': e.detail.iv
        },
        method: 'post',
        header: getApp().globalData.request_header,
        success(res) {
          // wx.hideLoading()
        }
      })
    } else {
      wx.showToast({
        title: '【小程序】需要获取你的信息，请确认授权',
        icon: 'none'
      })

      // wx.navigateTo({
      //   url: '../index/index',
      // })
      // wx.navigateTo({
      //   url:'../index/index'
      // });
    }

  },
  wxUserInfos(){
    wx.getUserInfo({
      success: res => {
        console.log(res)
        this.getToken(this.data.code, res.encryptedData, res.iv);
      }
    })
  },
  getToken: function (code, encryptedData, iv) {
    wx.showLoading({
      title: '登陆中',
    })
    var that = this;
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      data: {
        'op': 'GetMember',
        'lng': getApp().globalData.longitude,
        'lat': getApp().globalData.latitude,
        'code': code,
        'encryptedData': encryptedData,
        'iv': iv
      },
      method: 'post',
      header: getApp().globalData.request_header,
      success(res) {
        // wx.hideLoading()
        if (res.data.isSuccess === 'Y') {
          wx.hideLoading()
          wx.setStorageSync('memberid', res.data.data[0].memberid)
          wx.setStorageSync('session_key', res.data.sessionKey)
          wx.setStorageSync('userInfo', res.data.data[0]);
          if (res.data.data[0].mobile){
            wx.navigateBack();
          }else{
            
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
  onShareAppMessage: function () {

  }
})