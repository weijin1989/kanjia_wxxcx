// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    order_no: '',
    order_info: [],
    siteurl: '',
    imageFile: '',
    imageFileBase: '',
    disabled:false,
    previewFlg:false,
    starDesc: '非常不满意',
    star: 0,
    stars: [{
      lightImg: '../../images/icon11.png',
      blackImg: '../../images/icon10.png',
      flag: 1,
      message: '非常不满意'
    }, {
      lightImg: '../../images/icon11.png',
      blackImg: '../../images/icon10.png',
      flag: 2,
      message: '不满意'
    }, {
      lightImg: '../../images/icon11.png',
      blackImg: '../../images/icon10.png',
      flag: 3,
      message: '一般'
    }, {
      lightImg: '../../images/icon11.png',
      blackImg: '../../images/icon10.png',
      flag: 4,
      message: '比较满意'
    }, {
      lightImg: '../../images/icon11.png',
      blackImg: '../../images/icon10.png',
      flag: 5,
        message: '非常满意'
    }]
  },
  //提交评论
  saveCommen: function (e) {
    var that = this;
    var message = e.detail.value.message;
    var star = this.data.star;
    if (message == "") {
      wx.showToast({
        title: '请输入您评价内容',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    if (star == 0) {
      wx.showToast({
        title: '请打个分呗',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var data = {
      op: 'AddComment',
      message: message,
      star: star,
      shopid: this.data.order_info.shopid,
      appflowno: this.data.order_no,
      image: this.data.imageFileBase,
      memberid: wx.getStorageSync('memberid')
    }
    that.setData({
      disabled:true
    });

    wx.showLoading({
      title: '提交中',
    })
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
            orderNo: res.data.data.appflowno
          });
          wx.showToast({
            title: '评论成功！',
            icon: 'none',
            duration: 2000
          });
          wx.redirectTo({
            url: '../commentsuccess/commentsuccess'
          })
        }
      }
    })
  },
  //上传图片
  uploadImage: function () {
    var that = this;

    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imageFile: tempFilePaths[0],
          previewFlg:true
        })
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            that.setData({
              imageFileBase: 'data:image/png;base64,' + res.data
            });
            console.log('data:image/png;base64,' + res.data);
          }
        });
      }
    });
  },
  // 选择评价星星
  starClick: function (e) {
    var that = this;
    for (var i = 0; i < that.data.stars.length; i++) {
      var allItem = 'stars[' + i + '].flag';
      that.setData({
        [allItem]: 2
      })
    }
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i <= index; i++) {
      var item = 'stars[' + i + '].flag';
      that.setData({
        [item]: 0
      })
    }
    this.setData({
      starDesc: this.data.stars[index].message,
      star: index+1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.orderNo) {
      this.setData({
        order_no: options.orderNo
      });
      this.get_order_info();
    }
    wx.setNavigationBarTitle({
      title: '发表评价'
    })
  },
  get_order_info() {
    let data = {
      op: "GetOrderInfo",
      memberid: wx.getStorageSync('memberid'),
      appflowno: this.data.order_no
    };
    wx.showLoading({
      title: '加载中...',
    })
    let that = this;
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
      // url: getApp().globalData.ApiUrl + 'get_nav',
      data: data,
      method: 'POST',
      header: getApp().globalData.request_header,
      success(res) {
        if (res.data.isSuccess === 'Y') {
          that.setData({
            order_info: res.data.data[0],
            siteurl: res.data.siteurl
          });

          wx.hideLoading()
        }
      }
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