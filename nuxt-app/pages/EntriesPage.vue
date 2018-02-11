<template>
  <v-ons-page>
    <v-ons-list-header>{{ label }}</v-ons-list-header>
    <EntriesList :entries="entries"></EntriesList>
  </v-ons-page>
</template>

<script type="text/javascript">
  import EntriesList from '~/components/EntriesList'

  export default {
    components: {
      EntriesList
    },
    props: {
      entries: {
        type: Array,
        required: true
      },
      label: {
        type: String,
        required: false
      }
    }
  }
</script>