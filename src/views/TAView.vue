<template>
    <div class="student_view pt-3 flex flex-col items-center min-h-screen">
      <NavBar role="TA" :course="course" :id="user"/>
      
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
                  <router-link to="./student" class="activity">Apply to be a tutor/TA.</router-link>
                  <div class="activity" @click="toggleModal('TutorialSlots')">Setup tutorial slots.</div>
                  <div class="activity" @click="toggleModal('tutorSupervision')">Tutor Supervision.</div>
              </div>
          </div>
      </main>

      <ModalVue @closeModal="toggleModal" v-if="showModal">
        <div class="w-[900px]" v-if="activity === 'TutorialSlots'">  
            <h1 class="font-medium text-center text-lg mb-3">Select/Modify Tutorial slots</h1>
            <Calendar :course="course" mode="tut_setup"/>
        </div>
        
        <TutorSupervision v-if="activity === 'tutorSupervision'" :course="course"/>
    </ModalVue>
    </div>

    
  </template>
  
  <script>
  import Calendar from '@/components/Calendar.vue';
  import NavBar from '@/components/NavBar.vue';
  import ModalVue from '@/components/Modal.vue';
  import TutorSupervision from '@/components/TutorSupervision.vue';
  
  
  export default {
      data(){
        return{
          showModal:false,
          course: "",
          user: "",
          activity: ""
        }
      },
      components:{ Calendar, NavBar, ModalVue,TutorSupervision },
      mounted(){
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        const course = localStorage.getItem('course');

        if (!username || username.trim() === '') {
            this.$router.push('/login');
        }

        this.user = username

        if (!role || role.trim() != 'TA') {
            this.$router.push('/login');
        }

        if (!course || course.trim() === '') {
            this.$router.push('/login');
        }
        
        this.course = course
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
      }
  }
  </script>
  
  <style>

  </style>