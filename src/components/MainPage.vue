<template>
  <div id="app">
    <NavBar />
    <CharacterList />
  </div>
</template>

<script>
import CharacterList from './CharacterList.vue'
import NavBar from "./NavBar"

export default {
  name: 'MainPage',
  components: {
    CharacterList,
    NavBar
  }
}
</script>

