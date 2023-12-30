<template>
  <div class="grid grid-cols-2 flex-row">
    <div class="day rounded-tl-xl">Name</div>
    <div class="day rounded-tr-xl">Role</div>
  </div>
  <div>
    <div class="student_list border-b  grid grid-cols-2" v-for="student in students" :key="student.id">
        <span>{{student.id}}</span>
        <span>Tutor</span>
    </div>

  </div>
</template>

<script>
export default {
  props:["course"],
  data(){
    return{
      students:[]
    }
  },

  methods:{
    fetchTutors(){
          // Define fetch URL
    const url = `http://localhost:8081/Tutor/all?course=${this.course.id}`;

    // Create a fetch promise
    const fetchPromise = fetch(url);

    // Handle the response
    fetchPromise
      .then((response) => {
        // Check if the response status is OK (200)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Parse the response JSON
        return response.json();
      })
      .then((data) => {
        // Handle the JSON data
        this.students = data
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
      });
    }
  },
  mounted(){
    this.fetchTutors()
  }
}
</script>

<style>
.student_list>span{
    @apply py-3
}

.student_list>span:nth-child(2){
    @apply text-center
}

.student_list>span:nth-child(1){
  @apply pl-3
}

.student_list>span:nth-child(3){
  @apply  pl-3
}
</style>