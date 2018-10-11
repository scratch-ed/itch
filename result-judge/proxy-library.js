/*
    Example of how to use a proxy over a method 
    in this case the penLine method. 
*/
function makeProxiedRenderer(canvas) {
    var render = new ScratchRender(canvas);

    //penLine
    var penLineOld = render.penLine;
    var handler = {
        apply: function(target, thisArg, argumentsList) {
            console.log('Called penLine with arguments: ${argumentsList}');
            var p1 = {x:argumentsList[2], y:argumentsList[3]};
            var p2 = {x:argumentsList[4], y:argumentsList[5]};
            var line = {start:p1, end:p2};
            logdata.lines.push(line);
            logdata.color = argumentsList[1].color4f;
            return target.apply(thisArg,argumentsList);
        }   
    };
    render.penLine = new Proxy(penLineOld,handler);

    //penPoint
    var penPointOld = render.penPoint;
    var handler = {
        apply: function(target, thisArg, argumentsList) {
            console.log('Called penPoint with arguments: ${argumentsList}');
            logdata.color = argumentsList[1].color4f;
            logdata.points.push({x:argumentsList[2], y:argumentsList[3]});
            return target.apply(thisArg,argumentsList);
        }
    };
    render.penPoint = new Proxy(penPointOld, handler);

    //penClear
    var penClearOld = render.penClear;
    var handler = {
        apply: function(target, thisArg, argumentsList) {
            console.log('Called penClear');
            return target.apply(thisArg, argumentsList);
        }
    }
    render.penClear = new Proxy(penClearOld, handler);

    return render;
}