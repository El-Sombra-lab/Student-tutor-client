<template>
  <router-view/>
</template>

<script>
import LoginView from './views/LoginView.vue';
import StudentView from './views/StudentView.vue';
export default{
  components:{LoginView,StudentView}
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
*{
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.flex-center{
  @apply flex justify-center items-center;
}
</style>
