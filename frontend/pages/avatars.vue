<template>
  <section>
    <b-container fluid class="p-4 bg-dark">
      <b-row ref="rowcontainer">
        <b-col sm="0" v-for="repo in repositories">
          <b-img :class="{'hover-img': (mouseOverActive !== '') && (mouseOverActive === repo.login)}" @mouseover="followers && repo.followers_url ? mouseOverHandler(repo.login) : undefined" @mouseleave="mouseLeaveHandler()" thumbnail fluid width="50" height="50" :src="repo.avatar_url"  alt="github user thumbnail" />
          <div v-if="followers && (mouseOverActive === repo.login)" :class="{ 'popup-show' : (mouseOverActive === repo.login), 'popup-hide': mouseOverActive === ''}">
            <ul>
              <li v-for="follower in followers">{{follower.login}}, </li>
            </ul>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-alert variant="danger"
           dismissible
           :show="error !== undefined"
           @dismissed="error=undefined">
    Something went wrong! Sorry about that..
  </b-alert>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      repositories: [],
      followers: {},
      isMounted: false,
      error: undefined,
      mouseOverActive: '',
    }
  },
  props: ['containerArea', 'titleArea', 'error-boundary'],
  computed: {
    numberOfAvatarsToFetch() {
      if(!this.isMounted) {
        return
      }
        let rowEl = this.$refs.rowcontainer.getBoundingClientRect();
        let titleEl = this.titleArea;
      return Math.floor((this.containerArea.height - titleEl.height - 24 - 24)/50) * Math.floor((this.containerArea.width - (this.containerArea.width - rowEl.width))/50)
    }
  },
  mounted() {
    if(!this.isMounted) {
      this.init();
      return
    }
  },
  methods: {
    init() {
      this.isMounted = true;
      if(JSON.parse(localStorage.getItem('counts')) >= this.numberOfAvatarsToFetch) {
        let usersArray = JSON.parse(localStorage.getItem('users'))
        this.repositories = usersArray.slice(0, this.numberOfAvatarsToFetch)
      } else {
        this.getRepositories();
      }
    },
    getRepositories() {
      axios.get(`http://localhost:3000/users?counts=${this.numberOfAvatarsToFetch}`)
      .then( repoData  => {
        localStorage.setItem('users', JSON.stringify(repoData.data))
        localStorage.setItem('counts', JSON.stringify(repoData.data.length))
        this.repositories = repoData.data;
      })
      .catch( err => {
          if(err) {
            console.log('Errrrr ' + err);
            this.error = err
            // alert('Oops, someting went wrong..')
          }

      })
    },
    getFollowers(userLogin) {
      axios.get(`http://localhost:3000/users/${userLogin}/followers`)
      .then( repoData  => {
        localStorage.setItem(userLogin, JSON.stringify(repoData.data))
        this.followers = repoData.data
        this.mouseOverActive = userLogin
      })
      .catch( err => {
          if(err) {
            console.log(err);
            this.error = err
          }
      })
    },
    mouseOverHandler(login) {
      if(JSON.parse(localStorage.getItem(login))) {
        this.followers = JSON.parse(localStorage.getItem(login))
        this.mouseOverActive = login
      } else {
        this.getFollowers.bind(this, login).call()
      }
    },
    mouseLeaveHandler() {
      this.mouseOverActive = '';
      this.followers = {}
    }
  },
  watch: {
    mouseOverActive() {
      this.mouseOverActive = this.mouseOverActive
      this.followers = this.followers
    },
  }
}
</script>

<style lang="css">
  li {
    list-style: none;
  }
  .popup-show, .popup-hide {
    width: 20rem;
    height: auto;
    background: white;
    position: absolute;
  }
  .popup-show > ul > li {
    display: inline-block;
    list-style: none;
  }
  .popup-hide > ul > li {
    display: none;
    list-style: none;
  }
  .hover-img:hover {
    border: blue solid 2px;
  }
</style>
