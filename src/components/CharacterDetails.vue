<template>
  <div style="min-height: 100vh">
    <div class="d-flex justify-content-center mt-4 pt-4">
      <NavBar />
      <div class="card mx-1 my-5 p-0" style="background-color: #212529;">
        <img
          :src="
            character.data.data.results[0].thumbnail.path +
              '.' +
              character.data.data.results[0].thumbnail.extension
          "
          class="image"
        />
        <h2>{{ character.data.data.results[0].name }}</h2>
        <div class="d-flex justify-content-center">
          <h5 style="max-width: 700px">
            {{ character.data.data.results[0].description }}
          </h5>
        </div>
        <br />
        <div
          class="m-3"
          v-if="character.data.data.results[0].stories.available > 0"
          style="text-align: left;"
        >
          <h3>Stories:</h3>
          <ul style="max-width: 700px">
            <li
              v-for="item in character.data.data.results[0].stories.items"
              :key="item.resourceURI"
              :id="item.resourceURI"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div
          class="m-3"
          v-if="character.data.data.results[0].events.available > 0"
          style="text-align: left;"
        >
          <h3>Events:</h3>
          <ul style="max-width: 700px">
            <li
              v-for="item in character.data.data.results[0].events.items"
              :key="item.resourceURI"
              :id="item.resourceURI"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div
          class="m-3"
          v-if="character.data.data.results[0].series.available > 0"
          style="text-align: left;"
        >
          <h3>Series:</h3>
          <ul style="max-width: 700px">
            <li
              v-for="item in character.data.data.results[0].series.items"
              :key="item.resourceURI"
              :id="item.resourceURI"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="isLoading"
        class="d-flex flex-column salign-items-center justify-content-center"
        style="position: fixed; inset: 0; width: 300px; height: 300px; margin: auto; background-color: #3a3d40; border-radius: 25px;"
      >
        <div>
          <b-spinner variant="primary"></b-spinner>
        </div>
        <div>
          <p>Loading, please wait...</p>
        </div>
      </div>
    </div>
    <BottomBar />
  </div>
</template>

<script>
import * as axios from "axios";
import NavBar from "./NavBar";
import BottomBar from "./BottomBar";

export default {
  name: "CharacterDetails",
  components: {
    NavBar,
    BottomBar,
  },
  data() {
    return {
      isLoading: false,
      character: {
        data: {
          data: {
            results: [
              {
                id: 0,
                name: "",
                description: "",
                modified: "",
                thumbnail: {
                  path: "",
                  extension: "",
                },
                resourceURI: "",
                series: {
                  available: 0,
                  collectionURI: "",
                  items: [],
                },
                events: {
                  available: 0,
                  collectionURI: "",
                  items: [],
                },
                stories: {
                  available: 0,
                  collectionURI: "",
                  items: [],
                },
              },
            ],
          },
        },
      },
    };
  },

  watch: {
    "$route.query.id": {
      handler: function() {
        this.loadCharacterDetails();
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    loadCharacterDetails() {
      if (typeof this.$route.query.id !== "undefined") {
        this.isLoading = true;
        axios
          .get("https://martelotte.com/key.php")
          .then((key) => {
            axios
              .get(
                "http://gateway.marvel.com/v1/public/characters/" +
                  this.$route.query.id +
                  "?apikey=" +
                  key.data
              )
              .then((res) => {
                console.log(res);
                this.character = res;
                this.isLoading = false;
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    },
  },
};
</script>

<style>
@media (min-width: 900px) {
  .image {
    width: 800px;
    height: 800px;
    object-fit: cover;
    object-position: 0px 0px;
  }
}
</style>
