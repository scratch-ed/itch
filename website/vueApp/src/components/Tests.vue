<template>
  <div class="tests">
    <b-list-group>
      <b-list-group-item v-for="(value, key) in tests" :key="key" button v-on:click="startTest(key)">
        Start test: {{value}}
      </b-list-group-item>
    </b-list-group>
    <div class="results">
      <div v-if="results.length > 0">{{ numberOfCorrectTests }}/{{ results.length }} tests correct ({{
        (numberOfCorrectTests / results.length) * 100}}%).
      </div>
      <ol>
        <li v-for="result in results" :key="result.id"
            v-bind:class="[result.correct ? 'correctClass' : 'wrongClass']">
          <div>{{ result.msg }}</div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
  import * as madHatter from '../../test/mad-hatter'
  import * as vierkant from '../../test/vierkant'
  import * as moveUntilSpace from '../../test/moveUntilSpace'
  import * as costumeOnSpace from '../../test/costumeOnSpace'
  const tests = [
    madHatter,
    vierkant,
    moveUntilSpace,
    costumeOnSpace
  ];
  export default {
    name: 'Tests',
    props: ['scratchJudge'],
    data() {
      return {
        tests: [
          'Mad hatter test',
          'Vierkant test',
          'Move until space test',
          'Costume change test'
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
    padding: .4em 2em .4em 2em;
    margin: .5em 0;
    background: #93C775;
    color: #000;
    border-radius: 10em;
  }

  .wrongClass {
    position: relative;
    display: block;
    padding: .4em 2em .4em 2em;
    margin: .5em 0;
    background: #FF3333;
    color: #000;
    border-radius: 10em;
  }

</style>
