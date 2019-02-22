<template>
  <div class="tests">
    <ul>
      <li v-for="test in tests" :key="test">
        <button v-on:click="startTest()">Start test: {{test}}</button>
      </li>
    </ul>
  </div>
</template>

<script>
  //import * as madHatterTest from '../../test/browser-mad-hatter-test'

  export default {
    name: 'Tests',
    data() {
      return {
        tests: [
          'Mad hatter test',
          'Vierkant test'
        ]
      }
    },
    methods: {
      startTest() {
        let result = this.$judge.getResult();
        result.madHatter();
        //madHatterTest.run();
      }
    }
  }
</script>

<style scoped>

</style>
