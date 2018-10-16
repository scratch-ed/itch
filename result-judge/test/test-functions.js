
//non exported helper functions
function distSq(p1, p2) {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

function isEqual(d1, d2){
    const threshold = 0.01;
    return d1 - d2 < threshold && d1 - d2 > -threshold;
}


function removeDuplicates(myArray) {
    return myArray.filter((obj, index, self) =>
        index === self.findIndex((t) => (
            isEqual(t.x, obj.x) && isEqual(t.y, obj.y)
        ))
    )
}

//Function that takes an array of line segments and merges the overlapping segments.
//It returns an array with the merged lines.
function mergeLines(lines) {
    let ricoDict = {};
    let vertDict = {};

    //sort op rico and on intersection with the y-axis:
    //This groups line segments on the same line together.

    for (let i = 0; i<lines.length; i++) {
        let p1 = lines[i].start;
        let p2 = lines[i].end;
        let x1 = p1.x;
        let y1 = p1.y;
        let x2 = p2.x;
        let y2 = p2.y;
        if (x1 === x2) {
            if (x1 in vertDict) {
                vertDict[x1].push(lines[i]);
            } else {
                vertDict[x1] = [lines[i]];
            }
        } else {
            let rico = ((y2 - y1) / (x2 - x1));
            console.log("rico: "+rico);
            const b = (y1 - (rico * x1)).toFixed(4);
            rico = rico.toFixed(4);
            if (rico in ricoDict) {
                let lineDict = ricoDict[rico];
                if (b in lineDict) {
                    lineDict[b].push(lines[i]);
                } else {
                    lineDict[b] = [lines[i]];
                }
                ricoDict[rico] = lineDict;
            } else {
                let lineDict = {};
                lineDict[b] = [lines[i]];
                ricoDict[rico] = lineDict;
            }
        }
    }

    //sort rico dictionary on intersection with y-axis.
    let merged_lines = [];

    for (const [rico, ld] of Object.entries(ricoDict)) {
        for (const [b, lines] of Object.entries(ld)) {
            console.log(b, lines);
            let line = lines[0];
            for (let i = 1; i < lines.length; i++) {
                if (distSq(line.start, lines[i].end) > distSq(line.end, lines[i].start)) {
                    line = {start:line.start, end:lines[i].end};
                } else {
                    line = {start:lines[i].start, end:line.end};
                }
            }
            merged_lines.push(line);
        }
    }

    for (const [x, lines] of Object.entries(vertDict)) {
        let line = lines[0];
        for (let i = 1; i < lines.length; i++) {
            if (distSq(line.start, lines[i].end) > distSq(line.end, lines[i].start)) {
                line = {start:line.start, end:lines[i].end};
            } else {
                line = {start:lines[i].start, end:line.end};
            }
        }
        merged_lines.push(line);
    }
    return merged_lines;
}

//exported test functions
exports.detectSquare = function(logData) {
    let lines = logData.lines;
    if (lines.length < 4) return false; //no square without at least 4 sides

    console.log(lines);

    let merged_lines = mergeLines(lines);
    console.log("merged lines:");
    console.log(merged_lines);
    //
    // check if four points are a square
    //

    for (let i = 0; i < merged_lines.length - 3; i++) {
        for (let j = i+1; j < merged_lines.length - 2; j++) {
            for (let k = j+1; k < merged_lines.length - 1; k++) {
                for (let l = k+1; l < merged_lines.length; l++) {
                    const p11 = merged_lines[i].start;
                    const p12 = merged_lines[i].end;
                    const p21 = merged_lines[j].start;
                    const p22 = merged_lines[j].end;
                    const p31 = merged_lines[k].start;
                    const p32 = merged_lines[k].end;
                    const p41 = merged_lines[l].start;
                    const p42 = merged_lines[l].end;
                    let points = [p11, p12, p21, p22, p31, p32, p41, p42];
                    //from the 8 points, there should be 4 pairs of equal points.
                    points = removeDuplicates(points);

                    if (points.length === 4) {
                        p1 = points[0];
                        p2 = points[1];
                        p3 = points[2];
                        p4 = points[3];

                        const d2 = distSq(p1, p2); //distance squared from p1 to p2
                        const d3 = distSq(p1, p3); //distance squared from p1 to p3
                        const d4 = distSq(p1, p4); //distance squared from p1 to p4

                        // If d2 and d3 are the same, then following conditions must met to form a square.
                        // 1) Square of d4 is same as twice the square of d2
                        // 2) Square of d3 is same as twice the square of d2

                        if (isEqual(d2, d3) && isEqual(2 * d2, d4) && isEqual(2 * d2, distSq(p2, p3))) {
                            const d = distSq(p2, p4);
                            return (isEqual(d, distSq(p3, p4)) && isEqual(d, d2));
                        }

                        // same for d3 and d4

                        if (isEqual(d3, d4) && isEqual(2 * d3, d2) && isEqual(2 * d3, distSq(p3, p4))) {
                            const d = distSq(p2, p3);
                            return (isEqual(d, distSq(p2, p4)) && isEqual(d, d3));
                        }

                        // same for d2 and d4

                        if (isEqual(d2, d4) && isEqual(2 * d2, d3) && isEqual(2 * d2, distSq(p2, p4))) {
                            const d = distSq(p2, p3);
                            return (isEqual(d, distSq(p3, p4)) && isEqual(d, d2));
                        }
                    }
                }
            }
        }
    }

    return false;
};

exports.detectColor = function(logData) {
    return logData.color;
};
