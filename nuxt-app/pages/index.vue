<template>
  <v-ons-page>
    <div class="toolbar"><div class="toolbar__center">Сегодня:</div></div>
    <EntriesList :entries="entries_today"></EntriesList>

    <div class="toolbar"><div class="toolbar__center">Ожидают отправки:</div></div>
    <EntriesList :entries="entries_pending"></EntriesList>

    <div class="toolbar"><div class="toolbar__center">Последние:</div></div>
    <EntriesList :entries="entries_last"></EntriesList>
  </v-ons-page>
</template>

<style>
  ons-page > .page__content{
    max-width: 600px;
    margin: 0 auto;
  }
</style>

<script>
  import EntriesList from '~/components/EntriesList'

  export default {
    components: {
      EntriesList
    },
    async asyncData ({ app, store, params, query, error }) {
      const asyncData = {};
      try {
        asyncData.entries_today = await app.$axios.$get('http://localhost:3000/api/toggl/entries', { params: {type:'today'} });
        asyncData.entries_pending = await app.$axios.$get('http://localhost:3000/api/toggl/entries', { params: {type:'pending'} });
        asyncData.entries_last = await app.$axios.$get('http://localhost:3000/api/toggl/entries', { params: {type:'last'} });
      } catch (e) {
        throw Error(e)
      }
      return asyncData
    }
  }
</script>
