<template>
  <div>
    <div>
        <div class="toolbar"><div class="toolbar__center">{{ label }}</div></div>
        <EntriesList :entries="entries"></EntriesList>
    </div>
  </div>
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