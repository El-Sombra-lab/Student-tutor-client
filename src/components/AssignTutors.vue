<template>
    
    <div class="w-[1250px]">
        <h1 class="font-bold text-center text-lg mb-4" >Assign tutors/TA to the course: {{ course }}</h1>
        <div>
            <label for="" class="text-sm pl-0 font-medium block mb-1 text-center">SELECT COLUMNS TO SHOW:</label>
            <div class="grid grid-cols-8 gap-y-1 mb-2">
                <span class="app_col_view_checkbox " v-for="course in courses" :key="course.id">
                    <label :for="course.id">{{course.id}}</label>
                    <input type="checkbox" :id="course.id" name="coursesToView" :value="course.id" v-model="coursesToView">
                </span>
            </div>
            
        </div>
        <div class="overflow-x-scroll relative max-h-96 overflow-y-auto flex">
            <div class="relative">
                <div class=" col-grid flex-row mt-1 w-[1350px] sticky top-0 z-10">
                    <div class="day rounded-tl-xl">Student Id</div>
                    <div v-for="course in visibleCourses" :key="course" class="day">{{course}}</div>
                    <div class="day text-center">Applied to TA</div>
                    <div class="day text-center">Allocate Tutor</div>
                    <div class="day text-center rounded-tr-xl">Allocate TA</div>
                </div>
                <div class="w-[1350px] relative z-0">
                    <div v-for="app in apps" :key="app.id" class="apps student_list border-b col-grid">
                        <span class="text-center">{{app.user.id}}</span>
                        
                        <span v-for="course in visibleCourses" :key="course + '-mark'">
                            {{getMark((((app.grades.filter(x => x.courses === course)))))}}
                        </span>
                        <div class="flex items-center justify-center" :class="{'bg-blue-100': (app.role === 'TA')}">{{ (app.role === "TA")?"Yes":"No" }}</div>
                        <input class="h-4 my-auto" type="checkbox" name="tutorSelect" :id="app.id" :value="app.user.id" v-model="tutors" :disabled="TA.includes(app.user.id)">
                        <input class="h-4 my-auto" type="checkbox" name="TASelect" :id="app.id" :value="app.user.id" v-model="TA" :disabled="tutors.includes(app.user.id) || (TA.length >0 && TA[0] !=app.user.id)">
                    
                    </div>
                </div>
            </div>
        </div>

        <div class="priv_btns grid grid-cols-2 gap-6 mt-6 w-96 mx-auto">
            <div class="form_submit text-center" @click="save">Save</div>
            <div class="form_submit text-center bg-white text-black" @click="toggleModal">Cancel</div>
        </div>
    </div>
</template>

<script>
export default {
    
    props:["course","courses"],
    data(){
        return{
            tutors: [],
            TA: [],
            apps:[],
            coursesToView:["CSC1015F","CSC1016S","CSC2001F","CSC2002S","CSC3002F","CSC3003S","CSC3022F"],
                
        }
    },

    computed:{
        getCourses(){
            return (this.courses.map(x => x.id)).sort()
        },
        visibleCourses(){
            if (!this.coursesToView){
                return []
            }
            return ((this.courses.filter(x => this.coursesToView.includes(x.id))).map(x => x.id)).sort()
        }
    },
    mounted(){
        this.getApps();
        this.fetchCourses();
    },
    methods:{
        async getApps(){
            try {
                const response = await fetch('http://localhost:8081/Application/all');
                const data = await response.json();
                this.apps = data;
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        },

        async fetchCourses() {
                try {
                    const response = await fetch('http://localhost:8081/Course/all');
                    const data = await response.json();
                    this.coursesToView = data.map(x => x.id);
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            },


        getMark(x){
            if (!x || !Array.isArray(x) || x.length === 0) {
                return "-";
            }

            return x[0].mark
        },


        save(){
            fetch(`http://localhost:8081/TA/add?userId=${this.TA[0]}&courseId=${this.course}`,{method:'POST'})
                .then(response => {
                    if (!response.ok) {throw new Error('Network response was not ok');}
                    this.$emit("close")
                    return response.json();
                    
                })
                .then(data => {
                    this.$emit("close")
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });

            
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    this.tutors.map(x => ({"courseId": this.course, "userId": x}))
                ),
            };

            fetch(`http://localhost:8081/Tutor/add`,requestOptions)
                .then(response => {
                    if (!response.ok) {throw new Error('Network response was not ok');}
                    return response.json();
                })
                .then(data => {
                    console.log('Response:', data);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        }
    }
}
</script>

<style>

</style>