$(function(){
  MT.p2m(640);

  //pdf预览初始化
  var imgList = [
    './demo/images/1.jpg',
    './demo/images/2.jpg',
    './demo/images/3.jpg'
  ];
  $.pdfView({
    pageCount: 3,
    imgList: imgList,
    previewBox: $('.grid')
  });
});
