<template>
  <div class="scratch">
    <div class="run-form">
      <input type="file" id="file" value="">
    </div>
    <canvas id="scratch-stage"></canvas>
  </div>
</template>

<script>
import * as audio from '../../lib/audio_engine.js'
import * as renderer from '../../lib/scratch-render.js'
import * as vm from '../../lib/scratch-vm.js'
import * as storage from '../../lib/scratch-storage.js'
import * as svgRenderer from '../../lib/scratch-svg-renderer.js'

import * as profiler from '../javascript/profiler.js'
import * as proxyLib from '../javascript/proxy-library.js'
import * as simulation from '../javascript/simulation.js'
import * as simulationEvent from '../javascript/simulationEvent.js'
import * as scratchResult from '../javascript/ScratchResult.js'
import * as lines from '../javascript/testScripts/lines.js'
import * as blocks from '../javascript/testScripts/blocks.js'
import * as sprites from '../javascript/testScripts/sprites.js'
import * as colors from '../javascript/testScripts/colors.js'

export default {
  name: 'Scratch'
}
</script>

<style scoped>

</style>
