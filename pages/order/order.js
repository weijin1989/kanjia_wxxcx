// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'order_type': 0,//订单类型
    'order_list': [],
    'order_list_length': 0,
    page:1,
    'siteurl':'',
    'orderNo': ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type) {
      this.setData({
        order_type: options.type
      });
    }
    wx.setNavigationBarTitle({
      title: '订单列表'
    })
    this.get_order_list();
  },
  go_comment(e){
    let orderNo = e.currentTarget.dataset.order_no;
    wx.navigateTo({
      url:'../comment/comment?orderNo='+orderNo
    })
  },
  //删除订单
  del_order(e){
    let orderNo = e.currentTarget.dataset.order_no;
    let index=e.currentTarget.dataset.index;
    let that=this;
    wx.showModal({
      title: '提示',
      content: '确认删除该订单吗，删除不可恢复！',
      success (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.ApiUrl + 'server.php',
            data: {
              op: 'DeleteOrder',
              memberid: wx.getStorageSync('memberid'),
              appflowno: orderNo,
            },
            method: 'post',
            header: getApp().globalData.request_header,
            success(res) {
              if (res.data.isSuccess === 'Y') {
                let order_list=that.data.order_list;
                order_list.splice(index, 1)
                that.setData({
                  order_list: order_list
                })
                wx.showToast({
                  title: '删除成功', // 标题
                  icon: 'none', // 图标类型，默认success
                  duration: 1500 // 提示窗停留时间，默认1500ms
                })
              } else {
                wx.showToast({
                  title: '删除失败', // 标题
                  icon: 'none', // 图标类型，默认success
                  duration: 1500 // 提示窗停留时间，默认1500ms
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //支付
  pay(e){
    let appflowno = e.currentTarget.dataset.order_no;
    var that = this;
    this.setData({
      orderNo: appflowno
    });
    wx.showLoading({
      title: '提交中...',
    })
    var data = {
      op: 'CreatOrder',
      appflowno: appflowno,
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
          console.log(
            {
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: 'MD5',
              paySign: res.data.data.paySign
            }
          );
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
              wx.redirectTo({
                url: '../paysuccess/paysuccess?orderNo=' + that.data.orderNo
              })
            },
            fail(res) {
              console.log(res);
              if (res.errMsg === 'requestPayment:fail cancel') {
                wx.showToast({
                  title: '用户取消支付',
                  icon: 'none',
                  duration: 2000
                });
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
  //获取订单列表
  get_order_list() {
    let data = {
      op: "GetOrder",
      memberid: wx.getStorageSync('memberid'),
      status:this.data.order_type
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
            order_list: res.data.data,
            siteurl: res.data.siteurl,
            order_list_length: res.data.data.length > 0 ? true : false
          });

          wx.hideLoading()
        }
      }
    })
  },
  //
  chang_order_type(e){
    let type = e.currentTarget.dataset.type;
    this.setData({
      order_type: type,
      page:1
    });
    this.get_order_list();
  },
  go_order_info(e) {
    let order_no = e.currentTarget.dataset.order_no;
    let status=e.currentTarget.dataset.status;
    let shop_id= e.currentTarget.dataset.shop_id;
    if(status==1){
      wx.navigateTo({
        url: '../product_info/product_info?id=' + shop_id,
      })
    }else{
      wx.navigateTo({
        url: '../order_info/order_info?orderNo=' + order_no,
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
    
    let data = {
      op: "GetOrder",
      memberid: wx.getStorageSync('memberid'),
      page: this.data.page,
      status:this.data.order_type
    };
    wx.request({
      url: getApp().globalData.ApiUrl + 'server.php',
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
          var moment_list = that.data.order_list;
          for (var i = 0; i < res.data.data.length; i++) {
            moment_list.push(res.data.data[i]);
          }
          that.setData({
            order_list: moment_list,
            // siteurl: res.data.siteurl
          });
          // console.log(that.data.siteurl);

        }
      }
    })
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