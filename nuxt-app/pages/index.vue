<template>
  <main class="content">

    <div class="header">Сегодня:</div>
    <EntriesList :entries="entries_today" :planfix-account="settings.planfixAccount"></EntriesList>

    <div class="header">Ожидают отправки:</div>
    <EntriesList :entries="entries_pending" :planfix-account="settings.planfixAccount"></EntriesList>

    <div class="header">Последние:</div>
    <EntriesList :entries="entries_last" :planfix-account="settings.planfixAccount"></EntriesList>
  </main>
</template>

<style>
  .page__header {
    font-size: 1.4rem;
    margin-bottom: 30px;
  }
  .header {
    font-size: 1.2rem;
    margin: 10px 0;
  }
  .block {
    margin-bottom: 30px
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
        asyncData.settings = { planfixAccount: 'tagilcity' };
      } catch (e) {
        throw Error(e)
      }
      return asyncData
    }
  }
</script>
