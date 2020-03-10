//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '哈哈哈哈',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //获取用户手机号码
  getPhoneNumber: function (e){

    var that = this;
    wx.request({
      url: this.globalData.ApiUrl + 'login',
      data: {
        'code': code,
        'encryptedData': encryptedData,
        'iv': iv
      },
      method: 'post',
      header: this.globalData.request_header,
      success(res) {
        wx.hideLoading()
      }
    })
  },
  //跳转新闻列表页
  toNews:function(){
    wx.navigateTo({
      url: '../news/news',
    })
  },
  //跳转地图demo
  toMap: function () {
    wx.navigateTo({
      url: '../map/map',
    })
  },
  //跳转图片滚动demo
  toSwiper: function () {
    wx.navigateTo({
      url: '../swiper/swiper',
    })
  },
  //跳转进度条demo
  toProgress: function () {
    wx.navigateTo({
      url: '../progress/progress',
    })
  }, 
  //跳转表单demo
  toFrom: function() {
    wx.navigateTo({
      url: '../from/from',
    })
  }, 
  //跳转相机demo
  toCamera: function() {
    wx.navigateTo({
      url: '../camera/camera',
    })
  },
  //跳转相机demo
  toAudio: function () {
    wx.navigateTo({
      url: '../audio/audio',
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
