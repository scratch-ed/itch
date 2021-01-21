import Project from './project';
import { ScratchSimulationEvent } from './scratchSimulationEvent';
import { Log, searchFrames, LogFrame, LogEvent } from './log';
import { makeProxiedRenderer } from './renderer';
import { numericEquals } from './utils';


window.Project = Project;
window.ScratchSimulationEvent = ScratchSimulationEvent;
window.Log = Log;
window.makeProxiedRenderer = makeProxiedRenderer;
window.numericEquals = numericEquals;
window.searchFrames = searchFrames;
window.LogFrame = LogFrame;
window.LogEvent = LogEvent;