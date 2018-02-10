<template>
  <ul class="entries">
    <li v-for="entry in entries" v-bind:key="entry.id">
      <Entry :entry="entry" :planfix-account="planfixAccount"></Entry>
    </li>
  </ul>
</template>

<style>
  .entries {
    padding: 0;
    max-width: 600px;
  }
  li{
    list-style: none;
  }
</style>

<script type="text/javascript">
  import Entry from '~/components/Entry'

  export default {
    components: {
      Entry
    },
    props: {
      entries: {
        type: Array,
        required: true
      },
      planfixAccount: {
        type: String,
        required: true
      }
    }
  }
</script>