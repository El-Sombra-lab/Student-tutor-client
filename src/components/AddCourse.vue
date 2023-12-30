<template>
  <div class="py-4 w-72">
      <div v-if="info" class="bg-red-50 p-2 rounded text-center mb-1">
              {{ info }} 
      </div>
      <form >
            <h1 class="text-center font-bold mb-4">Add a course</h1>
            <label for="course_name" class="text-sm mb-1 pl-0 text-gray-600" >COURSE NAME:</label>
            <input type="text" class="focus:border-[#1577ea]" v-model="course_name">
            <label for="course_id" class="text-sm mb-1 pl-0 text-gray-600">COURSE ID:</label>
            <input type="text" class="focus:border-[#1577ea]" v-model="course_id">
            <div class="priv_btns grid grid-cols-2 gap-6 mt-6">
                <div class="form_submit text-center" @click="addCourse">Save</div>
                <div class="form_submit text-center bg-white text-black" @click="toggleModal">Cancel</div>
            </div>
        </form>
  </div>
</template>

<script>
export default {
  data(){
    return{
      course_id:"",
      course_name:"",
      info:""
    }
  },
  methods:{
    addCourse(){
      
      console.log("dwedwe");
      if (!this.course_id  || !this.course_name){
          this.info = "Venue name and capacity should not be empty!"
          return;
      }
      if (!(/^[A-Z]{3}\d{4}[A-Z]$/.test(this.course_id))){
          this.info = "Invalid input for coure id!"
          return;
      }
      fetch(`http://localhost:8081/Course/add?id=${this.course_id}&name=${this.course_name}`,{method:'POST'})
          .then(response => {

              // Check if the response status is OK (200)
              if (!response.ok) {throw new Error('Network response was not ok');}
          })
          .then(data => { console.log(data)})
          .catch(error => {
              // Handle any errors that occurred during the fetch
              console.error('Fetch error:', error);
      });
                
        },
  }
}
</script>

<style>

</style>