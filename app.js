App({
  //本地
  wxData: {
    appid: 'wx26737d0554e086be',//appid
    secret: '1a3598ca49cdef0024cc023ac025c95d',//secret
  }, 
  //线上
  // wxData: {
  //   appid: 'wx48535d0e96200915', //appid
  //   secret: '0974736e7aaf5bae633e796b80a5c984', //secret
  // },
  globalData: {
    userInfo: null,
    wxuserInfo: null,
    ApiUrl: 'https://weijin.lnhoo.com/api/',
    packageName: 'wxxcx.maska',
    request_header: {
      'content-type': 'application/json', // 默认值
      'packageName': 'wxxcx.maska',
      'accessToken': wx.getStorageSync('accessToken')
    },
    code: '',

  },
  getToken: function (code, encryptedData,iv) {
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
        if (res.data.code === 0) {
          wx.setStorageSync('member_token', res.data.data.member_token)
          wx.setStorageSync('session_key', res.data.data.session_key)
        }
      }
    })
  },
  wxLogin() {
    var that = this
    if (!wx.getStorageSync('member_token')) {
      wx.showLoading({
        title: '登陆中',
      })
      // 登录
      wx.login({
        success: res => {
          console.log(res);
          this.globalData.code = res.code; //返回code
          this.wxUserInfos();
        }
      })
    }
  },
  wxUserInfos(){
    wx.getUserInfo({
      success: res => {
        // console.log(res)
        this.getToken(this.globalData.code, res.encryptedData,res.iv);
      }
    })
  },
  onLaunch: function () {
    this.wxLogin();
  }
});

