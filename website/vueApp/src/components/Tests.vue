<template>
  <div class="tests">
    <ul>
      <li v-for="test in tests" :key="test.key">
        <button v-on:click="startTest(test.key)">Start test: {{test.txt}}</button>
      </li>
    </ul>
    <h3>Test results:</h3>
    <div class="results">
      <div v-if="results.length > 0">{{ numberOfCorrectTests }}/{{ results.length }} tests correct.</div>
      <ol>
        <li v-for="result in results" :key="result.id" v-bind:class="[result.correct ? 'correctClass' : 'wrongClass']">
          <div>{{ result.msg }}</div>
        </li>
      </ol>
    </div>
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
          {key: 0, txt: 'Mad hatter test'},
          {key: 1, txt: 'Vierkant test'}
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
        this.$emit('test-ended', scratch.sprites.print());
      }
    }
  }
</script>

<style>

  .correctClass {
    position: relative;
    display: block;
    padding: .4em .4em .4em 2em;
    margin: .5em 0;
    background: #93C775;
    color: #000;
    border-radius: 10em;
  }

  .wrongClass {
    position: relative;
    display: block;
    padding: .4em .4em .4em 2em;
    margin: .5em 0;
    background: #FF3333;
    color: #000;
    border-radius: 10em;
  }

</style>
