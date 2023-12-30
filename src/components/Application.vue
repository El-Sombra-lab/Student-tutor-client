<template>
  <div class="flex-center pt-4 w-96">
    
    <form class="application">
      <h1 class="block text-center font-bold">Apply to Tutor a Course</h1>

          <p class="text-sm mb-3 uppercase text-gray-600">Enter marks for the courses youve taken:</p>

          <div class=" gap-1 app items-center">
            <div v-for="course in courses" :key="course.id" class="grid grid-cols-2 items-center mb-1">
              <label :for="course.id">{{course.id}}</label>
              <input type="text" :id="course.id" :ref="course.id" v-model="courseGrades[course.id]">
            </div>
          </div>

          <label for="type" class="uppercase text-gray-600 text-sm pl-0 mb-1 mt-4">Tutor or Teaching Assistant</label>
          <div class="grid grid-cols-2">
            <span>
              <input class="mr-2" type="radio" name="type" value="tutor" id="tutor" v-model="role">
              <label for="tutor">Tutor</label>
            </span>
            <span>
              <input class="mr-2" type="radio" name="type" value="TA" id="TA" v-model="role">
              <label for="TA">Teaching Assistant</label>
            </span>
          </div>
      
          <div class="priv_btns grid grid-cols-2 gap-6 mt-6">
              <div class="form_submit text-center" @click="saveApplication">Save</div>
              <div class="form_submit text-center bg-white text-black" @click="toggleModal">Cancel</div>
          </div>
    </form>
    
  </div>
</template>

<script>
export default {
  data(){
    return{
      courses:[],
      role:"",
      courseGrades: {},
      user:"",
    }
  },methods: {
      saveApplication() {
        // Create an object with the data you want to send
        const applicationData = {
          user: {
            id: this.user,
          },
          grades: Object.entries(this.courseGrades).map(([course, mark]) => ({ course, mark })), 
          role: this.role, 
        };

        // Send a POST request to the server
        fetch("http://localhost:8081/Application/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
          })
          .then(() => {
            this.$emit("close")
          })
          .catch((error) => {
            // Handle any errors that occurred during the fetch
            console.error("Fetch error:", error);
          });
      },
    },

  mounted(){
    this.user = localStorage.getItem('username')
    if (!this.user || this.user === ""){
      this.$router.push('/login');
    }

    fetch(`http://localhost:8081/Course/all`,{method:'GET'})
        .then(response => {
            // Check if the response status is OK (200)
            if (!response.ok) {throw new Error('Network response was not ok');}
            return response.json()
        })
        .then(data => { this.courses = data})
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
    });
  }
}
</script>

<style scoped>
  .app label{
    @apply uppercase pl-0 text-sm
  }

  .app input{
    @apply border-gray-300 border py-2 px-2 rounded-lg  text-sm;
  }

  .app input:focus{
    @apply outline-none border-[#1577ea];
  }
</style>