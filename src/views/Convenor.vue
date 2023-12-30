<template>
  <div class="student_view pt-3 flex flex-col items-center min-h-screen">
      <NavBar role="Convenor"  :course="course" :id="user"/>
      
      <main class="flex w-9/12 flex-col">
          
          <div class="flex w-full justify-between">
              <div class="w-8/12">
                <h1 class="font-bold block text-center mb-2 text-lg">This week's activities</h1>
                  <Calendar :course="course"/>
              </div>
              <div class="activities w-3/12">
                  <div class="mb-2 ativitie_header bg-[#418cfd] w-full rounded-tl-md rounded-tr-md text-white text-center font-semibold py-2">
                      Activities
                  </div>
                  <div class="activity" @click="toggleModal('TutorialSlots')">Setup tutorial slots.</div>
                  <div class="activity" @click="toggleModal('tutorSupervision')">Tutor Supervision.</div>
              </div>
          </div>
          
      </main>
    </div>

    <ModalVue @closeModal="toggleModal" v-if="showModal">
        <TutorSupervision v-if="activity === 'tutorSupervision'" :course="course"/>

        <div class="w-[900px]" v-if="activity === 'TutorialSlots'">  
            <h1 class="font-medium text-center text-lg mb-3">Select/Modify Tutorial slots</h1>
            <Calendar :course="course" mode="tut_setup"/>
        </div>

        <div class="w-[900px]" v-if="activity === 'InvigSlots'">  
            <h1 class="font-medium text-center text-lg mb-3">Select/Modify invigilation slots</h1>
            <Calendar :course="course" mode="invig_setup"/>
        </div>
    </ModalVue>
</template>

<script>
    import Calendar from '@/components/Calendar.vue';
    import NavBar from '@/components/NavBar.vue';
    import ModalVue from '@/components/Modal.vue';
    import TApriviledges from '@/components/TApriviledges.vue';
    import TutSlots from '@/components/TutSlots.vue';
    import InvigSlots from '@/components/InvigSlots.vue';
    import TutorSupervision from '@/components/TutorSupervision.vue';
    
    
    
    export default {
        components:{ Calendar, NavBar,ModalVue,TApriviledges, TutSlots,InvigSlots ,TutorSupervision},
        data(){
            return{
                showModal:false,
                venues: [{name:"Jodarn 1A", capacity:20},
                         {name:"Jodarn 1B", capacity:20},
                         {name:"Jodarn 1C", capacity:50},
                         {name:"Jodarn 1D", capacity:19}],
                
                activity:"",
                selected_slots:[],
                course: "",
                user: "",
            }
        },
        methods:{
            toggleModal(activity){
                this.showModal = !this.showModal;
                if (this.showModal){
                    this.activity = activity
                }else{
                    this.activity = ""
                }
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

            if (!role || role.trim() != 'convenor') {
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
.priviledges>span{
    @apply flex justify-between w-72 mb-2
}
</style>