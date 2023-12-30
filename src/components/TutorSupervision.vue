<template>
  <div class="w-[450px] ">
    <form action="" class="grid grid-cols-2 gap-4">
        <span>
            <label for="Week" class="font-medium text-sm pl-0 mb-1">WEEK:</label>
            <CustomSelect
                :options="['Select a week',1,2,3,4,5,6,7,8,9,10,11,12,13]"
                :default="'Select a week'"
                class="select"
                @input="onWeekSelectInput"
            />
        </span>
        <span>
            <label for="Week" class="font-medium text-sm pl-0 mb-1">DAY:</label>
            <CustomSelect
                :options="['Select a Day','Mon', 'Tue', 'Wed', 'Thu', 'Fri']"
                default="Select a Day"
                class="select"
                @input="onDaySelectInput"
            />
        </span>
    </form>
    
    <div class="grid grid-cols-4 flex-row mt-4">
        <div class="day rounded-tl-xl">Student Id</div>
        <div class="day">Time</div>
        <div class="day ">Venue</div>
        <div class="day rounded-tr-xl">Attended?</div>
    </div>
    <div v-if="week != 'Select a week'">
        <div v-for="(tutor,index) in tutorSlots" :key="index" class="student_list border-b  grid grid-cols-4">
            <span>{{tutor.tutor_id}}</span>
            <span>{{tutor.time}}:00</span>
            <span>{{tutor.venue}}</span>
            <input type="checkbox" name="" id="" class="w-4 mx-auto" v-model="tutor.isPresent">
        </div>
    </div>

    <div class="priv_btns gap-6 mt-6">
        <div class="form_submit text-center w-40 mx-auto" @click="setAttendance">Save</div>
    </div>

  </div>
</template>

<script>
import CustomSelect from './CustomSelect.vue';

export default {
    components:{CustomSelect},
    props:["course"],
    data(){
        return{
            type:"Tutorial",
            slots: [],
            selectOptions: [
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
                { label: "Option 3", value: "option3" },
            ],
            selectedValue: "",
            day:"",
            week:"",
            present:[]
        }
    },
    methods:{
        getSlots(){
            fetch(`http://localhost:8081/Slot/course?courseId=${this.course}&type=${this.type}`)
            .then(response => {
                if (!response.ok) {throw new Error('Network response was not ok');}
                return response.json();
            })
            .then(data => {
                this.slots = data;
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
        },

        handleSelect(value) {
            this.selectedValue = value; // Handle the selected value here
        },

        onWeekSelectInput(option) {
            this.present = []
            this.week = option
            if (this.week != 'Select a week' && this.day != 'Select a Day'){
                this.getPresentTutors()
            }
        },

        onDaySelectInput(option) {
            this.present = []
            this.day = option
            if (this.week != 'Select a week' && this.day != 'Select a Day'){
               this.getPresentTutors()     
            }
        },

        setAttendance(){
            if (this.tutorSlots.length === 0){
                return
            }

            const attendanceData = this.tutorSlots.map((tutorSlot) => {
                return {
                    tutorId: tutorSlot.tutor_id,
                    slotId: tutorSlot.slotId,
                    present: tutorSlot.isPresent, // Assuming you have a boolean property in tutorSlot to track attendance
                    weekNumber: this.week,
                };
            });

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendanceData),
            };

            fetch('http://localhost:8081/attendance/mark', requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then((data) => {
                    console.log('Attendance marked successfully:', data);
                    
                })
                .catch((error) => {
                    console.error('Error marking attendance:', error);
                });
        },



        getPresentTutors() {
            const url = `http://localhost:8081/attendance/present?weekNumber=${this.week}&dayOfWeek=${this.day}&course=${this.course}`;

            fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    // Update the 'present' data value with the received data
                    this.present = data;
                    console.log(data)
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                });
        },
    },


    mounted(){
        this.getSlots()
    },


    computed: {
        tutorSlots() {
            const tutorSlots = [];
            this.slots.forEach((slot) => {
                slot.tutors.forEach((tutor) => {
                // Create a tutor_slot object for each tutor-slot combination
                const tutorSlot = {
                    tutor_id: tutor.id,
                    venue: slot.venue,
                    dayOfWeek: slot.dayOfWeek,
                    time: slot.time,
                    slotId: slot.slotId,
                    isPresent: this.present.some(x => x.slot.slotId === slot.slotId)
                };
                tutorSlots.push(tutorSlot);
                });
            });
            return tutorSlots.filter(x => x.dayOfWeek == this.day);
        }
  }
}
</script>

<style>

</style>