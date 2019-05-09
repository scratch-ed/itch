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
            event.nextFrame = new Frame('penLineEnd');
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
            event.nextFrame = new Frame('penPointEnd');
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
            event.nextFrame = new Frame('penClearEnd');
            log.addEvent(event);

            return target.apply(thisArg, argumentsList);
        }
    };
    render.penClear = new Proxy(penClearOld, handler);


    // text bubble creation
    let createTextSkinOld = render.createTextSkin;
    handler = {
        apply: function (target, thisArg, argumentsList) {
            let skinId = target.apply(thisArg, argumentsList);

            log.renderer.responses.push(argumentsList[1]);
            let event = new Event('renderer', {id: skinId, name: 'createTextSkin', text: argumentsList[1]});
            event.previousFrame = new Frame('createTextSkin');
            event.nextFrame = new Frame('createTextSkinEnd');
            log.addEvent(event);

            return skinId;
        }
    };
    render.createTextSkin = new Proxy(createTextSkinOld, handler);

    let updateTextSkinOld = render.updateTextSkin;
    handler = {
        apply: function (target, thisArg, argumentsList) {

            log.renderer.responses.push(argumentsList[2]);
            let event = new Event('renderer', {name: 'updateTextSkin', text: argumentsList[2]});
            event.previousFrame = new Frame('updateTextSkin');
            event.nextFrame = new Frame('updateTextSkinEnd');
            log.addEvent(event);

            return target.apply(thisArg, argumentsList);
        }
    };
    render.updateTextSkin = new Proxy(updateTextSkinOld, handler);

    let destroySkinOld = render.destroySkin;
    handler = {
        apply: function (target, thisArg, argumentsList) {
            let skinId = argumentsList[0];
            let event = new Event('renderer', {name: 'destroySkin', id: skinId});
            event.previousFrame = new Frame('destroySkin');
            event.nextFrame = new Frame('destroySkinEnd');
            log.addEvent(event);

            return target.apply(thisArg, argumentsList);
        }
    };
    render.destroySkin = new Proxy(destroySkinOld, handler);

    return render;
}
