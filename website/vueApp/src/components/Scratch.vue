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
    <div v-for="(stage,key) in stages">
      <canvas :id="stage" v-if="key === index || key === index - 1"></canvas>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'Scratch',
    data() {
      return {
        file: null,
        stages: ['stage0'],
        index: 0,
        first: true
      }
    },
    methods: {
      processFile(event) {
        this.$judge.loadFile(event, document.getElementById(this.stages[this.index]));
        this.$emit('scratch-loaded');
        this.index++;
        this.stages.push('stage'+this.index);

      }
    }
  }
</script>

<style scoped>

</style>
