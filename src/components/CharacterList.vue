<template>
  <div>
    <div
      id="charactersPagination"
      :search="search"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <div class="mt-5 pt-4 mx-2 d-flex justify-content-center">
        <input
          class="form-control"
          style="max-width: 90vw;"
          type="text"
          name="busca"
          v-model="searchTerm"
          placeholder="Search"
          autocomplete="off"
        />
      </div>
      <b-pagination
        pills
        v-if="search.length > 0"
        class="d-flex justify-content-center mt-3"
        v-model="currentPage"
        :total-rows="search.length"
        :per-page="perPage"
        aria-controls="charactersPagination"
      ></b-pagination>

      <b-row class="m-0 p-0">
        <b-card-group
          class="col col-lg-3 d-flex justify-content-center"
          v-for="item in search.slice(
            perPage * (currentPage - 1),
            perPage * currentPage
          )"
          :key="item.id"
          :id="item.id"
        >
          <b-card
            class="mx-1 px-0 my-3"
            :img-src="item.thumbnail.path + '.' + item.thumbnail.extension"
            img-width="150"
            img-height="150"
            img-fluid
            style="width: 150px; max-width: 150px; background-color: #212529;"
            :img-alt="item.name"
            img-top
          >
            <b-card-text>
              {{ item.name }}
            </b-card-text>
            <template #footer>
              <router-link :to="`/details?id=${item.id}`">
                + See more
              </router-link>
            </template>
          </b-card>
        </b-card-group>
      </b-row>

      <b-pagination
        pills
        v-if="search.length > 0"
        class="d-flex justify-content-center mt-3 pb-5 mb-0"
        v-model="currentPage"
        :total-rows="search.length"
        :per-page="perPage"
        aria-controls="charactersPagination"
      ></b-pagination>

      <div
        v-if="isLoading"
        class="d-flex flex-column align-items-center justify-content-center"
        style="position: fixed; inset: 0; width: 100vw; height: 100vh; margin: auto; background-color: #3a3d40; z-index: 999;"
      >
        <div>
          <p>Loading, please wait...</p>
        </div>

        <div style="width: 90%; background-color: grey;">
          <div
            id="loadingProgress"
            style="width: 1%; max-width: 100%; height: 30px; background-color: #0F6DFD;"
          ></div>
        </div>
      </div>
    </div>
    <BottomBar />
  </div>
</template>

<script>
import * as axios from "axios";
import BottomBar from "./BottomBar";

export default {
  name: "CharacterList",
  components: {
    BottomBar,
  },

  data() {
    return {
      isLoading: false,
      results: [],
      search: [],
      offset: 0,
      perPage: 24,
      currentPage: 1,
      searchTerm: "",
    };
  },

  watch: {
    searchTerm: {
      handler: function() {
        setTimeout(() => {
          this.searchFor(this.searchTerm);
        }, 500);
      },
      deep: true,
    },
  },

  mounted() {
    this.loadCharacters();
  },

  methods: {
    searchFor(term) {
      this.search = this.results.filter(function(item) {
        return item.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase()
          .includes(
            term
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toUpperCase()
          );
      });
    },

    loadCharacters() {
      this.isLoading = true;
      axios
        .get("https://martelotte.com/key.php")
        .then((key) => {
          axios
            .get(
              "http://gateway.marvel.com/v1/public/characters?apikey=" +
                key.data +
                "&limit=100"
            )
            .then((res) => {
              this.results.push(...res.data.data.results);
              this.search = this.results;
              this.offset = 100;
              const axiosRecursive = () => {
                axios
                  .get(
                    "http://gateway.marvel.com/v1/public/characters?apikey=" +
                      key.data +
                      "&limit=100&offset=" +
                      this.offset
                  )
                  .then((res) => {
                    this.results.push(...res.data.data.results);
                    this.search = this.results;
                    this.offset += 100;
                    if (res.data.data.results.length > 0) {
                      var elem = document.getElementById("loadingProgress");
                      elem.style.width =
                        ((this.offset / res.data.data.total) * 100).toString() +
                        "%";
                      return axiosRecursive();
                    } else {
                      this.isLoading = false;
                      // after all calls ends you can do something with the
                      // whole data here before finishing the function...
                    }
                  })
                  .catch((err) => console.log(err));
              };
              axiosRecursive();
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style>
.page-item.active .page-link {
  background-color: #212529;
  border-color: #fff;
}

.page-link {
  color: #000;
}
</style>
