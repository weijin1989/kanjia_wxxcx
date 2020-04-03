//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '哈哈哈哈',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nav_list: [],
    type_id: '',
    siteurl: '',
    cp_list:[],
    cp_list_length:0,
    hot_list:[],
    hot_list_length:false,
    longitude:'',
    latitude:'',
    is_showModal:0,
    shop_data:[],
    shop_data_index:'',
    code:'',
    page:1,
    pageSize: getApp().globalData.pageSize,
    memberid: getApp().globalData.memberid,
    x:'',
  },
  //产品详情
  toProductInfo:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product_info/product_info?id=' + id,
    })
  },
  //更多抢购商品
  more_hot() {
    wx.navigateTo({
      url: '../product_hot/product_hot',
    })
  },
  //砍价
  bargain(e){
    console.log(e);
    var that=this;
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
          wx.showToast({
            title: title, // 标题
            icon: 'none',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
          that.get_shop_info();
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
  get_shop_info(){
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
          let list=[];
          let cp_list = that.data.cp_list;
          for (var i = 0; i < cp_list.length; i++) {
            if(i==index){
              list.push(res.data.data[0]);
            }else{
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
  //内组件调用外部方法
  get_cate_shop_event:function(e){
    var type_id = e.detail.type_id;
    this.setData({
      type_id: type_id
    });
    this.get_cate_shop();
  },
  //获取正在抢购商品
  get_hot_shop(){
    var that = this;
    var data = {
      op: 'GetHotShops',
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
          res.data.data.forEach((item) => {
            item.subject = item.subject.substring(0, 10); //要截取字段的字符串
          })
          that.setData({
            hot_list: res.data.data,
            siteurl: res.data.siteurl,
            hot_list_length: res.data.data.length > 0 ? true : false
          });
        }
      }
    })
  },
  //上拉加载更多
  onReachBottom(){
    var that = this;
    // loading开始
    wx.showLoading({
      title: '玩命加载中',
    })
    if (this.data.cp_list_length==this.data.pageSize){
      var page=this.data.page+1;
      this.setData({
        page:page
      })
    }
    var data = {
      op: 'GetCateShops',
      catid: this.data.type_id,
      page:this.data.page,
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
  //附近美食
  get_cate_shop: function () {
    var that = this;


    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function () {
      that.setData({
        memberid:wx.getStorageSync('memberid')
      })
      var data = {
        op: 'GetCateShops',
        catid: that.data.type_id,
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
            that.setData({
              cp_list: res.data.data,
              cp_list_length: res.data.data.length,
              siteurl: res.data.siteurl
            });
            // console.log(that.data.siteurl);

          }
        }
      })
    }, 1000)
  },
  //判断是否有手机号没有则获取
  is_phone(){
    let that=this;
    let moblie = getApp().globalData.userInfo;
    if (!moblie){
      wx.hideTabBar();
      wx.login({
        success: res => {
          that.setData({
            code: res.code,
            is_showModal:1
          });
        }
      })
    }
  },
  search(){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onLoad: function () {
    this.get_hot_shop();
  },
  //获取用户手机号码
  getPhoneNumber: function (e){
    var that = this;
    console.log(e.detail);
    if (e.detail.errMsg == "getPhoneNumber:ok"){
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
          that.get_cate_shop();
          // wx.hideLoading()
        }
      })
    }else{
      wx.showToast({
        title: '拒绝授权',
        icon: 'none'
      })
    }
    
  },
  onShow:function(){
    // app.editTabBar();    //显示自定义的底部导
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      return {
        title: '原价' + res.target.dataset.obj.price + ',最低砍价至￥1！' + res.target.dataset.obj.subject,
        path: '/pages/product_info/product_info?id=' + res.target.dataset.obj.shopid
      }
    }
    return {
      title: '【萧一萧】一个价格你做主的小程序',
      path: '/pages/index/index'
    }
  }
})
