let startTimestamp = 0;

function getTimeStamp() {
    return Date.now() - startTimestamp;
}

function makeProxiedRenderer(canvas, log) {
    let render = new ScratchRender(canvas);
    console.log("renderer created");
    //penLine
    let penLineOld = render.penLine;
    let handler = {
        apply: function (target, thisArg, argumentsList) {

            let p1 = {x: argumentsList[2], y: argumentsList[3]};
            let p2 = {x: argumentsList[4], y: argumentsList[5]};
            let line = {start: p1, end: p2};
            log.renderer.lines.push(line);
            let event = new Event('renderer', {name: 'penLine', line: line, color: argumentsList[1].color4f});
            event.previousFrame = new Frame('penLine');
            log.addEvent(event);

            return target.apply(thisArg, argumentsList);
        }
    };
    render.penLine = new Proxy(penLineOld, handler);

    //penPoint
    let penPointOld = render.penPoint;
    handler = {
        apply: function (target, thisArg, argumentsList) {

            let point = {x: argumentsList[2], y: argumentsList[3]}
            log.renderer.points.push(point);
            let event = new Event('renderer', {name: 'penPoint', point: point, color: argumentsList[1].color4f});
            event.previousFrame = new Frame('penPoint');
            log.addEvent(event);

            return target.apply(thisArg, argumentsList);
        }
    };
    render.penPoint = new Proxy(penPointOld, handler);

    //penClear
    let penClearOld = render.penClear;
    handler = {
        apply: function (target, thisArg, argumentsList) {

            log.renderer.lines = [];
            log.renderer.points = [];
            let event = new Event('renderer', {name: 'penClear'});
            event.previousFrame = new Frame('penClear');
            log.addEvent(event);

            return target.apply(thisArg, argumentsList);
        }
    };
    render.penClear = new Proxy(penClearOld, handler);


    // text bubble creation
    let createTextSkinOld = render.createTextSkin;
    handler = {
        apply: function (target, thisArg, argumentsList) {

            log.renderer.responses.push(argumentsList[1]);
            let event = new Event('renderer', {name: 'createTextSkin', text: argumentsList[1]});
            event.previousFrame = new Frame('createTextSkin');
            log.addEvent(event);

            return target.apply(thisArg, argumentsList);
        }
    };
    render.createTextSkin = new Proxy(createTextSkinOld, handler);

    let updateTextSkinOld = render.updateTextSkin;
    handler = {
        apply: function (target, thisArg, argumentsList) {

            log.renderer.responses.push(argumentsList[2]);
            let event = new Event('renderer', {name: 'updateTextSkin', text: argumentsList[2]});
            event.previousFrame = new Frame('updateTextSkin');
            log.addEvent(event);

            return target.apply(thisArg, argumentsList);
        }
    };
    render.updateTextSkin = new Proxy(updateTextSkinOld, handler);

    return render;
}
