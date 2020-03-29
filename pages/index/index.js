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
    type_id:'',
    cp_list:[],
    longitude:'',
    latitude:'',
    is_showModal:0,
    code:'',
    x:'',
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
  //产品详情
  toProductInfo:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product_info/product_info?id=' + id,
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
          that.setData({
            cp_list: res.data.data
          });

          wx.hideLoading()
        }
      }
    })
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
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  search(){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onLoad: function () {
    // this.is_phone();
    // this.get_location();
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  //获取用户手机号码
  getPhoneNumber: function (e){
    var that = this;
    console.log(e.detail);
    if (e.detail.errMsg == "getPhoneNumber:ok"){
      wx.request({
        url: getApp().globalData.ApiUrl + 'server.php',
        data: {
          'op':'UpdateMemberMobile',
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
    }else{
      wx.showToast({
        title: '拒绝授权',
        icon: 'none'
      })
    }
    
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
  }
})
