<template>
  <div class="main">
    <h1>Scratch 3.0 Judge</h1>
    <hr/>
    <scratch></scratch>
    <hr/>
    <tests></tests>
    <hr/>
    <result></result>
  </div>
</template>
<script>

import Scratch from './Scratch'
import Tests from './Tests'
import Result from './Result'

export default {
  name: 'Main',
  components: {
    Scratch,
    Tests,
    Result
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
