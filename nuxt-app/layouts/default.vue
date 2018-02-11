<template>
  <v-ons-page>
    <ons-toolbar>
      <div class="center">{{ title }}</div>
    </ons-toolbar>
    <nuxt/>
  </v-ons-page>
</template>

<style>
  ons-page{
    max-width: 600px;
    margin: 0 auto;
  }
</style>

<script>
  export default {
    computed: {
      title: () => 'planfix-toggl'
    }
  }
</script>