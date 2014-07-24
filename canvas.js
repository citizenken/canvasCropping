
window.onload = function () {
    var colorPurple = "#cb3594";
    var colorGreen = "#659b41";
    var colorYellow = "#ffcf33";
    var colorBrown = "#986928";

    var curColor = colorPurple;
    var clickColor = new Array();
    var clicked = false;

    context = document.getElementById('canvas').getContext("2d");

    document.onselectstart = function(){ return false; }

    $("#choosePurpleSimpleColors").on("click", function () {
      curColor = colorPurple
    })
    $("#chooseGreenSimpleColors").on("click", function () {
      curColor = colorGreen
    })
    $("#chooseYellowSimpleColors").on("click", function () {
      curColor = colorYellow
    })
    $("#chooseBrownSimpleColors").on("click", function () {
      curColor = colorBrown
    })

    $("#canvas").mousedown(function (e) {
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

      context.lineJoin = "round";
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

      message = JSON.stringify({type:"draw", body:{strokeInfo: strokeInfo, Xcoords: clickX, Ycoords: clickY}});
      // console.log(message);
      // sendMessage(message);
    }
}