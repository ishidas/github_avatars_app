<template>
  <section>
    <ul>
      <li v-for="repo in repositories">
        <!-- <div class="">
          {{repo.avatar_url}}
        </div> -->
        <img :src="repo.avatar_url"  alt="" />
      </li>

    </ul>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      repositories: [],
    }
  },
  mounted() {
    console.log('hitting 1');
    this.getRepositories();
  },
  methods: {
    getRepositories() {
      axios.get('http://localhost:3000/users')
      .then( repoData  => {
        console.log('hitting 2');
        console.log(JSON.stringify(repoData.data));
        this.repositories = repoData.data;
      })
      .catch( err => {
          if(err) console.log(err);
      })
    }
  }
}
</script>

<style lang="css">
</style>
