<template>
  <div class="tests">
    <ul>
      <li v-for="test in tests" :key="test">
        <button v-on:click="startTest()">Start test: {{test}}</button>
      </li>
    </ul>
    <p>{{ result }}</p>
  </div>
</template>

<script>
  import * as madHatter from '../../test/mad-hatter'

  export default {
    name: 'Tests',
    data() {
      return {
        tests: [
          'Mad hatter test',
          'Vierkant test'
        ],
        result: "..."
      }
    },
    methods: {
      async startTest() {
        let scratch = this.$judge.getScratch();
        console.log(scratch);
        this.result = await madHatter.run(scratch);
        console.log(this.result);
      }
    }
  }
</script>

<style scoped>

</style>
