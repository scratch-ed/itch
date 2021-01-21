/* Copyright (C) 2019 Ghent University - All Rights Reserved */
import ScratchRender from 'scratch-render/dist/web/scratch-render';
import { LogFrame, LogEvent } from './log';

/**
 * Intercept events from pen extension.
 *
 * @param {VirtualMachine} vm - The vm to intercept info from.
 * @param {ScratchRender} renderer - Renderer
 * @param {Log} log - Save information to this log.
 *
 * @see https://en.scratch-wiki.info/wiki/Pen_Extension
 */
function interceptPen(vm, renderer, log) {

  console.log('Intercepting pen events...');

  // Intercept lines
  const oldLine = renderer.penLine;
  renderer.penLine = new Proxy(oldLine, {
    apply: function (target, thisArg, argumentsList) {
      const p1 = { x: argumentsList[2], y: argumentsList[3] };
      const p2 = { x: argumentsList[4], y: argumentsList[5] };
      const line = { start: p1, end: p2 };
      log.renderer.lines.push(line);
      const event = new LogEvent('renderer', { name: 'penLine', line: line, color: argumentsList[1].color4f });
      event.previousFrame = new LogFrame(vm, 'penLine');
      event.nextFrame = new LogFrame(vm, 'penLineEnd');
      log.addEvent(event);

      return target.apply(thisArg, argumentsList);
    }
  });

  // Intercept points
  const penPointOld = renderer.penPoint;
  renderer.penPoint = new Proxy(penPointOld, {
    apply: function (target, thisArg, argumentsList) {

      const point = { x: argumentsList[2], y: argumentsList[3] };
      log.renderer.points.push(point);
      const event = new LogEvent('renderer', { name: 'penPoint', point: point, color: argumentsList[1].color4f });
      event.previousFrame = new LogFrame(vm, 'penPoint');
      event.nextFrame = new LogFrame(vm, 'penPointEnd');
      log.addEvent(event);

      return target.apply(thisArg, argumentsList);
    }
  });

  // Intercept clear
  // penClear
  const penClearOld = renderer.penClear;
  renderer.penClear = new Proxy(penClearOld, {
    apply: function (target, thisArg, argumentsList) {

      log.renderer.lines = [];
      log.renderer.points = [];
      const event = new LogEvent('renderer', { name: 'penClear' });
      event.previousFrame = new LogFrame(vm, 'penClear');
      event.nextFrame = new LogFrame(vm, 'penClearEnd');
      log.addEvent(event);

      return target.apply(thisArg, argumentsList);
    }
  });
}

/**
 * Create a proxied renderer, allowing us to intercept various stuff.
 *
 * @param {VirtualMachine} vm - The virtual machine.
 * @param {HTMLCanvasElement} canvas - The canvas where the renderer should work.
 * @param {Log} log - The log to save information in.
 *
 * @return {ScratchRender}
 */
export function makeProxiedRenderer(vm, canvas, log) {
  const render = new ScratchRender(canvas);
  console.log('renderer created');
  
  interceptPen(vm, render, log);

  // text bubble creation
  const createTextSkinOld = render.createTextSkin;
  render.createTextSkin = new Proxy(createTextSkinOld, {
    apply: function (target, thisArg, argumentsList) {
      const skinId = target.apply(thisArg, argumentsList);

      log.renderer.responses.push(argumentsList[1]);
      const event = new LogEvent('renderer', { id: skinId, name: 'createTextSkin', text: argumentsList[1] });
      event.previousFrame = new LogFrame(vm, 'createTextSkin');
      event.nextFrame = new LogFrame(vm, 'createTextSkinEnd');
      log.addEvent(event);

      return skinId;
    }
  });

  const updateTextSkinOld = render.updateTextSkin;
  render.updateTextSkin = new Proxy(updateTextSkinOld, {
    apply: function (target, thisArg, argumentsList) {

      log.renderer.responses.push(argumentsList[2]);
      const event = new LogEvent('renderer', { name: 'updateTextSkin', text: argumentsList[2] });
      event.previousFrame = new LogFrame(vm, 'updateTextSkin');
      event.nextFrame = new LogFrame(vm, 'updateTextSkinEnd');
      log.addEvent(event);

      return target.apply(thisArg, argumentsList);
    }
  });

  const destroySkinOld = render.destroySkin;
  render.destroySkin = new Proxy(destroySkinOld, {
    apply: function (target, thisArg, argumentsList) {
      const skinId = argumentsList[0];
      const event = new LogEvent('renderer', { name: 'destroySkin', id: skinId });
      event.previousFrame = new LogFrame(vm, 'destroySkin');
      event.nextFrame = new LogFrame(vm, 'destroySkinEnd');
      log.addEvent(event);

      return target.apply(thisArg, argumentsList);
    }
  });

  return render;
}
