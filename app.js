App({
  //本地
  // wxData: {
  //   appid: 'wx26737d0554e086be',//appid
  //   secret: '1a3598ca49cdef0024cc023ac025c95d',//secret
  // }, 
  //线上
  wxData: {
    appid: 'wx4881be38ac184791', //appid
    secret: '3a003829adf77d3a6ef45e9482bedaad', //secret
  },
  globalData: {
    userInfo: null,
    wxuserInfo: null,
    memberid: 0,
    contact_tel:"15801129866",
    longitude: '',
    latitude: '',
    pageSize:5,
    starsData: [1, 2, 3, 4, 5],
    ApiUrl: 'https://www.hunanfuture.com/',
    // ApiUrl: 'http://merchant.lnhoo.com/',
    packageName: 'wxxcx.maska',
    request_header: {
      'content-type': 'application/x-www-form-urlencoded', // 默认值
      // 'packageName': 'wxxcx.maska',
      // 'accessToken': wx.getStorageSync('accessToken')
    },
    code: '',
    tabBar:[],

  },
  //获取code
  get_code(){
    var that = this;
    wx.login({
      success: res => {
        that.globalData.code = res.code;
      },fail:res=>{
        console.log(res);
      }
    })
  },
  onLaunch: function () {
    this.get_location();
    this.get_code();
    let memberid=0;
    if (wx.getStorageSync('memberid')){
      memberid = wx.getStorageSync('memberid');
    }else{
      wx.setStorageSync('memberid',0);
    }
    this.globalData.memberid = memberid
    // console.log('app_member',this.globalData.memberid);
  },
  wxLogin() {
    var that = this;
    // if (!wx.getStorageSync('memberid') || wx.getStorageSync('memberid') == '' || wx.getStorageSync('memberid') == null) {
      // wx.showLoading({
      //   title: '登陆中',
      // })
      wx.request({
        url: this.globalData.ApiUrl + 'server.php',
        data: {
          'lng': this.globalData.longitude,
          'lat': this.globalData.latitude,
          'op': 'GetMember',
          'code': this.globalData.code
        },
        method: 'post',
        header: this.globalData.request_header,
        success(res) {
          if (res.data.isSuccess === 'Y') {
            console.log('登录成功');
            
            wx.setStorageSync('memberid', res.data.data[0].memberid);
            // wx.setStorageSync('session_key', res.data.sessionKey)
            wx.setStorageSync('userInfo', res.data.data[0]);
          }
        }
      })
  },
  //获取地址 权限
  get_location() {
    var that = this;
    wx.getSetting({
      success: (res) => {
        // 拒绝授权后再次进入重新授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '',
            content: '【小程序】需要获取你的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none'
                })
                setTimeout(() => {
                  wx.navigateBack()
                }, 1500)
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    // console.log('dataAu:success', dataAu)
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      //再次授权，调用wx.getLocation的API
                      that.getloca(dataAu)
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none'
                      })
                      setTimeout(() => {
                        wx.navigateBack()
                      }, 1500)
                    }
                  }
                })
              }
            }
          })
        }
        // 初始化进入，未授权
        else if (res.authSetting['scope.userLocation'] == undefined) {
          // console.log('authSetting:status:初始化进入，未授权', res.authSetting['scope.userLocation'])
          //调用wx.getLocation的API
          that.getloca(res)
        }
        // 已授权
        else if (res.authSetting['scope.userLocation']) {
          // console.log('authSetting:status:已授权', res.authSetting['scope.userLocation'])
          //调用wx.getLocation的API
          that.getloca(res)
        }
      }
    })

    // that.getloca();
    // wx.getSetting({
    //   success(res) {
    //     //这里判断是否有地位权限
    //     if (!res.authSetting['scope.userLocation']) {
    //       wx.showModal({
    //         title: '提示',
    //         content: '请求获取位置权限',
    //         success: function (res) {
    //           if (res.confirm == false) {
    //             return false;
    //           }
    //           wx.openSetting({
    //             success(res) {
    //               //如果再次拒绝则返回页面并提示
    //               if (!res.authSetting['scope.userLocation']) {
    //                 wx.showToast({
    //                   title: '此功能需获取位置信息，请重新设置',
    //                   duration: 3000,
    //                   icon: 'none'
    //                 })
    //               } else {
    //                 //允许授权
    //                 that.getloca()
    //               }
    //             }
    //           })
    //         }
    //       })
    //     } else {
    //       //如果有定位权限
    //       that.getloca()
    //     }

    //   }

    // })
  },
  getloca() {
    let that=this;
    //获取经纬度
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        const latitude = res.latitude // 纬度
        const longitude = res.longitude // 经度
        that.globalData.latitude = latitude;
        that.globalData.longitude = longitude;
        that.wxLogin()
        // console.log('longitude=' + longitude);
        // console.log('latitude=' + latitude);
      }, fail: function (res) {
        if (res.errMsg === 'getLocation:fail:auth denied') {
          wx.showToast({
            title: '拒绝授权',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
          return
        }
        if (!userLocation || !userLocation.authSetting['scope.userLocation']) {
          that.getloca()
        } else if (userLocation.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '',
            content: '请在系统设置中打开定位服务',
            showCancel: false,
            success: result => {
              if (result.confirm) {
                wx.navigateBack()
              }
            }
          })
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }
    })

  },
});

