



function makeProxiedRenderer(canvas) {
    var render = new ScratchRender(canvas);

    //penClear
    van penClearOld = render.penClear;
    var handler = {
        apply: function(target, thisArg) {
            console.log(`Called penClear`);
            return target.apply(thisArg);
        }
    }
    render.penClear = new Proxy(penClearOld, handler);

    //penPoint
    var penPointOld = render.penPoint;
    var handler = {
        apply: function(target, thisArg, argumentsList) {
            console.log(`Called penPoint with arguments: ${argumentsList}`);
            return target.apply(thisArg,argumentsList);
        }
    }
    render.penPoint = new Proxy(penPointOld, handler);

    //penLine
    var penLineOld = render.penLine;
    var handler = {
        apply: function(target, thisArg, argumentsList) {
                console.log(`Called penLine with arguments: ${argumentsList}`);
                return target.apply(thisArg,argumentsList);
            }
    };
    render.penLine = new Proxy(penLineOld,handler);

    return render;
}