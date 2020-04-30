<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    class="pt-button"
    :class="[`pt-button--${variation}`]"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'PTButton',
  components: {},
  mixins: [],
  props: {
    variation: {
      type: String,
      default: 'primary',
      validator: val => val.match(/primary|secondary|link/)
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
.pt-button {
  display: inline-block;
  border: none;
  padding: 1rem 2rem;
  margin: 0;
  text-decoration: none;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  text-align: center;
  transition: background-color 250ms ease-in-out, transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  &:focus {
    outline: 0;
  }
  &--primary {
    border-radius: var(--border-rounded--small);
    background-color: var(--color-blue);
    color: var(--color-white);
    &:hover {
      background-color: var(--color-blue-darker);
    }
    &:active {
      background-color: var(--color-blue-darkest);
    }
  }
  &--link {
    padding: 0;
    background: transparent;
    color: var(--color-blue);
    &:hover {
      color: var(--color-blue-darker);
    }
    &:active {
      color: var(--color-blue-darkest);
    }
  }
  &--flex-link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: transparent;
    color: var(--color-blue);
    &:hover {
      color: var(--color-blue-darker);
    }
    &:active {
      color: var(--color-blue-darkest);
    }
    & > *:nth-child(n + 2) {
      margin-left: 0.25rem;
    }
  }
}
</style>
