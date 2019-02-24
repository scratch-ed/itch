<template>
  <div class="tests">
    <ul>
      <li v-for="test in tests" :key="test.key">
        <button v-on:click="startTest(test.key)">Start test: {{test.txt}}</button>
      </li>
    </ul>
    <h3>Test results:</h3>
    <div v-if="results.length > 0">{{ numberOfCorrectTests }}/{{ results.length }} tests correct.</div>
    <ul>
      <li v-for="result in results" :key="result.id">
        <div v-bind:class="[result.correct ? 'correctClass' : 'wrongClass']">{{ result.msg }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
  import * as madHatter from '../../test/mad-hatter'
  import * as vierkant from '../../test/vierkant'

  const tests = [
    madHatter,
    vierkant
  ];

  export default {
    name: 'Tests',
    data() {
      return {
        tests: [
          {key: 0, txt:'Mad hatter test'},
          {key: 1, txt:'Vierkant test'}
        ],
        results: [],
        numberOfCorrectTests: 0
      }
    },
    methods: {
      async startTest(key) {
        let scratch = this.$judge.getScratch();
        let t = await tests[key].run(scratch);
        this.results = t.tests;
        this.numberOfCorrectTests = t.numberOfCorrectTests;
      }
    }
  }
</script>

<style lang="css">
  .correctClass {
    background-color: green;
  }

  .wrongClass {
    background-color: red;
  }

</style>
