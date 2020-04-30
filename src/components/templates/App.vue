<template>
  <div
    id="app"
    class="app"
  >
    <div
      class="app__header"
      :class="{'app__header--hidden': !showHeader}"
    >
      <div class="app-header__title-container">
        <h1 class="app-header__title">{{ title }}</h1>
        <p class="app-header__sub-title">{{ subTitle }}</p>
      </div>
      <!-- <div class="app-header__menu"></div> -->
    </div>
    <div class="app__body">
      <slot />
    </div>
    <div
      class="app__footer"
      :class="{'app__footer--hidden': !showFooter}"></div>
  </div>
</template>

<script>
export default {
  name: 'AppTemplate',
  components: {},
  mixins: [],
  props: {
    title: {
      type: String,
      default: 'Puppy Time'
    },
    subTitle: {
      type: String,
      default: null
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({}),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {},
  methods: {},
  directives: {},
  filters: {},
}
</script>

<style lang="scss">
$header-height: 75px;
$footer-height: 75px;

$menu-size: 100px;

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: grid;
  grid-template-areas:  "header"
                        "main"
                        "footer";
  grid-template-rows: auto 1fr auto;

  width: 100%;
  height: 100vh;

  &__header {
    grid-area: header;
    height: $header-height;
    display: grid;
    grid-template-columns: $menu-size 1fr $menu-size;
    grid-template-rows: auto;
    grid-template-areas: "void title menu";
    background: var(--color-blue);
    border-bottom: 1px solid var(--color-blue);
  }
  &__body {
    grid-area: main;
    background: var(--color-sky-blue);
    padding: 1rem;
  }
  &__footer {
    grid-area: footer;
    height: $footer-height;
    background: var(--color-blue);
    border-top: 1px solid var(--color-blue);
  }

  &__header, &__footer {
    opacity: 1;
    overflow: hidden;
    transition: all var(--duration-normal);
    &--hidden {
      height: 0px;
      opacity: 0;
    }
  }
}

.app-header {
  &__title-container {
    grid-area: title;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--color-white);
  }
  &__title {
    font-size: 1.5rem;
  }
  &__sub-title {
    font-size: 0.75rem;
  }
  &__menu {
    grid-area: menu;
    background-color: var(--color-blue);
  }
}
</style>
