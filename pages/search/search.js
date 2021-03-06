//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    nav_list: [],
    type_id: '',
    cp_list: [],
    cp_list_length:0,
    siteurl:'',
    page: 1,
    pageSize: getApp().globalData.pageSize,
    keyword:'',
    shop_data_index:'',
    shop_data:[],
    memberid: getApp().globalData.memberid,
    flag:true,
  },
  //获取搜索框的值
  changeCon(e) {
    var val = e.detail.value;
    this.setData({
      'keyword': val,
      'page':1
    })
    this.getShops();
  },
  onLoad: function (options) {
    if(options.val){
      this.setData({
        'keyword': options.val,
        'page':1
      })
      this.getShops();
    }
    let that=this;
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
    that.setData({
      memberid: wx.getStorageSync('memberid')
    })
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
              user_info: res.data.data[0]
            });

            wx.showToast({
              title: '登陆成功，去购买吧',
              icon: 'none',
              duration: 2000
            });
            
            // setTimeout(function() {
              wx.redirectTo({
                url: '../search/search?val='+that.data.keyword
              });
            // },1000)
            // that.get_shop_info(2);
            // that.comment_list();
            
            // if(res.data.data[0].mobile==''){
            //   that.setData({
            //     is_showModal_tel: true
            //   });
            // }
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
  getShops(){
    let that=this
    let data={
      keyword: this.data.keyword,
      op: 'SearchShops',
      memberid: wx.getStorageSync('memberid')
    }
    wx.showLoading({
      title: '搜索中...',
    })
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      // url: getApp().globalData.ApiUrl + 'get_nav',
      data: data,
      method: 'POST',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.isSuccess === 'Y') {
          that.setData({
            cp_list: res.data.data,
            siteurl: res.data.siteurl,
            cp_list_length: res.data.data.length
          });

          wx.hideLoading()
          if (res.data.data.length == 0 ){
            wx.showToast({
              title: '没有商品',
              icon: 'none',
              duration: 2000
            });
          }
        }
      },fail(res){
        wx.hideLoading()
      }
    })
  },

  //砍价
  bargain(e) {
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
            content: title,
            showCancel:false,
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
          let cp_list = that.data.cp_list;
          for (var i = 0; i < cp_list.length; i++) {
            if (i == index) {
              list.push(res.data.data[0]);
            } else {
              list.push(cp_list[i]);
            }
          }
          that.setData({
            cp_list: list
          })
        }
      }
    })
  },
  //产品详情
  toProductInfo(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product_info/product_info?id=' + id,
    })
  },
  onShow: function () {
    // app.editTabBar();    //显示自定义的底部导
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
    if (this.data.cp_list_length == this.data.pageSize) {
      var page = this.data.page + 1;
      this.setData({
        page: page
      })
    }
    var data = {
      keyword: this.data.keyword,
      op: 'SearchShops',
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
          var moment_list = that.data.cp_list;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          that.setData({
            cp_list: moment_list,
            siteurl: res.data.siteurl
          });
          // console.log(that.data.siteurl);
        }
      }
    })
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
            page:1
          })
          that.getShops();
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
