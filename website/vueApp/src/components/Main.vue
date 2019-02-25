<template>
  <div class="main">
    <h1>Scratch 3.0 Judge</h1>
    <hr/>
    <b-container>
      <b-row>
        <b-col>
          <scratch v-on:scratch-loaded="onShow()"></scratch>
        </b-col>
        <b-col>
          <log :testsEnded="testsEnded" :scratch="scratch"></log>
        </b-col>
      </b-row>
    </b-container>
    <hr/>
    <tests :scratch="scratch" v-if="showTests" @test-ended="onEndedTests"></tests>
  </div>
</template>

<script>
  import Scratch from './Scratch'
  import Tests from './Tests'
  import Log from './Log'

  export default {
    name: 'Main',
    components: {
      Scratch,
      Tests,
      Log
    },
    data() {
      return {
        scratch: {},
        showTests: false,
        testsEnded: false
      }
    },
    methods: {
      onShow() {
        this.showTests = true;
      },
      onEndedTests(e) {
        this.testsEnded = true;
        this.scratch = e;
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
