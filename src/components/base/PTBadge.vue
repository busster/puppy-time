<template>
  <div class="pt-badge" v-on="$listeners">
    <template v-if="normalizedVariation === 'home'">
      <div :class="`pt-badge__${normalizedVariation}`">
        <slot />
      </div>
    </template>
    <template v-else-if="normalizedVariation === 'pet'">
      <div :class="`pt-badge__${normalizedVariation}`">
        <slot />
      </div>
    </template>
    <template v-else-if="normalizedVariation === 'human'">
      <svg height="100%" width="100%" id="canvas" viewBox="0 0 96 96">
        <polygon points="48,0 96,48 48,96 0,48" :class="`pt-badge__${normalizedVariation}`"></polygon>
      </svg>
      <div class="pt-badge__human-text">
        <slot />
      </div>
      <!-- <div :class="`pt-badge__${variation}`">
        <slot />
      </div> -->
    </template>

<!-- <polygon points="0,0 50,0 25.0,43.3" style="fill:#39bda7;stroke:#8f8f8f;stroke-width:1"></polygon> -->

  </div>
</template>

<script>
export default {
  name: 'PTBadge',
  components: {},
  mixins: [],
  props: {
    variation: {
      type: String,
      required: true,
      validator: val => val.toLowerCase().match(/human|pet|home/)
    }
  },
  data: () => ({}),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {
    normalizedVariation () {
      return this.variation.toLowerCase()
    }
  },
  methods: {},
  directives: {},
  filters: {},
}
</script>

<style lang="scss">
$size: 6rem;

.pt-badge {
  position: relative;
  width: $size;
  height: $size;
  color: var(--color-white);
  font-weight: 600;
  font-size: 1.5rem;
  cursor: pointer;

  &__human {
    border-radius: 6px;
    fill: var(--color-red);
  }
  &__human-text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__home {
    height: 100%;
    width: 100%;
    background-color: var(--color-red);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__pet {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: var(--color-blue);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
