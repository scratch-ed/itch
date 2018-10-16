
//non exported helper functions
function distSq(p1, p2) {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

function isEqual(d1, d2){
    const threshold = 0.01
    return d1 - d2 < threshold && d1 - d2 > -threshold;
}

//exported test functions
exports.detectSquare = function(logData) {
    console.log("detecting squares");

    var lines = logData.lines;

    if (lines.length < 4) return false; //no square without at least 4 sides

    var ricoDict = {};
    var verticalLines = [];

    for (let i = 0; i<lines.length; i++) {
        let p1 = lines[i].start;
        let p2 = lines[i].end;
        let x1 = p1.x;
        let y1 = p1.y;
        let x2 = p2.x;
        let y2 = p2.y;
        if (x1 === x2) {
            verticalLines.push(lines[i]);
        } else {
            let rico = (y2 - y1) / (x2 - x1);
            if (ricoDict[rico]) {
                ricoDict[rico].push(lines[i]);
            } else {
                ricoDict[rico] = [lines[i]];
            }
        }
    }

    console.log("Dict:")
    console.log(ricoDict);

    //todo change this to lines, so that new added merged lines can merge with other lines.
    var merged_lines=[];
    // merge lines with same rico that overlap
    for (var i = 0; i<lines.length; i++) {
        for (var j = i; j<lines.length; j++) {
            if (i != j) {
                console.log('i: '+i);
                console.log('j: '+j);


                var verticaal_i = false;

                if (x1_i == x2_i) { //don't divide by 0
                    verticaal_i = true;;
                } else { //calculate rico first line
                    var rico_i = (y2_i - y1_i) / (x2_i - x1_i);
                    console.log(rico_i);
                }

                var p1_j = lines[j].start;
                var p2_j = lines[j].end;
                var x1_j = p1_j.x;
                var y1_j = p1_j.y;
                var x2_j = p2_j.x;
                var y2_j = p2_j.y;
                var verticaal_j = false;

                if (x1_j == x2_j) { //don't divide by 0
                    var verticaal_j = true;
                } else { //calculate rico second line
                    var rico_j = (y2_j - y1_j) / (x2_j - x1_j);
                    console.log(rico_j);
                }
                if (verticaal_i && verticaal_j){
                    if (x1_i == x1_j) {
                        //merge
                        if (distSq(p1_i,p2_j) > distSq(p1_j, p2_i)) {
                            merged_lines.push({start:p1_i, end:p2_j});
                        } else {
                            merged_lines.push({start:p1_j, end:p2_i});
                        }
                    }

                }
                if (!verticaal_i && !verticaal_j && isEqual(rico_i, rico_j)) {
                    // the lines are parallel or overlapping
                    // y = rico*x + b
                    // calculate b
                    var b_i = y1_i - (rico_i * x1_i);
                    console.log('b: '+b_i);
                    // if the second point satisfies the function and the startpoint of the second line lies on the first line, the lines overlap and we can merge them
                    console.log('y1_j - rico_i*x1_j - b_i: '+(y1_j - rico_i*x1_j - b_i));
                    if (y1_j - rico_i*x1_j - b_i == 0) {
                        //todo check if overlap

                        //merge
                        if (distSq(p1_i,p2_j) > distSq(p1_j, p2_i)) {
                            merged_lines.push({start:p1_i, end:p2_j});
                        } else {
                            merged_lines.push({start:p1_j, end:p2_i});
                        }

                    }
                }

            }
        }
    }
    console.log(merged_lines);


    //
    // check if four points are a square
    //
    const p1 = lines[0].start;
    const p2 = lines[1].start;
    const p3 = lines[2].start;
    const p4 = lines[3].start;

    const d2 = distSq(p1,p2); //distance squared from p1 to p2
    const d3 = distSq(p1,p3); //distance squared from p1 to p3
    const d4 = distSq(p1,p4); //distance squared from p1 to p4

    // If d2 and d3 are the same, then following conditions must met to form a square.
    // 1) Square of d4 is same as twice the square of d2
    // 2) Square of d3 is same as twice the square of d2

    if (isEqual(d2,d3) && isEqual(2 * d2,d4) && isEqual(2 * d2,distSq(p2, p3))) {
        const d = distSq(p2, p4);
        return (isEqual(d,distSq(p3, p4)) && isEqual(d,d2));
    }

    // same for d3 and d4

    if (isEqual(d3,d4) && isEqual(2 * d3,d2) && isEqual(2 * d3,distSq(p3, p4))) {
        const d = distSq(p2, p3);
        return (isEqual(d,distSq(p2, p4)) && isEqual(d,d3));
    }

    // same for d2 and d4

    if (isEqual(d2,d4) && isEqual(2 * d2,d3) && isEqual(2 * d2,distSq(p2, p4))) {
        const d = distSq(p2, p3);
        return (isEqual(d,distSq(p3, p4)) && isEqual(d,d2));
    }
    return false;
};

exports.detectColor = function(logData) {
    return logData.color;
};
