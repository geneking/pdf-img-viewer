/**
 * @author: jinweigang
 * @date:   2016-06-01
 * @version 1.0
 */

 (function(factory){
    if (typeof define === "function" && define.amd) {
        define(['Zepto'], factory);
    } else {
        factory(Zepto);
    }
}(function($, undefined){

  //必要参数配置
  var config = {
    range:100,       //缩放幅度100px
    pageCount: 0,    //总页数
    pageIndex: 1,    //当前页码
    zoom: 0,         //高度比率
    minWidth: 0,     //图片容器宽度
    maxWidth: 0,     //图片实际宽度
    imgList: [],     //图片列表
    imgBox: null,    //图片容器
    previewBox: null //外层容器
  };

  /**
   * @function renderTpl
   * @description 渲染模板
   */
  var renderTpl =  function(){
    var tpl = '<div class="preview">\
                <div class="page-head">\
                  <span>页码</span>\
                  <span class="page-now">1</span>/\
                  <span class="page-total">5</span>\
                </div>\
                <div class="view-container">\
                  <div class="img-item"></div>\
                </div>\
                <div class="zoom-box">\
                  <div class="zoom"></div>\
                  <div class="zoom-in"></div>\
                  <div class="zoom-out"></div>\
                </div>\
                <div class="page-change">\
                  <button class="page-prev">上一页</button>\
                  <button class="page-next">下一页</button>\
                </div>\
              </div>';
    config.previewBox.html(tpl);
  };

  //操作
  var action = {
    /**
     * @function loadImg
     * @description 加载pdf图片
     */
    loadImg: function(index){
      var image = new Image(),
          container = config.previewBox.find('.preview');
      container.append('<div class="loading"></div>');
      image.onload =  function(){
        config.maxWidth = image.naturalWidth;
        config.zoom = image.naturalHeight/image.naturalWidth;
        config.imgBox.html('<img src="' + config.imgList[index] + '">');
        container.find('.loading').remove();
      };
      image.src = config.imgList[index];
    },

    /**
     * @function reset
     * @description 重置pdf图片至原始大小
     */
    reset: function(){
      config.imgBox.find('img').css({
        width: config.imgBox.width(),
        height: config.imgBox.height()
      });
    },

    /**
     * @function render
     * @description 首次渲染
     */
    render: function(){
      renderTpl();
      config.imgBox = $('.img-item');
      this.loadImg(0);
      $('.page-total').text(config.pageCount);
    }
  };

  //事件监听
  var listener = {
    init: function() {
      this.zoom();
      this.zoomIn();
      this.zoomOut();
      this.prevPage();
      this.nextPage();
    },

    /**
     * @function zoom
     * @description 恢复原样/重置
     */
    zoom: function() {
      $('.zoom').on(MT.TOUCH_START, function() {
        action.reset();
      });
    },

    /**
     * @function zoom
     * @description 缩小
     */
    zoomIn: function() {
      $('.zoom-in').on(MT.TOUCH_START, function() {
        var img = config.imgBox.find('img'),
            imgWidth = img.width() - config.range;
        if(imgWidth > config.minWidth){
          img.css({
            width: imgWidth,
            height: imgWidth*config.zoom
          });
        } else {
          img.css({
            width: config.minWidth,
            height: config.minWidth*config.zoom
          });
        }
      });
    },

    /**
     * @function zoom
     * @description 放大
     */
    zoomOut: function() {
      $('.zoom-out').on(MT.TOUCH_START, function() {
        var img = config.imgBox.find('img'),
            imgWidth = img.width() + config.range;
        if(imgWidth < config.maxWidth){
          img.css({
            width: imgWidth,
            height: imgWidth*config.zoom
          });
        } else {
          img.css({
            width: config.maxWidth,
            height: config.maxWidth*config.zoom
          });
        }
      });
    },

    /**
     * @function prevPage
     * @description 上一页
     */
    prevPage: function() {
      $('.page-prev').on(MT.TOUCH_START, function() {
        if(config.pageIndex == 1) return;
        action.loadImg(--config.pageIndex-1);
        $('.page-now').text(config.pageIndex);
      });
    },

    /**
     * @function nextPage
     * @description 下一页
     */
    nextPage: function() {
      $('.page-next').on(MT.TOUCH_START, function() {
        if(config.pageIndex == config.pageCount) return;
        action.loadImg(++config.pageIndex-1);
        $('.page-now').text(config.pageIndex);
      });
    }
  };

  /**
   * @function pdfView
   * @description 外部调用接口
   * @param {pageCount:总页数, imgList:pdf图片列表, previewBox: 图片装载容器}
   */
  $.pdfView = function(_option){
    var option = $.extend({
      pageCount: 0,
      imgList: [],
      previewBox: null
    },_option);
    $.extend(config, option);

    action.render();
    //p2m方法可能未适配完，做延时处理
    setTimeout(function(){
      config.minWidth = option.previewBox.width();
      listener.init();
    },1000);
  };

  return {pdfView: $.pdfView};
}));
