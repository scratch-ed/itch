<template>
  <div class="log" v-if="testsEnded">
    <button v-if="hideLog" v-on:click="hideLog = !hideLog">Show log</button>
    <div v-else>
      <b-table striped small :items="scratch" :fields="fields">
        <template slot="sprites" slot-scope="data">
          <b-table small :items="data.item.sprites"/>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Log",
    props: ['testsEnded', 'scratch'],
    data() {
      return {
        hideLog: true,
        fields: [{
          key: "time",
          label: "Time",
        }, {
          key: "block",
          label: "Block",
        }, {
          key: "sprites",
          label: "Sprites",
        }]
      }
    }
  }
</script>

<style scoped>

</style>

<style>
  .hidden_header {
    display: none;
  }
</style>
