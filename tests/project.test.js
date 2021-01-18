import {Project} from "../scratch/judge/project.js";

function project(...names) {
    return new Project({
        targets: names.map(n => {
            return {
                name: n
            }
        }),
        extensions: []
    });
}

test('hasRemovedSprites', () => {
    expect(project("Test1", "Test2").hasRemovedSprites(project("Test1"))).toBe(true);
    expect(project("Test1").hasRemovedSprites(project("Test1"))).toBe(false);
    expect(project("Test1").hasRemovedSprites(project("Test1", "Test2"))).toBe(false);
    expect(project().hasRemovedSprites(project())).toBe(false);
    expect(project("Test1").hasRemovedSprites(project())).toBe(true);
    expect(project().hasRemovedSprites(project())).toBe(false);
})

test('hasAddedSprites', () => {
    expect(project("Test1", "Test2").hasAddedSprites(project("Test1"))).toBe(false);
    expect(project("Test1").hasAddedSprites(project("Test1"))).toBe(false);
    expect(project("Test1").hasAddedSprites(project("Test1", "Test2"))).toBe(true);
    expect(project().hasAddedSprites(project())).toBe(false);
    expect(project("Test1").hasAddedSprites(project())).toBe(false);
    expect(project().hasAddedSprites(project())).toBe(false);
})


// test('hasAddedSprites', () => {
//     const json1 = {
//         targets: [{
//             name: "Test1"
//         }, {
//             name: "Test2"
//         }]
//     }
//
//     const project = new Project(json1);
//     const project2 = new Project({
//         targets: [{name: "Test1"}]
//     });
//     const project3 = new Project(json1);
//     const project4 = new Project({
//         targets: [
//             {name: "Test1"}, {name: "Test2"}, {name: "Test3"}
//         ]
//     })
//
//     expect(project.hasAddedSprites(project2)).toBe(true);
//     expect(project.hasAddedSprites(project3)).toBe(false);
//     expect(project.hasAddedSprites(project4)).toBe(false);
// })
