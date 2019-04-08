
let startTimestamp = 0;

function getTimeStamp() {
  return Date.now() - startTimestamp;
}

function makeProxiedRenderer(canvas, log) {
  var render = new ScratchRender(canvas);
  console.log("renderer created");
  //penLine
  var penLineOld = render.penLine;
  var handler = {
    apply: function (target, thisArg, argumentsList) {
      console.log(`${getTimeStamp(startTimestamp)}: Called penLine with arguments: ${argumentsList}`);
      var p1 = {x: argumentsList[2], y: argumentsList[3]};
      var p2 = {x: argumentsList[4], y: argumentsList[5]};
      var line = {start: p1, end: p2};
      log.pen.lines.push(line);
      log.pen.color = argumentsList[1].color4f;
      return target.apply(thisArg, argumentsList);
    }
  };
  render.penLine = new Proxy(penLineOld, handler);

  //penPoint
  var penPointOld = render.penPoint;
  handler = {
    apply: function (target, thisArg, argumentsList) {
      console.log(`${getTimeStamp(startTimestamp)}: Called penPoint with arguments: ${argumentsList}`);
      log.pen.color = argumentsList[1].color4f;
      log.pen.points.push({x: argumentsList[2], y: argumentsList[3]});
      return target.apply(thisArg, argumentsList);
    }
  };
  render.penPoint = new Proxy(penPointOld, handler);

  //penClear
  var penClearOld = render.penClear;
  handler = {
    apply: function (target, thisArg, argumentsList) {
      console.log(`${getTimeStamp(startTimestamp)}: Called penClear`);
      log.pen.lines = [];
      return target.apply(thisArg, argumentsList);
    }
  };
  render.penClear = new Proxy(penClearOld, handler);


  // text bubble creation
  var createTextSkinOld = render.createTextSkin;
  handler = {
    apply: function (target, thisArg, argumentsList) {
      console.log(`${getTimeStamp(startTimestamp)}: Called createTextSkin with arguments: ${argumentsList}`);
      log.pen.responses.push(argumentsList[1]);
      return target.apply(thisArg, argumentsList);
    }
  };
  render.createTextSkin = new Proxy(createTextSkinOld, handler);

  var updateTextSkinOld = render.updateTextSkin;
  handler = {
    apply: function (target, thisArg, argumentsList) {
      console.log(`${getTimeStamp(startTimestamp)}: Called updateTextSkin with arguments: ${argumentsList}`);
      log.pen.responses.push(argumentsList[2]);
      return target.apply(thisArg, argumentsList);
    }
  };
  render.updateTextSkin = new Proxy(updateTextSkinOld, handler);

  return render;
}
