
window.onload = function () {

    $('#editCanvasContainer').on('click', startDraw);
    $('#editCanvasContainer').on('mousemove', sizeRec);


    var startPoint = null,
        element = null,
        finishPoint = null,
        cropped = null,
        rectangle = null;


    function setRect () {
      var evt = event;
      var width = evt.pageX - startPoint.startX
      var height = evt.pageY - startPoint.startY
      $(element).css('width', width + 'px')
      .css('height', height + 'px')
      $('#editCanvasContainer').off('mousemove');
      var position = $('.rectangle').position();
      var height = $('.rectangle').height();
      var width = $('.rectangle').width();
      rectangle = {position: position, height: height, width: width};
      $('.rectangle').remove();
      crop()
    }

    function startDraw () {
      var evt = event;
      console.log('blah')
      if (element === null) {
        element = document.createElement('div')
        $(element).css('left', evt.pageX + 'px')
        .css('top', evt.pageY + 'px')
        .addClass('rectangle')
        $('#editCanvasContainer').append(element)
        startPoint = {startX: evt.pageX, startY: evt.pageY}
        $('#editCanvasContainer').css('cursor', 'crosshair')
        $('#editCanvasContainer').on('mousemove', sizeRec);
      }

    }

    function sizeRec () {
      var evt = event;
      if (startPoint !== null) {
        var width = Math.abs(evt.pageX - startPoint.startX);
        var height = Math.abs(evt.pageY - startPoint.startY);
        var left = (evt.pageX - startPoint.startX < 0) ? evt.pageX + 'px' : startPoint.startX + 'px';
        var top = (evt.pageY - startPoint.startY < 0) ? evt.pageY + 'px' : startPoint.startY + 'px';

        console.log(width, height, left, top)

        $(element).css('width', width + 'px')
          .css('height', height + 'px')
          .css('left', left)
          .css('top', top)

        $('#editCanvasContainer').on('click', setRect);

      }
    }

    function crop () {
      if (!cropped) {
        cropped = true;
        var croppedCanvas = document.createElement('canvas');
        var height = rectangle.height;
        var width = rectangle.width;
        croppedCanvas.width = width;
        croppedCanvas.height = height;
        croppedCanvas.id = 'croppedCanvas';
        $('#editCanvasContainer').append(croppedCanvas);
        getCroppedImage();
      }
    }

    function getCroppedImage () {
      var copy = document.getElementById('canvas2'),
          rectPosition = rectangle.position,
          copyPosition = $(copy).position(),
          clipX = rectPosition.left - copyPosition.left,
          clipY = rectPosition.top - copyPosition.top,
          cropW = rectangle.width,
          cropH = rectangle.height;

      var croppedCtxt = document.getElementById('croppedCanvas').getContext('2d');
      console.log(croppedCtxt)
      croppedCtxt.drawImage(copy, clipX, clipY, cropW, cropH, 0, 0, cropW, cropH );
    }


    var colorPurple = '#cb3594';
    var colorGreen = '#659b41';
    var colorYellow = '#ffcf33';

    var colorBrown = '#986928';
    var curColor = colorPurple;
    var clickColor = new Array();
    var clicked = false;

    var orig = document.getElementById('canvas')
    // var context = document.getElementById('canvas').getContext('2d');
    var copied = false;

    document.onselectstart = function(){ return false; }

    $('#choosePurpleSimpleColors').on('click', function () {
      curColor = colorPurple
    })
    $('#chooseGreenSimpleColors').on('click', function () {
      curColor = colorGreen
    })
    $('#chooseYellowSimpleColors').on('click', function () {
      curColor = colorYellow
    })
    $('#chooseBrownSimpleColors').on('click', function () {
      curColor = colorBrown
    })

    $('#thumbnail').on('click', function() {
      $('#original').toggle();
    })

    $('#edit').on('click', function() {
      // $('#thumbNailContainer').toggle();
      $('.overlay').show();
      var width = $('#original').width();
      var height = $('#original').height();
      $('#editCanvasContainer').css('width', width + 'px')
      $('#editCanvasContainer').css('height', height + 'px')
      $('#editCanvasContainer').append($('#original'));
      $('#editCanvasContainer').show();
      $('#original').css('z-index', '2005')
      $('#original').css('background-color', 'white')
      $('#original').show();
    })

    $('#grabScreenshot').on('click', function() {
      html2canvas(document.body, {
        onrendered: function(canvas) {
          console.log(canvas);
          var finalCanvas =  document.createElement('canvas');
          var finalCtxt = finalCanvas.getContext('2d');
          finalCtxt.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);
          finalCanvas.id = 'thumbnail';
          canvas.id = 'original';
          $('#thumbNailContainer').append(finalCanvas);

          $('#thumbnail').on('click', function() {
            $('#original').toggle();
          })

          $('body').append(canvas)
          $('#original').hide();
        }
      });
    })



    $('#copy').on('click', function() {
      if (!copied) {
        var copy = document.createElement('canvas'),
            context2 = copy.getContext('2d'),
            scaleFactor = 2;

        copy.width = orig.width / 2;
        copy.height = orig.height / 2;
        copy.id = 'canvas2',
        $('#canvasContainer').append(copy),
        context2.clearRect(0, 0, copy.width, copy.height)

        if (orig.height != copy.height) {
          var sDH = copy.height / orig.height
          var sUH = copy.height * orig.height
        }

        if (orig.width != copy.width) {
          var sDW = copy.width / orig.width
          var sUW = copy.width / orig.width
        };

        $(orig).remove();
        context2.scale(sDW, sDH)
        context2.drawImage(orig, 0, 0)
        copied = true;
      }
    })

    $('#canvas').mousedown(function (e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        paint = true;
        clicked = true;
        addClick(mouseX, mouseY);
        redraw();
    });

    $('#canvas').mousemove(function(e){
      if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
      }
    });

    $('#canvas').mouseup(function(e){
        paint = false;
        clicked = false;
    });

    $('#canvas').mouseleave(function(e){
        paint = false;
    });

    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var paint;

    function addClick(x, y, dragging)
    {
      clickX.push(x);
      clickY.push(y);
      clickDrag.push(dragging);
      clickColor.push(curColor);
    }

    function redraw(){
      context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

      context.lineJoin = 'round';
      context.lineWidth = 25;
      for(var i=0; i < clickX.length; i++) {
        context.beginPath();
        if(clickDrag[i] && i){
          context.moveTo(clickX[i-1], clickY[i-1]);
         }else{
           context.moveTo(clickX[i]-1, clickY[i]);
         }
         context.lineTo(clickX[i], clickY[i]);
         context.closePath();
         context.strokeStyle = clickColor[i];
         context.stroke();
      }

      strokeInfo = {
        colors: clickColor,
        lineJoin: context.lineJoin,
        lineWidth: context.lineWidth,
        clickDrag: clickDrag}

      message = JSON.stringify({type:'draw', body:{strokeInfo: strokeInfo, Xcoords: clickX, Ycoords: clickY}});
      // console.log(message);
      // sendMessage(message);
    }
}