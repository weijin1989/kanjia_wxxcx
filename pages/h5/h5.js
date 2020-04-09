// pages/h5/h5.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type=options.type;
    let url = getApp().globalData.ApiUrl;
    if(type==1){
      url = url + 'privacy.html';
      wx.setNavigationBarTitle({
        title: '萧一潇隐私政策'
      })
    }else if(type==2){
      url = url + 'user.html';
      wx.setNavigationBarTitle({
        title: '萧一潇用户协议'
      })
    } else if (type == 3) {
      url = url + 'contact.html';
      wx.setNavigationBarTitle({
        title: '联系我们'
      })
    }

    this.setData({
      url: url
    })
    
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})