<template>
  <div class="student_view pt-3 flex flex-col items-center">
    <NavBar  :id="user"/>
    
    <main class="flex w-7/12 flex-col">
        <h1 class="font-bold text-lg text-center block">Open Applications</h1>

        <div class="mt-6 applications_list">
            <div class="mb-1">
                <span>Department</span>
                <span>Open Date</span>
                <span>Closing Date</span>
            </div>
            <div @click="toggleModal" v-for="app in openApplications" :key="app.department" class="gap-6 flex flex-col">
                <div class="shadow-lg  bg-blue-50 hover:bg-blue-100 rouded-lg py-4 hover:shadow-2xl">
                    <span>{{app.department}}</span>
                    <span>{{ app.openDate }}</span>
                    <span>{{app.dueDate}}</span>
                </div>
            </div>
        </div>
    </main>

    <ModalVue @closeModal="toggleModal" v-if="showModal">
        <ApplicationVue @close="toggleModal"/>
    </ModalVue>
  </div>
</template>

<script>
import ModalVue from '@/components/Modal.vue';
import ApplicationVue from '@/components/Application.vue';
import NavBar from '@/components/NavBar.vue';

export default {
    components:{ ModalVue, ApplicationVue, NavBar },
    data(){
        return{
            showModal:false,
            openApplications: [],
            user:""
        }
    },
    methods:{
        toggleModal(){
            this.showModal = !this.showModal;
        }
    },
    mounted(){
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (!username || username.trim() === '') {
            this.$router.push('/login');
        }

        this.user = username

        if (!role || role.trim() === '') {
            this.$router.push('/login');
        }



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

        
    }
}
</script>

<style>
.applications_list div:nth-child(1){
    @apply grid grid-cols-3 px-6
}

.applications_list >div:nth-child(1)>span{
    @apply uppercase text-sm font-semibold text-gray-500 
}
</style>