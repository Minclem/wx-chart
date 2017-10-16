// pages/draw/line.js
Page({
  data: {
    canvasWidth: 0,
    canvasHeight: 0
  },
  onLoad: function (options) {
    var cW = wx.getSystemInfoSync().windowWidth;
    this.setData({
      canvasWidth: cW,
      canvasHeight: cW  * 0.5
    })
  },
  onReady: function () {
    let xset = [];
    let yset = [];
    let _data = [];
    let _data2 = [];
    let j = 0;

    for(var i = 0; i < 100; i++){
      j > 12 ? j == 1 : j++;
      j = j > 9 ? j : '0' + j;

      xset.push('2017-' + j);

      _data.push(parseInt(Math.random() * 500));
      _data2.push(parseInt(Math.random() * 500));
    }

    yset.push({
      'name': 'test',
      'data': _data
    },{
      'name': 'test',
      'data': _data2
    })


    this.drawLine({
      self: this,
      id: 'analysisTotal',
      field: 'lineObj',
      categories: xset,
      series: yset,
      width: this.data.canvasWidth,
      height: this.data.canvasHeight,
      colors: [ '#7688db', '#ffab00' ]
    });
  },
  drawLine: function(opts){
    const ctx = wx.createCanvasContext('analysisTotal');
    
    ctx.setStrokeStyle('#444444');
    ctx.setLineWidth(1);

    ctx.beginPath();
    
    let startY = 20;
    let startX = 50;
    let endY = opts.height - 40;
    let endX = opts.width - 20;

    // 坐标轴
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, endY);
    ctx.moveTo(startX, endY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.closePath();

    let _maxNum = 0; 


    opts.series.forEach(function (seriesItem) {
      let _arrMax = Math.max.apply(this, seriesItem.data);
      let _max = 1 + parseInt(_arrMax.toString().substr(0, 1));
      _maxNum = _max * Math.pow(10, _arrMax.toString().length - 1);
    });

    ctx.beginPath();
    var _scale = (opts.height - startY - startX) / 5;
    ctx.setStrokeStyle('#cccccc');
    for (var i = 1; i < 6; i++) {
      ctx.moveTo(startX, endY - _scale * i);
      ctx.lineTo(endX, endY - _scale * i);
      ctx.setTextAlign('right');
      ctx.setTextBaseline('middle');
      ctx.fillText(_maxNum / 5 * i, startX - 5, endY - _scale * i);
    }

    ctx.stroke();
    ctx.closePath();



    opts.series.forEach(function (seriesItem, idx) {
      let _scaleY = seriesItem.data.length;
      seriesItem.data.forEach(function (daily, i) {
        let x = (endX - startX * 1.2) / _scaleY * i + startX + 5;
        let xTo = (endX - startX * 1.2) / _scaleY * (i + 1) + startX + 5;

        if (i > 0) {
          ctx.beginPath();
          ctx.setStrokeStyle(opts.colors[idx]);
          ctx.setLineWidth(1.5);
          ctx.moveTo(x, endY - seriesItem.data[i - 1] / _maxNum * (_scale * 5));
          ctx.lineTo(xTo, endY - daily / _maxNum * (_scale * 5));
          ctx.stroke();
          ctx.closePath();
        }
      });

    });

    ctx.draw();
  }
})
