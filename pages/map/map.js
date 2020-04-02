// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      iconPath: "/images/location.png",
      name: '北京'
    }],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '/images/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
        iconPath: '/images/location.png'
    }]
    // latitude: '',
    // longitude: '',
    // markers: [{
    //   iconPath: "/images/location.png",
    //   id: 0,
    //   latitude: 23.099994,
    //   longitude: 113.324520,
    //   width: 50,
    //   height: 50
    // }],
    // polyline: [{
    //   points: [{
    //     longitude: 113.3245211,
    //     latitude: 23.10229
    //   }, {
    //     longitude: 113.324520,
    //     latitude: 23.21229
    //   }],
    //   color: "#FF0000DD",
    //   width: 2,
    //   dottedLine: true
    // }],
    // controls: [{
    //   id: 1,
    //   iconPath: '/images/location.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.lat) {
      this.setData({ latitude: options.lat, "markers[0].latitude": options.lat });
    }
    if (options.lng) {
      this.setData({ longitude: options.lng, "markers[0].longitude": options.lng});
    }
    console.log(options);
    console.log(this.data.markers);
    //获取经纬度
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: (res) => {
    //     const latitude = res.latitude // 纬度
    //     const longitude = res.longitude // 经度
    //     // this.setData({
    //     //   latitude: latitude,
    //     //   longitude: longitude,
    //     //   markers: [{
    //     //     latitude: latitude,
    //     //     longitude: longitude, iconPath: '/images/location.png'

    //     //   }]
    //     // })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('map')
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
        path: '/pages/produdct_info/product_info?id=' + res.target.dataset.obj.shop_id
      }
    }
    return {
      title: '【萧一萧】一个价格你做主的小程序',
      path: '/pages/index/index'
    }
  }
})