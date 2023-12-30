<template>
  <div class="py-4  pb-16 rounded flex flex-col items-center relative ">
        <span class="font-medium">Set timeline for applications</span>
        <form action="" class=" deadline justify-between my-4 rounded-lg">
            <label for="open_date" class="uppercase text-sm font-medium mb-1">Open date:</label>
            <div class="flex mb-3 gap-3 ">
                <div><input type="text" placeholder="DD" class="w-11 border" v-model="openDay"></div>
                <div><input type="text" placeholder="MM" class="w-11 border" v-model="openMonth"></div>
                <div><input type="text" placeholder="YYYY" class="w-16 border" v-model="openYear"></div>
            </div>
            <label for="close_date" class="uppercase text-sm font-medium mb-1">Close date:</label>
            <div class="flex gap-3 ">
                <div><input type="text" placeholder="DD" class="w-11 border" v-model="closeDay"></div>
                <div><input type="text" placeholder="MM" class="w-11 border" v-model="closeMonth"></div>
                <div><input type="text" placeholder="YYYY" class="w-16 border" v-model="closeYear"></div>
            </div>
            <input type="submit" value="Open Applications" class=" bg-blue-400 form_submit flex-center font-medium mt-6" @click.prevent="openApplication" :disabled="openApplications.length >0">
        </form>

        <div>Currently Open/Pending Applications</div>
        <div class="grid grid-cols-3 flex-row w-[480px]">
            <div class="day rounded-tl-xl">Department</div>
            <div class="day">Open Date</div>
            <div class="day rounded-tr-xl">Closing Date</div>
        </div>
        <div class="w-[480px]">
            <div v-for="app in openApplications" :key="app.department" class="student_list border-b  grid grid-cols-3 bg-blue-50 relative">
                <span>{{app.department}}</span>
                <span>{{ app.openDate }}</span>
                <span>{{app.dueDate}}</span>
                <img src="../assets/trash-solid.svg" alt="delete" class="w-4 absolute right-2 top-4" @click="deleteApplication">
            </div>
        </div>

                
    </div>
</template>

<script>
export default {
    data(){
        return{
            openDay:"",
            openMonth:"",
            openYear:"",
            closeDay:"",
            closeMonth:"",
            closeYear:"",
            openApplications: []
        }
    },
    methods:{
        openApplication(){
            fetch(`http://localhost:8081/OpenApplication/add?department=${encodeURIComponent("Computer Science")}&openDate=${this.openYear + "_" + this.openMonth + "_" + this.openDay}&closeDate=${this.closeYear + "_" + this.closeMonth + "_" + this.closeDay}`,{method:'POST'})
                .then(response => {
                    // Check if the response status is OK (200)
                    if (!response.ok) {throw new Error('Network response was not ok');}
                })
                .then(data => {
                    this.openApplications.push({
                        department:"Computer Science", 
                        openDate:`${this.openYear + "-" + this.openMonth + "-" + this.openDay}`, 
                        dueDate: `${this.closeYear + "-" + this.closeMonth + "-" + this.closeDay}`
                    })

                    this.openDay = ""
                    this.openMonth = ""
                    this.openYear = ""
                    this.closeDay = ""
                    this.closeMonth = ""
                    this.closeYear = ""
                })
                .catch(error => {
                    // Handle any errors that occurred during the fetch
                    console.error('Fetch error:', error);
            });
        },
        getApplications(){
            fetch(`http://localhost:8081/OpenApplication/all`,{method:'GET'})
                .then(response => {
                    // Check if the response status is OK (200)
                    if (!response.ok) {throw new Error('Network response was not ok');}
                    return response.json()
                })
                .then(data => { this.openApplications = data})
                .catch(error => {
                    // Handle any errors that occurred during the fetch
                    console.error('Fetch error:', error);
            });
        },
        deleteApplication(){
            fetch('http://localhost:8081/OpenApplication/delete', {method: 'DELETE'})
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text(); // Parse the response JSON if needed
                })
                    .then((data) => {
                    // Handle the success response here, if needed
                    this.getApplications()
                })
                    .catch((error) => {
                    // Handle errors here
                    console.error('Fetch error:', error);
                });
            }
    },
    mounted(){
        this.getApplications()
    }
}
</script>

<style>

</style>