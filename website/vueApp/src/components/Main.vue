<template>
  <div class="main">
    <h1>Scratch 3.0 Judge</h1>
    <hr/>
    <scratch v-on:scratch-loaded="onShow()"></scratch>
    <hr/>
    <tests v-if="showTests"></tests>
  </div>
</template>
<script>

import Scratch from './Scratch'
import Tests from './Tests'

export default {
  name: 'Main',
  components: {
    Scratch,
    Tests
  },
  data() {
    return {
      showTests: false
    }
  },
  methods: {
    onShow() {
      this.showTests = true;
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
