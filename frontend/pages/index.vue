<template lang="html">
  <section class="outer-container" ref="sectionelement">
    <h1 ref="titleelement">Github Avatar</h1>
    <avatars v-if="containerArea" :containerArea="containerArea" :titleArea="titleArea"/>
  </section>
</template>

<script>
import Avatars from './avatars.vue'

export default {
  components: {
    Avatars
  },
  data() {
    return {
      isMounted: false
    }
  },
  computed: {
    containerArea() {
      if(!this.isMounted)
        return
      return  this.$refs.sectionelement.getBoundingClientRect();
    },
    titleArea() {
      if(!this.isMounted)
        return
      return  this.$refs.titleelement.getBoundingClientRect();
    }
  },
  mounted() {
    this.isMounted = true;
  }
}
</script>

<style lang="css">
  html, body {
    width: 100%;
    height: 100%;
  }
  .outer-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
