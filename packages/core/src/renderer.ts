/* Copyright (C) 2019 Ghent University - All Rights Reserved */
import ScratchRender from 'scratch-render';
import { Event, Log } from './log';

interface BaseMethods {
  // eslint-disable-next-line
  createTextSkin: Function;
  // eslint-disable-next-line
  updateTextSkin: Function;
  // eslint-disable-next-line
  destroySkin: Function;
}

interface PenExtensionMethods {
  // eslint-disable-next-line
  penLine: Function;
  // eslint-disable-next-line
  penPoint: Function;
  // eslint-disable-next-line
  penClear: Function;
}

export type RendererMethods = BaseMethods & PenExtensionMethods;

/**
 * Intercept events from pen extension.
 *
 * @param {Log} log - The vm to intercept info from.
 * @param {ScratchRender} renderer - Renderer
 *
 * @see https://en.scratch-wiki.info/wiki/Pen_Extension
 */
function interceptPen(log: Log, renderer: ScratchRender): PenExtensionMethods {
  console.log('Intercepting pen events...');

  // Intercept lines
  const oldLine = renderer.penLine;
  renderer.penLine = new Proxy(oldLine, {
    apply: function (target, thisArg, argumentsList) {
      const p1 = { x: argumentsList[2], y: argumentsList[3] };
      const p2 = { x: argumentsList[4], y: argumentsList[5] };
      const line = { start: p1, end: p2 };
      log.renderer.lines.push(line);
      const event = new Event('renderer', {
        name: 'penLine',
        line: line,
        color: argumentsList[1].color4f,
      });
      event.snapshot = log.snap('renderer.penLine');
      log.registerEvent(event);

      return target.apply(thisArg, argumentsList);
    },
  });

  // Intercept points
  const penPointOld = renderer.penPoint;
  renderer.penPoint = new Proxy(penPointOld, {
    apply: function (target, thisArg, argumentsList) {
      const point = { x: argumentsList[2], y: argumentsList[3] };
      log.renderer.points.push(point);
      const event = new Event('renderer', {
        name: 'penPoint',
        point: point,
        color: argumentsList[1].color4f,
      });
      event.snapshot = log.snap('renderer.penPoint');
      log.registerEvent(event);

      return target.apply(thisArg, argumentsList);
    },
  });

  // Intercept clear
  const penClearOld = renderer.penClear;
  renderer.penClear = new Proxy(penClearOld, {
    apply: function (target, thisArg, argumentsList) {
      const event = new Event('renderer', {
        name: 'penClear',
        previous: {
          lines: log.renderer.lines.slice(),
          points: log.renderer.points.slice(),
        },
      });
      log.renderer.lines = [];
      log.renderer.points = [];
      event.snapshot = log.snap('renderer.penClear');
      log.registerEvent(event);

      return target.apply(thisArg, argumentsList);
    },
  });

  return {
    penLine: oldLine,
    penPoint: penPointOld,
    penClear: penClearOld,
  };
}

/**
 * Create a proxied renderer, allowing us to intercept various stuff.
 *
 * @param log - The context.
 * @param render - The canvas where the renderer should work.
 */
export function proxiedRenderer(log: Log, render: ScratchRender): RendererMethods {
  console.log('renderer created');

  const oldPenMethods = interceptPen(log, render);

  // text bubble creation
  const createTextSkinOld = render.createTextSkin;
  render.createTextSkin = new Proxy(createTextSkinOld, {
    apply: function (target, thisArg, argumentsList) {
      const skinId = target.apply(thisArg, argumentsList);

      log.renderer.responses.push(argumentsList[1]);
      const event = new Event('renderer', {
        id: skinId,
        name: 'createTextSkin',
        text: argumentsList[1],
      });
      event.snapshot = log.snap('renderer.createTextSkin');
      log.registerEvent(event);

      return skinId;
    },
  });

  const updateTextSkinOld = render.updateTextSkin;
  render.updateTextSkin = new Proxy(updateTextSkinOld, {
    apply: function (target, thisArg, argumentsList) {
      log.renderer.responses.push(argumentsList[2]);
      const event = new Event('renderer', {
        name: 'updateTextSkin',
        text: argumentsList[2],
      });
      event.snapshot = log.snap('renderer.updateTextSkin');
      log.registerEvent(event);

      return target.apply(thisArg, argumentsList);
    },
  });

  const destroySkinOld = render.destroySkin;
  render.destroySkin = new Proxy(destroySkinOld, {
    apply: function (target, thisArg, argumentsList) {
      const skinId = argumentsList[0];
      const event = new Event('renderer', {
        name: 'destroySkin',
        id: skinId,
      });
      event.snapshot = log.snap('renderer.destroySkin');
      log.registerEvent(event);

      return target.apply(thisArg, argumentsList);
    },
  });

  return {
    ...oldPenMethods,
    createTextSkin: createTextSkinOld,
    updateTextSkin: updateTextSkinOld,
    destroySkin: destroySkinOld,
  };
}

export function unproxyRenderer(render: ScratchRender, methods: RendererMethods): void {
  render.createTextSkin = methods.createTextSkin;
  render.updateTextSkin = methods.updateTextSkin;
  render.destroySkin = methods.destroySkin;
  render.penLine = methods.penLine;
  render.penPoint = methods.penPoint;
  render.penClear = methods.penClear;
}
