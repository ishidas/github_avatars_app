<template>
  <section>
    <!-- <ul> -->
      <!-- <li > -->
        <!-- <div class="">
          {{repo.avatar_url}}
        </div> -->
        <b-container fluid class="p-4 bg-dark">
          <b-row>
            <b-col sm="1" v-for="repo in repositories">
              <b-img thumbnail fluid width="50" height="50" :src="repo.avatar_url"  alt="" />
            </b-col>
          </b-row>

      </b-container>
      <!-- </li> -->

    <!-- </ul> -->
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
