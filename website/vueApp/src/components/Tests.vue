<template>
  <div class="tests">
    <ul>
      <li v-for="test in tests" :key="test">
        <button onclick="mocha.run()">Start test: {{test}}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import * as madHatterTest from '../../test/browser-mad-hatter-test.js'


export default {
  name: 'Tests',
  data() {
    return {
      tests: [
        'Mad hatter test',
        'Vierkant test'
      ]
    }
  }
}
</script>

<style scoped>

</style>
