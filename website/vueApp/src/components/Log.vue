<template>
  <div class="log" v-if="testsEnded">
    <button v-on:click="onToggle(showLog)">{{ showBtnName }}</button>
    <div v-if="showLog">
      <b-container>
        <b-row>
          <b-col>
            <div v-for="value in scratch[0].sprites">
              <input type="checkbox" :id="value" :value="value.name" v-model="checkedSprites">
              <label>{{ value.name }}</label>
            </div>
          </b-col>
          <b-col>
            <div v-for="(value, key) in scratch[0].sprites[0]">
              <input type="checkbox" :id="key" :value="key" v-model="checkedInfo">
              <label>{{ key }}</label>
            </div>
          </b-col>
        </b-row>
      </b-container>

      <b-table striped small :items="scratch" :fields="fields">
        <template slot="sprites" slot-scope="data">
          <b-table thead-class="hidden_header" small :items="getSpriteLog(data.item.sprites)"/>
        </template>
      </b-table>
    </div>
  </div>
  </div>
</template>

<script>
  export default {
    name: "Log",
    props: ['testsEnded', 'scratch'],
    data() {
      return {
        showLog: false,
        showBtnName: "Show log",
        checkedInfo: [],
        checkedSprites: [],
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
    },
    methods: {
      onToggle(b) {
        this.showLog = !b;
        if (!b) this.showBtnName = "Hide log";
        else this.showBtnName = "Show log";
      },
      getSpriteLog(sprites) {
        let sortedInfo = [...this.checkedInfo].sort();
        let spriteLog = [];
        spriteLog.push(sortedInfo);
        for (let s in sprites) {
          let sprite = sprites[s];
          if (this.checkedSprites.includes(sprite.name)) {
            let entry = [];
            for (let i in sortedInfo) {
              let info = sortedInfo[i];
              entry.push(sprite[info]);
            }
            spriteLog.push(entry);
          }
        }
        return spriteLog;
      },
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
