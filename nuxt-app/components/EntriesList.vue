<template>
  <div class="entries"> 
    <div v-for="entry in entries" v-bind:key="entry.id">
      <Entry :entry="entry"></Entry>
    </div>
  </div>
</template>

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
      }
    }
  }
</script>