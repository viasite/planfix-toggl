<template>
  <div class="entry">
    <span class="entry__group-count">{{ entry.planfix.group_count }}</span>
    <span class="entry__name">{{ entry.description }}</span>
    <span class="entry__duration">{{ (entry.dur / 1000 / 60) | round }}</span>
    <div class="entry__second">
      <span class="entry__project" :style="'color:' + entry.project_hex_color">{{ entry.project }}</span>
      <a v-if="entry.planfix.task_id" class="entry__link"
         :href="'https://' + $store.state.planfixAccount + '.planfix.ru/task/' + entry.planfix.task_id"
         target="_blank">
        #{{ entry.planfix.task_id }}
      </a>
    </div>
  </div>
</template>

<style>
  .entry {
    margin-bottom: 3px;
    padding: 8px;
    background: #fff;
  }
  .entry__name {
    /*display: block;*/
  }
  .entry__duration {
    color: #666;
    margin-left: 1rem;
    float: right;
  }
  .entry__group-count {
    color: #999;
    display: inline-block;
    width: 2rem;
  }
  .entry__second {
    margin-left: 2rem;
  }
  .entry__project {
  }
  .entry__link {
    color: #4573b1;
    text-decoration: none;
    font-size: 0.9rem;
    margin-left: 1rem;
  }
</style>

<script type="text/javascript">
  export default {
    props: {
      entry: {
        type: Object,
        required: true
      }
    },
    filters: {
      round: value => Math.round(value)
    }
  }
</script>