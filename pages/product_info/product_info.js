// pages/product_info/product_info.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starsData: getApp().globalData.starsData,
    shop_id: '',
    userInfo: wx.getStorageSync('userInfo'),
    shop_data: [],
    siteurl: '',
    starsData: getApp().globalData.starsData,
    comments_list: [],
    comments_list_length: 0,
    memberid: getApp().globalData.memberid,
    but_type: 0, //1下单，2砍价
    listcount:0,
    page: 1,
    code:'',
    flag:true,
    pageSize: getApp().globalData.pageSize,
  },
  //去下单页面
  go_place_order() {
    let that = this;
    if (this.data.but_type == 1) {
      wx.redirectTo({
        url: '../place_order/place_order?id=' + this.data.shop_id,
      })
    }

    if (this.data.but_type == 2) { //砍价
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

            wx.showModal({
              title: '提示',
              content: title,
              showCancel:false,
              success(res) {
                if (res.confirm) {
                  that.get_shop_info(0);
                } else if (res.cancel) {
                  that.get_shop_info(0);
                }
              }
            })
          } else {
            wx.showToast({
              title: '砍价失败,或者您已经砍过价！', // 标题
              icon: 'none', // 图标类型，默认success
              duration: 1500 // 提示窗停留时间，默认1500ms
            })
          }
        }
      })
    }
  },
  //下单
  place_order(e) {
    this.setData({
      but_type: e.currentTarget.dataset.type
    });
    this.go_place_order();
  },
  //下单并支付
  saveOrder(e){
    var formId = e.detail.formId;
    var data = {
      op: 'addOrder',
      shopid: this.data.shop_id, 
      num: 1,
      // formId:formId,
      memberid: wx.getStorageSync('memberid')
    }
    let that=this;
    this.setData({
      disabled:true
    });

    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      // url: getApp().globalData.ApiUrl + 'get_nav',
      data: data,
      method: 'POST',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.isSuccess === 'Y') {
          that.setData({
            orderNo: res.data.data.appflowno
          });
          that.pay();
        }else{
          wx.showToast({
            title: '购买失败请咨询客服',
            icon: 'none',
            duration: 3000
          });
        }
      }
    })
  },
  //支付
  pay(){

    var that = this;
    wx.showLoading({
      title: '提交中...',
    })
    var data = {
      op: 'CreatOrder',
      appflowno: this.data.orderNo,
      memberid: wx.getStorageSync('memberid')
    }
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      method: 'POST',
      data: data,
      header: getApp().globalData.request_header,
      success(res) {
        wx.hideLoading()
        if (res.data.isSuccess === 'Y') {
          //发起微信支付
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success(res) {
              console.log('success=' + res);
              wx.showToast({
                title: '支付成功！',
                icon: 'none',
                duration: 2000
              });
              wx.requestSubscribeMessage({
                tmplIds: ['x-3kIsxiY2ucPKFdJRrKWJSjucCMzavQ_EpZG_gjyJA'],
                success (res) { 
                },
                complete(rs){
                  // console.log(2222222222222);
                  wx.reLaunch({
                    url: '../paysuccess/paysuccess?orderNo=' + that.data.orderNo
                  })
                }
              })
            },
            fail(res) {
              if (res.errMsg === 'requestPayment:fail cancel') {
                
              
                
                wx.showToast({
                  title: '用户取消支付',
                  icon: 'none',
                  duration: 2000
                });
                that.setData({
                  disabled:false
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  //获取用户手机号码
  getPhoneNumber: function(e) {
    var that = this;
    this.setData({
      but_type: e.currentTarget.dataset.type
    });
    if (e.detail.errMsg == "getPhoneNumber:ok") {

      wx.login({
        success: res => {
          wx.request({
            url: getApp().globalData.ApiUrl + 'server.php',
            data: {
              lng: getApp().globalData.longitude,
              lat: getApp().globalData.latitude,
              op: 'GetMember',
              code: res.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            },
            method: 'post',
            header: getApp().globalData.request_header,
            success(res) {
              if (res.data.isSuccess === 'Y') {
                wx.setStorageSync('memberid', parseInt(res.data.data[0].memberid))
                wx.setStorageSync('userInfo', res.data.data[0]);
                that.setData({
                  memberid: res.data.data[0].memberid
                })
                wx.redirectTo({
                  url: '../product_info/product_info?id=' + that.data.shop_id
                });
                // that.get_shop_info(3);
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
        title: '【小程序】需要获取你的手机信息，请确认授权',
        icon: 'none'
      })
    }

  },
  return_page: function() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      mydata: {
        id: 1,
        b: 125
      }
    })
    wx.navigateBack({ //返回
      delta: 1
    })
  },
  //去地图
  go_map() {
    wx.openLocation({
      latitude: +this.data.shop_data.lat,
      longitude: +this.data.shop_data.lng,
      // name,
      // address: desc
    })
    // wx.redirectTo({
    //   url: '../map/map?lat=' + this.data.shop_data.lat + '&lng=' + this.data.shop_data.lng,
    // })
  },
  //拨打电话
  freeTell() {
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
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '产品详情'
    })
    // if (options.id =='undefined') {
    //   wx.navigateBack({});
    //   return ;
    // }
    if (options.id) {
      this.setData({
        shop_id: options.id
      });
      this.get_shop_info(1);
      this.comment_list();
    }
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
  //获取商品评价
  comment_list: function() {
    var that = this;
    var data = {
      op: 'GetComment',
      shopid: this.data.shop_id,
      // memberid: wx.getStorageSync('memberid')
    }
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      // url: getApp().globalData.ApiUrl + 'get_nav',
      data: data,
      method: 'POST',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.isSuccess === 'Y') {
          that.setData({
            comments_list: res.data.data,
            comments_list_length: res.data.data.length
          });

        }
      }
    })
  },
  //获取商品详情
  get_shop_info: function(is_loading) {
    var that = this;
    var data = {
      op: 'GetShopInfo',
      shopid: this.data.shop_id,
      memberid: wx.getStorageSync('memberid')
    }
    if (is_loading == 1 || is_loading == 3) {
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
          let data=res.data.data[0];
          WxParse.wxParse('message', 'html', data.message, that, 0);
          WxParse.wxParse('tips', 'html', data.tips, that, 0);
          that.setData({
            shop_data: data,
            listcount: res.data.listcount,
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  //图片点击事件
  imgYu: function(event) {
    var src = event.currentTarget.dataset.url; //获取data-src
    var imgList=[];
    imgList.push(src);
    // var imgList = event.currentTarget.dataset.url; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })

  },
  //上拉加载更多
  onReachBottom() {
    var that = this;
    // loading开始
    wx.showLoading({
      title: '玩命加载中',
    })
    // if (this.data.comments_list_length >= this.data.pageSize) {
      var page = this.data.page + 1;
      this.setData({
        page: page
      })
    // }
    var data = {
      op: 'GetComment',
      shopid: this.data.shop_id,
      page: this.data.page
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
              title: '已加载全部',
              icon: 'none',
              duration: 2000
            })
          }
          var moment_list = that.data.comments_list;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          that.setData({
            comments_list: moment_list
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