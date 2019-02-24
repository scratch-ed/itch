<template>
  <div class="scratch">
    <div class="run-form">
      <input type="file" @change="processFile($event)">
    </div>
    <canvas id="scratch-stage"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'Scratch',
    methods: {
      processFile(event) {
        this.$judge.loadFile(event, document.getElementById("scratch-stage"));
        this.$emit('scratch-loaded');
      }
    }
  }
</script>

<style scoped>

</style>
