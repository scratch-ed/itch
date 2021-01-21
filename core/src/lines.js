/* Copyright (C) 2019 Ghent University - All Rights Reserved */
// CONSTANTS
const threshold = 0.01;

// Calculates the squared distance between two points
export function distSq(p1, p2) {
  return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

export function dist(line) {
  return Math.sqrt(distSq(line.start, line.end));
}

// Checks if two numbers d1 and d2 are almost equal. (The difference has to be smaller than a certain threshold)
export function isEqual(d1, d2) {
  return d1 - d2 < threshold && d1 - d2 > -threshold;
}

// Removed duplicate points from an array of points by checking if the position in the list is equal to the position
// of the first occurance of the point.
export function removeDuplicates(myArray) {
  return myArray.filter((obj, index, self) =>
    index === self.findIndex((t) => (
      isEqual(t.x, obj.x) && isEqual(t.y, obj.y)
    ))
  );
}

// If d1 and d2 are the same, then following conditions must met to form a square.
// 1) Square of d3 is same as twice the square of d1
// 2) Square of d2 is same as twice the square of d1
export function squareTest(d1, d2, d3, p1, p2, p3) {
  if (isEqual(d1, d2) && isEqual(2 * d1, d3) && isEqual(2 * d1, distSq(p1, p2))) {
    const d = distSq(p1, p3);
    return (isEqual(d, distSq(p2, p3)) && isEqual(d, d1));
  }
  return false;
}

// EXPORTED FUNCTIONS

// Function that takes an array of line segments and merges the overlapping segments.
// It returns an array with the merged lines.
export function mergeLines(lines) {
  const ricoDict = {};
  const vertDict = {};

  // sort op rico and on intersection with the y-axis:
  // This groups line segments on the same line together.

  for (let i = 0; i < lines.length; i++) {
    const p1 = lines[i].start;
    const p2 = lines[i].end;
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;
    if (x1 === x2) {
      if (x1 in vertDict) {
        vertDict[x1].push(lines[i]);
      } else {
        vertDict[x1] = [lines[i]];
      }
    } else {
      let rico = ((y2 - y1) / (x2 - x1));
      const b = (y1 - (rico * x1)).toFixed(4);
      rico = rico.toFixed(4);
      if (rico in ricoDict) {
        const lineDict = ricoDict[rico];
        if (b in lineDict) {
          lineDict[b].push(lines[i]);
        } else {
          lineDict[b] = [lines[i]];
        }
        ricoDict[rico] = lineDict;
      } else {
        const lineDict = {};
        lineDict[b] = [lines[i]];
        ricoDict[rico] = lineDict;
      }
    }
  }

  // sort rico dictionary on intersection with y-axis.
  const merged_lines = [];

  for (const [rico, ld] of Object.entries(ricoDict)) {
    for (const [b, lines] of Object.entries(ld)) {
      let line = lines[0];
      for (let i = 1; i < lines.length; i++) {
        if (distSq(line.start, lines[i].end) > distSq(line.end, lines[i].start)) {
          line = { start: line.start, end: lines[i].end };
        } else {
          line = { start: lines[i].start, end: line.end };
        }
      }
      merged_lines.push(line);
    }
  }

  for (const [x, lines] of Object.entries(vertDict)) {
    let line = lines[0];
    for (let i = 1; i < lines.length; i++) {
      if (distSq(line.start, lines[i].end) > distSq(line.end, lines[i].start)) {
        line = { start: line.start, end: lines[i].end };
      } else {
        line = { start: lines[i].start, end: line.end };
      }
    }
    merged_lines.push(line);
  }
  return merged_lines;
}

// Given points, test if they form a square
export function pointsAreSquare(points) {
  // only square if there are four unique points
  if (points.length === 4) {
    const p1 = points[0];
    const p2 = points[1];
    const p3 = points[2];
    const p4 = points[3];

    const d2 = distSq(p1, p2); // distance squared from p1 to p2
    const d3 = distSq(p1, p3); // distance squared from p1 to p3
    const d4 = distSq(p1, p4); // distance squared from p1 to p4

    // test if the points form a square
    if (squareTest(d2, d3, d4, p2, p3, p4)) return true;
    if (squareTest(d3, d4, d2, p3, p4, p2)) return true;
    if (squareTest(d2, d4, d3, p2, p4, p3)) return true;
  }
  return false;
}

export function findSquareLength(points) {
  let l = 0;
  for (let i = 0; i < 4; i++) {
    const p = points[i];
    for (let j = 0; j < 4; j++) {
      if (i !== j) {
        const q = points[j];
        const d = distSq(p, q);
        if (d < l || l === 0) {
          l = d;
        }
      }
    }
  }
  return Math.sqrt(l);
}

export function findSquares(lines) {
  const squares = [];
  if (lines.length < 4) return false; // no square without at least 4 sides

  const merged_lines = mergeLines(lines);
  //
  // check if four points are a square
  //
  for (let i = 0; i < merged_lines.length - 3; i++) {
    for (let j = i + 1; j < merged_lines.length - 2; j++) {
      for (let k = j + 1; k < merged_lines.length - 1; k++) {
        for (let l = k + 1; l < merged_lines.length; l++) {
          const p11 = merged_lines[i].start;
          const p12 = merged_lines[i].end;
          const p21 = merged_lines[j].start;
          const p22 = merged_lines[j].end;
          const p31 = merged_lines[k].start;
          const p32 = merged_lines[k].end;
          const p41 = merged_lines[l].start;
          const p42 = merged_lines[l].end;
          let points = [p11, p12, p21, p22, p31, p32, p41, p42];

          // from the 8 points, there should be 4 pairs of equal points
          points = removeDuplicates(points);
          const square = { points: points, length: findSquareLength(points) };

          if (pointsAreSquare(points)) squares.push(square);
        }
      }
    }
  }
  return squares;
}

export function pointsAreTriangle(points) {
  // given points are not equal
  return points.length === 3;
}

export function findTriangles(lines) {
  const triangles = [];
  if (lines.length < 3) return false;
  const merged_lines = mergeLines(lines);
  for (let i = 0; i < merged_lines.length - 2; i++) {
    for (let j = i + 1; j < merged_lines.length - 1; j++) {
      for (let k = j + 1; k < merged_lines.length; k++) {
        const p11 = merged_lines[i].start;
        const p12 = merged_lines[i].end;
        const p21 = merged_lines[j].start;
        const p22 = merged_lines[j].end;
        const p31 = merged_lines[k].start;
        const p32 = merged_lines[k].end;
        let points = [p11, p12, p21, p22, p31, p32];

        // from the 6 points, there should be 3 pairs of equal points
        points = removeDuplicates(points);

        if (pointsAreTriangle(points)) triangles.push(points);
      }
    }
  }
  return triangles;
}
