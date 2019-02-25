<template>
  <div class="scratch">
    <div class="run-form">
      <b-form-file
        @change="processFile"
        accept=".sb3, .sb2"
        v-model="file"
        :state="Boolean(file)"
        placeholder="Choose a Scratch 3.0 project (.sb3) file... "
        drop-placeholder="Drop file here..."
      />
      <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
    </div>
    <canvas id="scratch-stage"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'Scratch',
    data() {
      return {
        file: null
      }
    },
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
