// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: wx.getStorageSync('userInfo'),
    is_showModal: 0,
    is_showModal_tel:0,
    code:'',
    is_showContact: 0,
    is_showCustomer: 0,
    contact_tel: getApp().globalData.contact_tel,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.bindCode();

    that.setData({
      user_info: wx.getStorageSync('userInfo')
    })
    that.setData({
      memberid: wx.getStorageSync('memberid')
    })
    wx.login({
      success: res => {
        that.setData({
          code: res.code
        });
      },
      fail: res => {
        console.log(res);
      }
    })
    
  },
  go_login(){ 
    wx.showToast({
      title: '请点击注册登陆',
      icon: 'none',
      duration: 2000
    });
  },
  //获取用户信息注册
  bindGetUserInfo(e) {
    let that = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.request({
        url: getApp().globalData.ApiUrl + 'server.php',
        data: {
          'lng': getApp().globalData.longitude,
          'lat': getApp().globalData.latitude,
          'op': 'Register',
          'code': that.data.code,
          'encryptedData': e.detail.encryptedData,
          'iv': e.detail.iv
        },
        method: 'post',
        header: getApp().globalData.request_header,
        success(res) {
          if (res.data.isSuccess === 'Y') {
            // wx.hideLoading()
            
            wx.setStorageSync('memberid', parseInt(res.data.data[0].memberid))
            // wx.setStorageSync('session_key', res.data.sessionKey)
            wx.setStorageSync('userInfo', res.data.data[0]);

            that.setData({
              is_showModal: 0,
              memberid:res.data.data[0].memberid,
              user_info: res.data.data[0]
            });

            wx.showToast({
              title: '登陆成功',
              icon: 'none',
              duration: 2000
            });
            if(res.data.data[0].mobile==''){
              
              // wx.hideTabBar()
              that.setData({
                is_showModal_tel: true
              });
            }
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
  go_setup() {
    wx.navigateTo({
      url: '../set_up/set_up',
    })
  },
  go_contact(){

    wx.navigateTo({
      url: '../h5/h5?type=' + 3
    });
    // wx.navigateTo({
    //   url: '../contact/contact',
    //   })
  },
  go_customer() {

    wx.makePhoneCall({
      phoneNumber: this.data.contact_tel,
    })
    // this.setData({
    //   is_showCustomer: 1
    // })
  },
  colseDlg(e){
    let type = e.currentTarget.dataset.type;
    console.log(type);
    if(type==1){
      this.setData({
        is_showContact: 0
      })
    }else if(type==2){
      this.setData({
        is_showCustomer: 0
      })
    }
  },
  //获取用户手机号码
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e.detail);
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: res => {              
          wx.request({
            url: getApp().globalData.ApiUrl + 'server.php',
            data: {
              'op': 'GetMember',
              'lng': getApp().globalData.longitude,
              'lat': getApp().globalData.latitude,
              'code': res.code,
              'encryptedData': e.detail.encryptedData,
              'iv': e.detail.iv
            },
            method: 'post',
            header: getApp().globalData.request_header,
            success(res) {
              
              if (res.data.isSuccess === 'Y') {
                wx.setStorageSync('memberid', parseInt(res.data.data[0].memberid))
                // wx.setStorageSync('session_key', res.data.sessionKey)
                wx.setStorageSync('userInfo', res.data.data[0]);

                that.setData({
                  is_showModal_tel: 0,
                  user_info: res.data.data[0]
                });
              }
              
            }
          })
        },
        fail: res => {
          console.log(res);
        }
      })
    } else {
      wx.showToast({
        title: '拒绝授权',
        icon: 'none'
      })
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

    if (res.from === 'button') {
      return {
        title: '原价' + res.target.dataset.obj.price + ',最低砍价至￥1！' + res.target.dataset.obj.subject,
        path: '/pages/product_info/product_info?id=' + res.target.dataset.obj.shopid
      }
    }
    return {
      title: '【萧一潇】一个价格你做主的小程序',
      path: '/pages/index/index'
    }
  }
})