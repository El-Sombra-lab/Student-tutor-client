<template>
  <div class="student_view pt-3 flex flex-col items-center min-h-screen">
    <NavBar role="Tutor" :course="course" :id="user"/>
    
    <main class="flex w-9/12 flex-col">
        

        <div class="flex w-full justify-between">
            <div class="w-8/12">
                <h1 class="font-bold block text-center mb-2 text-lg">This week's activities</h1>
                <Calendar :course="course" mode="tut_view" :user="user" @details="handleDetails"/>
            </div>
            <div class="activities w-3/12">
                <div class="mb-2 ativitie_header bg-[#418cfd] w-full rounded-tl-md rounded-tr-md text-white text-center font-semibold py-2">
                    Activities
                </div>
                <div class="activity" @click="toggleModal('TApriviledges')">Apply to be a tutor/TA.</div>
                <div class="activity" @click="toggleModal('tutSignup')">Sign up for a Tutorial slot.</div>
                <div class="activity" @click="toggleModal('invigSignup')">Sign up to invigilate.</div>
            </div>
        </div>
        
    </main>

    <Modal @closeModal="toggleModal" v-if="showModal">
        <div class="w-[900px]" v-if="activity === 'invigSignup' || activity === 'tutSignup'">  
            <h1 class="font-medium text-center text-lg mb-3">Select {{(activity === "tutSignup")?"Tutorial":"Invigilation"}} slots of your choice</h1>
            <p class="text-center font-bold">NB: You can select up to {{ max_selects }} tutorial slots</p>
            <Calendar :course="course" :mode="activity" :user="user"/>
        </div>

        <div v-if="activity === 'details'">
            <h1 class="font-bold text-lg text-center">Slot Details</h1>
            <div class="w-64"><span class="font-bold ml-2">Venue:</span> {{ (slot[0])?slot[0].venue.venue_id:"" }}</div>
            <div class="w-64"><span class="font-bold ml-2">Day Of Week:</span>{{ (slot[0])?slot[0].dayOfWeek:"" }}</div>
            <div class="w-64"><span class="font-bold ml-2">Time:</span>{{ (slot[0])?slot[0].time:"" }}</div>
            
            <div class="priv_btns gap-6 mt-6">
              <div class="form_submit text-center" @click="slotSignOut">Sign Out from Slot</div>
          </div>
        
        </div>
    </Modal>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar.vue';
import NavBar from '@/components/NavBar.vue';
import Modal from '@/components/Modal.vue';


export default {
    data(){
        return{
            showModal:false,
            selected_slots:[],
            activity:"",
            slot:[],
            course: "",
            user: "",
        }
    },
    components:{ Calendar, NavBar, Modal },
    methods:{
        toggleModal(activity){
            this.showModal = !this.showModal;
            if (this.showModal){
                this.activity = activity
            }else{
                this.activity = ""
            }
            this.selected_slots = []

        },

        handleDetails(slot){
            this.toggleModal('details')
            this.slot= slot;
        },

        slotSignOut(){
            const slotId = (this.slot[0])?this.slot[0].slotId:""
            console.log(slotId)
            fetch(`http://localhost:8081/Slot/sign-out?tutorId=${this.user}&slotId=${slotId}`, {method:"POST"})
                .then((response) => {
                    if (response.ok) {
                    // Request was successful
                        return response.text();
                    } else {
                        // Request failed
                        throw new Error('Request failed');
                    }
                })
                .then((data) => {
                    this.toggleModal()

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

        
    },
    mounted(){
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        const course = localStorage.getItem('course');

        if (!username || username.trim() === '') {
            this.$router.push('/login');
        }

        this.user = username

        if (!role || role.trim() != 'Tutor') {
            this.$router.push('/login');
        }

        if (!course || course.trim() === '') {
            this.$router.push('/login');
        }
        
        this.course = course
    }
}
</script>

<style>

.activity{
    @apply pl-2 text-[#418cfd] font-medium mb-1 hover:underline
}


</style>