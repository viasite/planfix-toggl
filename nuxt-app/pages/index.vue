<template>
  <div>
    <v-ons-tabbar position="auto" swipeable :index.sync="index" :visible="true">
      <template slot="pages">
        <EntriesPage v-for="tab in tabs" 
          v-bind:key="tab.label" 
          :entries="tab.props.entries" 
          :label="tab.label"
        ></EntriesPage>
      </template>
      
      <v-ons-tab v-for="tab in tabs" 
        v-bind:key="tab.label" 
        :label="tab.label + ' (' + tab.props.entries.length + ')'"
      ></v-ons-tab>
    </v-ons-tabbar> 
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
      let asyncData
      try {
        asyncData = {
          entries_today: await app.$axios.$get('http://localhost:3000/api/v1/toggl/entries', { params: {type:'today'} }),
          entries_pending: await app.$axios.$get('http://localhost:3000/api/v1/toggl/entries', { params: {type:'pending'} }),
          entries_last: await app.$axios.$get('http://localhost:3000/api/v1/toggl/entries', { params: {type:'last'} }),
        }
        asyncData.tabs = [
          { label: 'Сегодня', props: { entries: asyncData.entries_today } },
          { label: 'Ожидают', props: { entries: asyncData.entries_pending } },
          { label: 'Последние', props: { entries: asyncData.entries_last } },
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
        get(){ 
          return this.$store.state.tabIndex
        },
        set(newValue){
          this.$store.commit('tabIndex', newValue)
        }
      }
    }
  }
</script>
