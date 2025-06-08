<template>
  <div class="activity-guests">
    <div class="guests-grid">
      <div class="guest-card" v-for="(guest, index) in guests" :key="index">
        <div class="guest-avatar">
          <img :src="guest.thumb" :alt="guest.name" />
        </div>
        <div class="guest-info">
          <div class="guest-name">{{ guest.title }}</div>
          <div class="guest-position">{{ guest.info }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActivityGuests",
  props: {
    guests: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      defaultGuests: [
      ],
    };
  },
};
</script>

<style scoped lang="less" src="./activeityGuests.less"></style>
