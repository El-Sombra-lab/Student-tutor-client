<template>
  <div>
        <h1 class="text-center font-bold mb-2">Modify list of convenors</h1>
        <div v-if="info" class="bg-red-50 p-2 rounded text-center mb-1">
            {{ info }} 
        </div>
        <div class="flex flex-row-reverse gap-8">
            <form action="" class="w-80">
                <h1 class="text-center font-bold mb-2">Add a convenor</h1>
                <div class="grid grid-cols-2 gap-4">
                    <span>
                        <label class="pl-0 mb-1 text-sm" for="name">FIRST NAME:</label>
                        <input type="text" class="mb-1 input" v-model="convenorFirstName">
                    </span>
                    <span>
                        <label class="pl-0 mb-1 text-sm" for="name">LAST NAME:</label>
                        <input type="text" class="mb-1 input" v-model="convenorLastName">
                    </span>
                </div>
                <label class="pl-0 mb-1 text-sm" for="CONVENOR ID">CONVENOR ID:</label>
                <input type="text" class="mb-1" v-model="convenor_id">
                <label class="pl-0 mb-1 text-sm" for="COURSE ID">COURSE ID:</label>
                <input type="text" class="mb-1" v-model="course_id">
                <label class="pl-0 mb-1 text-sm" for="PASSWORD">PASSWORD:</label>
                <input type="text" class="mb-1" v-model="convenor_passsword">
                <label class="pl-0 mb-1 text-sm" for="RE-TYPE PASSWORD">RE-TYPE PASSWORD:</label>
                <input type="text" class="mb-1" v-model="conv_passsword_retype">
                <div class="priv_btns mt-6">
                    <div class="form_submit text-center" @click="addConvenor">Save</div>
                </div>
            </form>
            <div>
                <div class="grid grid-cols-3 flex-row">
                    <div class="day rounded-tl-xl">Name</div>
                    <div class="day">Staff id</div>
                    <div class="day rounded-tr-xl">Course</div>
                </div>
                <div>
                    <div v-for="convenor in convenors" :key="convenor.staff_id" class="student_list border-b  grid grid-cols-3 relative">
                        <span class="text-ellipsis max-w-xs px-4">{{convenor.firstName + " " + convenor.lastName}} </span>
                        <span class="px-5">{{ convenor.id }}</span>
                        <span class="px-5">{{convenor.course.id}}</span>
                        <img src="../assets/edit-regular.svg" alt="edit" class="w-6 absolute right-2 top-3">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            conv_passsword_retype:"",
            convenor_id:"",
            convenor_passsword:"",
            convenorFirstName:"",
            convenorLastName:"",
            course_id:"",
            convenors: [],
            info:""
        }
    },
    methods: {
        addConvenor() {

            if (this.convenor_passsword !== this.conv_passsword_retype) {
                this.info = "Passwords do not match"
                return;
            }

            const newConvenor = {
                id: this.convenor_id,
                firstName: this.convenorFirstName,
                lastName: this.convenorLastName,
                password: this.convenor_passsword,
                course: {
                    id: this.course_id
                }
            };

            // Send a POST request to add the new convenor
            fetch('http://localhost:8081/Convenor/add', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(newConvenor),
            })
                .then((response) => response.json())
                .then((data) => {
                // Handle the response (e.g., show a success message)
                    console.log(data);

                // After adding the convenor, refresh the list of convenors
                    this.fetchConvenors();
                    
                    this.conv_passsword_retype="";
                    this.convenor_id="";
                    this.convenor_passsword="";
                    this.convenorFirstName="";
                    this.convenorLastName="";
                    this.course_id="";
                })
                .catch((error) => {
                    console.error('Error adding convenor:', error);
                });
        },
        fetchConvenors(){
            // Send a GET request to retrieve all convenors
            fetch('http://localhost:8081/Convenor/all')
                .then((response) => response.json())
                .then((data) => {
                // Update the convenors data property with the fetched data
                this.convenors = data;
                })
                .catch((error) => {
                console.error('Error fetching convenors:', error);
                });
        }
    },
    mounted(){
        this.fetchConvenors();
    }
}
</script>

<style>

</style>