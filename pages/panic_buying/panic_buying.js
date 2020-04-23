// pages/panic_buying/panic_buying.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nav_list: [],
    cp_list: [],
    cp_list_length: 0,
    type_id: 1,
    siteurl: '',
    is_showModal: 0,
    is_showModal_tel:0,
    x: '',
    page: 1,
    pageSize: getApp().globalData.pageSize,
    starsData: getApp().globalData.starsData,
    memberid: getApp().globalData.memberid,
    shop_data:[],
    shop_data_index:'',
    flag:true,
  },
  search() {
    wx.navigateTo({
      url: '../search/search'
    })
  },//砍价
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
  toProductInfo: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product_info/product_info?id=' + id,
    })
  },

  //内组件调用外部方法
  get_cate_shop_event: function (e) {
    var type_id = e.detail.type_id;
    this.setData({
      type_id: type_id,
      page:1,
    });
    this.get_cate_shop();
  },
  //附近美食
  get_cate_shop: function () {
    var that = this;
    var data = {
      op: 'GetCateShops',
      catid: this.data.type_id,
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
          let list=[];
          // for (let i = 0; i < res.data.data.length; i++) {
          //     list[i] = res.data.data[i];
          //     res.data.data[i]['subject'] = res.data.data[i]['subject'].substring(0, 15); //要截取字段的字符串
          // }
          that.setData({
            cp_list: res.data.data,
            cp_list_length: res.data.data.length,
            siteurl: res.data.siteurl
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
              title: '登陆成功,请继续购买吧',
              icon: 'none',
              duration: 2000
            });
            
            wx.reLaunch({
              url: '../panic_buying/panic_buying'
            });
            // that.get_cate_shop();
            // if(res.data.data[0].mobile==''){
              
            //   // wx.hideTabBar()
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that=this;
    wx.setNavigationBarTitle({
      title: '附近'
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
    
    // setTimeout(function() {
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
    //   if (wx.getStorageSync('memberid') == 0) {
    //     // wx.hideTabBar()
    //     that.setData({
    //       is_showModal: true
    //     })

    //     wx.login({
    //       success: res => {
    //         that.setData({
    //           code: res.code
    //         });
    //       },
    //       fail: res => {
    //         console.log(res);
    //       }
    //     })
    //   }
    //   if(wx.getStorageSync('userInfo').mobile == "") {
    //     // wx.hideTabBar()
    //     that.setData({
    //       is_showModal_tel: true
    //     })
    //   }
    // }, 1500);
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
    var that = this;
    // loading开始
    wx.showLoading({
      title: '玩命加载中',
    })
    // if (this.data.cp_list_length == this.data.pageSize) {
      var page = this.data.page + 1;
      this.setData({
        page: page
      })
    // }
    var data = {
      op: 'GetCateShops',
      catid: this.data.type_id,
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
        wx.hideLoading()
        if (res.data.isSuccess === 'Y') {
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


  _error(){
    this.setData({
      flag:!this.data.flag
    })
      
    wx.showTabBar()
  },
  go_share(e){    
    wx.hideTabBar()
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
      
      wx.showTabBar()
      return {
        title: '原价' + res.target.dataset.obj.price + ',最低砍价至￥1！' + res.target.dataset.obj.subject,
        path: '/pages/product_info/product_info?id=' + res.target.dataset.obj.shopid
      }
    }else{
      return {
        title: '【萧一潇】一个价格你做主的小程序',
        path: '/pages/index/index'
      }
    }
  }
})