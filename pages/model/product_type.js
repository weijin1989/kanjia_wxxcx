Component({
  properties: {
    modelValue: {
      type:String,
      value: []
    }, 
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.get_nav();
    },
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
    nav_list:[],
    type_id:0,
    x:0
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function () { }
    ,
    switchTap(e) { //更换资讯大类
      let screenWidth = wx.getSystemInfoSync().windowWidth;
      let itemWidth = screenWidth / 5;
      let { index, type } = e.currentTarget.dataset;
      const { nav_list } = this.data;
      let scrollX = itemWidth * index - itemWidth * 2;
      let maxScrollX = (nav_list.length + 1) * itemWidth;
      if (scrollX < 0) {
        scrollX = 0;
      } else if (scrollX >= maxScrollX) {
        scrollX = maxScrollX;
      }
      this.setData({
        x: scrollX,
        type_id: type
      })
      //调用外部事件
      this.triggerEvent('get_cate_shop_event', {
        'type_id': type
      })
      this.triggerEvent("switchTap", type); //点击了导航,通知父组件重新渲染列表数据
    },
    //获取栏目
    get_nav: function () {

      var that = this;

      var data = {
        op: 'GetCategory',
        type: 'shops'
      }
      wx.request({
        url: getApp().globalData.ApiUrl + 'server.php',
        // url: getApp().globalData.ApiUrl + 'get_nav',
        data: data,
        method: 'POST',
        header: getApp().globalData.request_header,
        success(res) {
          if (res.data.isSuccess === 'Y') {
            // that.setData({
            //   nav_list: res.data.data
            // });
            for (let i = 0; i < res.data.data.length; i++) {
              if (i == 0) {
                that.setData({
                  nav_list: res.data.data,
                  type_id: res.data.data[i]['catid']
                });


                that.triggerEvent('get_cate_shop_event', {
                  'type_id': res.data.data[i]['catid']
                })
              }
            }

          }
        }
      })
    },
  }
})