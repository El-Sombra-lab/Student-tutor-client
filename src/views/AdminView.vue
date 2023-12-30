<template>
    <div class="student_view pt-3 flex flex-col items-center min-h-screen">
      <NavBar :id="user"/>
      
      <main class="flex w-9/12 flex-col">
          <div class="grid grid-cols-7 gap-3 mb-4 courses">
              <div v-for="course in courses" :key="course" class="course px-6 w-fit  h-10" 
                    :class="{'bg-blue-400':selected_course === course.id, 'bg-slate-100': selected_course != course.id}"
                    @click="selected_course = course.id"
                    >
                  <span>{{course.id}}</span>
              </div>
          </div>
  
          <div class="flex w-full justify-between">
              <div class="w-8/12">
                  <StudentList :course="selected_course"/>
              </div>
              <div class="activities w-3/12">
                  <div class="mb-2 ativitie_header bg-[#418cfd] w-full rounded-tl-md rounded-tr-md text-white text-center font-semibold py-2">
                      Activities
                  </div>
                  
                  <div class="activity" @click="toggleModal('addCourse')">Add a course</div>
                  <div class="activity" @click="toggleModal('openApplications')">Open Tutoring applications</div>
                  <div class="activity" @click="toggleModal('assignTutors')"  >Assign tutors/TA to the course</div>
                  <div class="activity" @click="toggleModal('venues')">Modify list of venues</div>
                  <div class="activity" @click="toggleModal('convenors')">Modify list of convenors</div>

              </div>
          </div>
          
      </main>
      
      <Modal v-if="showModal" @closeModal="toggleModal">
         <ApplicationsOpen v-if="activity === 'openApplications' "/>
         <AddCourse v-if="activity == 'addCourse'"/>
         <Venues v-if="activity == 'venues'"/>
         <AssignTutors v-if="activity == 'assignTutors'" :courses="courses" :course="selected_course" @close="toggleModal"/>
         <ConvenorsModify v-if="activity == 'convenors'"/>
      </Modal>
        
    </div>
  </template>
  
  <script>
  import StudentList from '@/components/StudentList.vue';
  import NavBar from '@/components/NavBar.vue';
  import Modal from '@/components/Modal.vue';
  import Application from '@/components/Application.vue';
  import ApplicationsOpen from '@/components/ApplicationsOpen.vue';
  import AddCourse from '@/components/AddCourse.vue';
  import Venues from "@/components/Venues.vue"
  import AssignTutors from '@/components/AssignTutors.vue';
  import ConvenorsModify from '@/components/ConvenorsModify.vue';
  
  export default {
      components:{StudentList, NavBar, Modal, Application, ApplicationsOpen, AddCourse, Venues,AssignTutors, ConvenorsModify},
      
      data() {
            return {
                courses: [],
                showModal:false,
                activity:"",
                course: "",
                user: "",
                selected_course: ""
            
            };
        },
        created() {
            this.fetchCourses();
        },
        methods: {
            async fetchCourses() {
                try {
                    const response = await fetch('http://localhost:8081/Course/all');
                    const data = await response.json();
                    this.courses = data;
                    this.selected_course = this.courses[0].id
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            },

            toggleModal(activity){
                this.showModal = !this.showModal;
                if (this.showModal){
                    this.setActivity(activity)
                }else{
                    this.setActivity("")
                }
            },
        

            setActivity(activity){
                this.activity = activity
            }
        },

        mounted(){
            const username = localStorage.getItem('username');
            const role = localStorage.getItem('role');

            if (!username || username.trim() === '') {
                this.$router.push('/login');
            }

            this.user = username

            if (!role || role.trim() != 'Admin') {
                this.$router.push('/login');
            }
        }
        
  }
    
  </script>
  
  <style>
  
  .course>span:nth-child(2){
      @apply font-bold text-sm
  }
  
  .deadline input{
    @apply px-2
  }


  .add_venue .input{
    @apply w-52 block mt-1
  }

  .apps span{
    @apply text-center;
  }

  .app_col_view_checkbox{
    @apply flex flex-row-reverse
  }
  .app_col_view_checkbox{
    justify-content: start;
  }

  .col-grid{
    @apply grid grid-cols-11
  }
  </style>