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
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
  }
})
