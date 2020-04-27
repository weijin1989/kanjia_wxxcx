// pages/product_hot/product_hot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hot_list: [], 
    siteurl: '',
    shop_data:[],
    shop_data_index:'',
    hot_list_length: 0,
    page: 1,
    pageSize: getApp().globalData.pageSize,
    memberid: getApp().globalData.memberid,
    flag:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_hot_shop();

    wx.setNavigationBarTitle({
      title: '更多精品'
    })
    this.setData({
      memberid: wx.getStorageSync('memberid')
    })
  },
  //砍价
  bargain(e) {
    console.log(e);
    var that = this;
    this.setData({
      shop_data: e.currentTarget.dataset.obj,
      shop_data_index: e.currentTarget.dataset.index,
    })
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      data: {
        op: 'Bargain',
        memberid: wx.getStorageSync('memberid'),
        shopid: this.data.shop_data.shopid,
      },
      method: 'post',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.isSuccess === 'Y') {
          let title = '恭喜，砍了【' + res.data.data.bargain + '元】！';

          wx.showModal({
            title: '提示',
            showCancel:false,
            content: title,
            success(res) {
              if (res.confirm) {
                that.get_shop_info();
              } else if (res.cancel) {
                that.get_shop_info();
              }
            }
          })
          // wx.showToast({
          //   title: title, // 标题
          //   icon: 'none',  // 图标类型，默认success
          //   duration: 1500  // 提示窗停留时间，默认1500ms
          // })
          // that.get_shop_info();
        } else {
          wx.showToast({
            title: '砍价失败,或者您已经砍过价！', // 标题
            icon: 'none',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
        }
      }
    })
  },
  get_shop_info() {
    var that = this;
    var index = this.data.shop_data_index;
    var data = {
      op: 'GetShopInfo',
      shopid: this.data.shop_data.shopid,
      memberid: wx.getStorageSync('memberid')
    }
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      // url: getApp().globalData.ApiUrl + 'get_nav',
      data: data,
      method: 'POST',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.isSuccess === 'Y') {
          let list = [];
          let hot_list = that.data.hot_list;
          for (var i = 0; i < hot_list.length; i++) {
            if (i == index) {
              list.push(res.data.data[0]);
            } else {
              list.push(hot_list[i]);
            }
          }
          that.setData({
            hot_list: list
          })
        }
      }
    })
  },

  //产品详情
  toProductInfo(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product_info/product_info?id=' + id,
    })
  },
  
  //获取正在抢购商品
  get_hot_shop() {
    var that = this;
    var data = {
      op: 'GetHotShops',
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
          res.data.data.forEach((item) => {
            item.subject = item.subject.substring(0, 10); //要截取字段的字符串
          })
          that.setData({
            hot_list: res.data.data,
            hot_list_length:res.data.data.length,
            siteurl: res.data.siteurl
          });

          wx.hideLoading()
        }
      }
    })
  },
  //获取用户信息注册
  bindGetUserInfo(e) {
    let that = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      
      wx.login({
        success: res => {
          
          wx.request({
            url: getApp().globalData.ApiUrl + 'server.php',
            data: {
              'lng': getApp().globalData.longitude,
              'lat': getApp().globalData.latitude,
              'op': 'Register',
              'code': res.code,
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
                  user_info: res.data.data[0]
                });

                wx.showToast({
                  title: '登陆成功,请继续购买吧',
                  icon: 'none',
                  duration: 2000
                });
                
                wx.reLaunch({
                  url: '../product_hot/product_hot'
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
        title: '【小程序】需要获取你的信息，请确认授权',
        icon: 'none'
      })
    }
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
  //获取用户手机号码
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e.detail);
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: getApp().globalData.ApiUrl + 'server.php',
        data: {
          'op': 'GetMember',
          'lng': getApp().globalData.longitude,
          'lat': getApp().globalData.latitude,
          'code': getApp().globalData.code,
          'encryptedData': e.detail.encryptedData,
          'iv': e.detail.iv
        },
        method: 'post',
        header: getApp().globalData.request_header,
        success(res) {
          wx.setStorageSync('memberid', res.data.data[0].memberid)
          wx.setStorageSync('userInfo', res.data.data[0]);
          getApp().globalData.memberid = res.data.data[0].memberid;
          that.setData({
            memberid: res.data.data[0].memberid,
            page: 1
          })
          that.get_hot_shop();
          // wx.hideLoading()
        }
      })
    } else {
      wx.showToast({
        title: '拒绝授权',
        icon: 'none'
      })
    }

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // loading开始
    wx.showLoading({
      title: '玩命加载中',
    })
    // if (this.data.hot_list_length == this.data.pageSize) {
      var page = this.data.page + 1;
      this.setData({
        page: page
      })
    // }
    var data = {
      op: 'GetHotShops',
      page: this.data.page,
      memberid: wx.getStorageSync('memberid'),
    }
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      // url: getApp().globalData.ApiUrl + 'get_nav',
      data: data,
      method: 'POST',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.isSuccess === 'Y') {
          wx.hideLoading()
          if (res.data.data.length == 0) {
            wx.showToast({
              title: '已加载全部商品',
              icon: 'none',
              duration: 2000
            })
          }
          var moment_list = that.data.hot_list;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          that.setData({
            hot_list: moment_list,
            siteurl: res.data.siteurl
          });
          // console.log(that.data.siteurl);

          
        }
      }
    })
  },

  _error(){
    this.setData({
      flag:!this.data.flag
    })
      
    // wx.showTabBar()
  },
  go_share(e){    
    // wx.hideTabBar()
    this.setData({
      flag:!this.data.flag,
      this_shop_info:e.target.dataset.obj
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      this.setData({
        flag:!this.data.flag,
      })
      
      // wx.showTabBar()
      return {
        title: '原价' + res.target.dataset.obj.price + ',最低砍价至￥1！' + res.target.dataset.obj.subject,
        path: '/pages/product_info/product_info?id=' + res.target.dataset.obj.shopid,
        imageUrl:this.data.siteurl+res.target.dataset.obj.imgsrc
      }
    }else{
      return {
        title: '【萧一潇】一个价格你做主的小程序',
        path: '/pages/index/index'
      }
    }
  }
})