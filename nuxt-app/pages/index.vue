<template>
  <div>
    <!--<v-ons-tabbar position="auto" :index.sync="index" :visible="true">-->
      <EntriesPage v-for="tab in tabs" 
        v-bind:key="tab.label" 
        :entries="tab.props.entries" 
        :label="tab.label"
      ></EntriesPage>
      <!--<v-ons-tab v-for="tab in tabs" 
        v-bind:key="tab.label" 
        :entries="tab.entries" 
        :label="tab.label"
      ></v-ons-tab>-->
    <!--</v-ons-tabbar>-->
  </div>
</template>

<script>
  import EntriesList from '~/components/EntriesList'
  import EntriesPage from '~/pages/EntriesPage'

  export default {
    components: {
      EntriesPage,
      EntriesList
    },
    async asyncData ({ app, store, params, query, error }) {
      const asyncData = {};
      try {
        asyncData.entries_today = await app.$axios.$get('http://localhost:3000/api/toggl/entries', { params: {type:'today'} });
        asyncData.entries_pending = await app.$axios.$get('http://localhost:3000/api/toggl/entries', { params: {type:'pending'} });
        asyncData.entries_last = await app.$axios.$get('http://localhost:3000/api/toggl/entries', { params: {type:'last'} });
        asyncData.index = 0;
        //console.log(asyncData.entries_today)
        asyncData.tabs = [
          { label: 'Сегодня', /*page: EntriesPage, */props: { entries: asyncData.entries_today } },
          { label: 'Ожидают отправки', /*page: EntriesPage, */props: { entries: asyncData.entries_pending } },
          { label: 'Последние', /*page: EntriesPage, */props: { entries: asyncData.entries_last } },
        ]
        //console.log(asyncData.tabs);
      } catch (e) {
        console.log('error while get data')
        throw Error(e)
      }
      return asyncData;
    },
    computed: {
      index: {
        get: () => 1, //this.$store.state.tabbar.index,
        set: newValue => true //this.$store.commit('tabbar/set', newValue)
      }
    }
  }
</script>
