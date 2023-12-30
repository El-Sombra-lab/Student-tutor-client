<template>
    <div class="flex ">
        <div :class="{'w-8/12':(mode != 'tut_view' && mode), 'w-full':(mode == 'tut_view' || !mode )}">
            <!-- Calendeer top panel -->
            <div class="grid grid-cols-6 flex-row">
                <div class="day rounded-tl-xl"></div>   
                <div class="day">Mon</div> 
                <div class="day">Tue</div>   
                <div class="day">Wed</div> 
                <div class="day">Thu</div>   
                <div class="day rounded-tr-xl">Fri</div>
            </div>
            
            <!-- Calender bottom panel -->
            <div class="flex">

                <!-- Calender bottom left panel -->
                <div class=" w-1/6 times">
                    <div>1200</div> 
                    <div>1300</div>  
                    <div>1400</div>   
                    <div>1500</div>    
                    <div>1600</div>
                    <div>1700</div>  
                    <div>1800</div>
                </div>

                <!-- Calender slots (bottom right panel) -->
                <div class="w-5/6 grid grid-cols-5 sessions">
                    <div v-for="session in sessions" :key="session" class="session">
                        <div @click="slot_select(session, $event)"  class="slot text-white font-semibold text-sm flex justify-center items-center w-[90%] h-[95%]" 
                            :class="{
                                selected:(selected.some(e => e.dayOfWeek + e.time === session) & !(!mode)) || slots.some(e => e.dayOfWeek + e.time === session ) ,
                                selected_modify: selected_modify === session
                            }">

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-4/12 pl-5" v-if="mode && mode != 'tut_view'">
            <div class="mb-8" v-if="(this.mode === 'tutSignup' || this.mode === 'invigSignup')">
                <h1 class="font-bold text-center mb-2">Selected slots ({{ this.tut_selected.length + tutors_slots }}/{{ max_selects_per_tutor }})</h1>
                <p class="text-center" v-if="tut_selected && tut_selected.length == 0">No slots selected</p>
                
                <div v-if="tut_selected && tut_selected.length > 0" class="flex flex-wrap gap-2">
                    <div v-for="(slot, index) in slotsSelectedByTut" :key="index"
                        class="flex justify-between px-2  py-1 rounded w-fit " 
                        @click="tut_selected_slot(slot.slotId)"
                        :class="{'bg-green-200': tut_selected.includes(slot.slotId), 'bg-blue-200': !tut_selected.includes(slot.slotId)}">
                        <span>{{ slot.dayOfWeek + " " + slot.time }} -</span> 
                        <span class="max-w-[112px] text-ellipsis overflow-hidden whitespace-nowrap" >{{ slot.venue.venue_id }}</span>
                    </div>
                </div>

                <div class="priv_btns gap-6 mt-6" v-if="tut_selected && tut_selected.length > 0">
                    <div class="form_submit text-center" @click="slotSignUp">Save</div>
                </div>
            </div>

            <h1 class="font-bold text-center mb-2">Slot allocations</h1>
            

            <div class="flex flex-col gap-1">
                <div v-for="(slot, index) in selected_slot" :key="index" 
                    class="flex justify-between px-2  py-1 rounded w-fit " 
                    @click="tut_selected_slot(slot.slotId)"
                    :class="{'bg-green-200': tut_selected.includes(slot.slotId), 'bg-blue-200': !tut_selected.includes(slot.slotId)}">

                    <span class="max-w-[112px] text-ellipsis overflow-hidden whitespace-nowrap" >{{ slot.venue.venue_id }}</span>
                    <span v-if="!(this.mode === 'tutSignup' || this.mode === 'invigSignup')" class="mx-3">5  tutors</span>
                    <span @click="deleteSlot(slot.slotId)" v-if="!(this.mode === 'tutSignup' || this.mode === 'invigSignup')"><img src="../assets/trash-solid.svg" alt="delete" class="w-4 ml-4 relative top-1"></span>
                </div>
            </div>

            <form action="" v-if="!modify_slot  && (this.mode === 'tut_setup' || this.mode === 'invig_setup')">
                <label class="text-sm pl-0 mb-1" for="venue">MAX SLOTS/TUTOR (default = 1):</label>
                <input class="mb-3" type="text" name="venue" id="venue" v-model="max_selects">

                <div class="priv_btns gap-6 mt-6">
                    <div class="form_submit text-center" @click="setMaxSlots">Save</div>
                </div>
            </form>

            <p class="text-center" v-if="(this.mode === 'tutSignup' || this.mode === 'invigSignup')">Select slots to sign up for.</p>
            <form  v-if="modify_slot && !(this.mode === 'tutSignup' || this.mode === 'invigSignup')">
            <h1 class="font-bold text-center mb-2 mt-2">Add new allocation</h1>
                    <label class="text-sm pl-0 mb-1" for="venue">VENUE:</label>
                    <CustomSelect
                        :options="venues.map(x => x.venue_id)"
                        :default="'Select a Venue'"
                        class="select mb-3"
                        @input="onVenuSelectInput"
                    />

                    <label class="text-sm pl-0 mb-1" for="tutor_count">NUMBER OF TUTORS:</label>
                    <input class="mb-3" type="text" name="num_tutors" id="num_tutors" v-model="num_tutors">

                    <label class="text-sm pl-0 mb-1" for="hour_count">NUMBER OF HOURS:</label>
                    <input class="mb-3" type="text" name="hour_count" id="hour_count" v-model="hour_count">

                    <div class="priv_btns grid grid-cols-2 gap-6 mt-6">
                        <div class="form_submit text-center" @click="modify">Save</div>
                        <div class="form_submit text-center bg-red-500" @click="cancelModify">Cancel</div>
                    </div>
            </form>
            <div v-if="!modify_slot && !(this.mode === 'tutSignup' || this.mode === 'invigSignup')">
                <p class="text-center">Select slot to be modified</p>
            </div>
        </div>
    </div>

</template>

<script>
import CustomSelect from './CustomSelect.vue'



export default {
    props: ["mode","user","course"],
    components:{CustomSelect},
    
    data(){
        return{
            modify_slot:false,
            selected_modify:"",
            hour_count:"",
            max_selects: "",
            sessions:[ 
                      "Mon12", "Tue12", "Wed12", "Thu12", "Fri12", 
                      "Mon13", "Tue13", "Wed13", "Thu13", "Fri13", 
                      "Mon14", "Tue14", "Wed14", "Thu14", "Fri14", 
                      "Mon15", "Tue15", "Wed15", "Thu15", "Fri15", 
                      "Mon16", "Tue16", "Wed16", "Thu16", "Fri16", 
                      "Mon17", "Tue17", "Wed17", "Thu17", "Fri17", 
                      "Mon18", "Tue18", "Wed18", "Thu18", "Fri18"],
            selected:[],
            venue: "",
            num_tutors:"",
            tut_selected:[],
            slots:[],
            max_selects_per_tutor:"",
            tutors_slots:0,
            venues: [],

        }


        
    },



    computed:{
        selected_slot(){
            return this.selected.filter(e => e.dayOfWeek + e.time === this.selected_modify)
        },

        slotsSelectedByTut(){
            return this.selected.filter(x => this.tut_selected.includes(x.slotId))
        }
    }
    ,



    methods:{
        tut_selected_slot(slotId){
            if(this.tut_selected.length + this.tutors_slots == this.max_selects_per_tutor && !this.tut_selected.includes(slotId)){
                return
            }
            if (this.tut_selected.includes(slotId)){
                this.tut_selected = this.tut_selected.filter(x=> x != slotId)
            }else{
                this.tut_selected.push(slotId)
            }
        },

        getTutorSlots(){
            if (this.mode != "tut_view" && this.mode != "tutSignup" && this.mode != "invigSignup" ){
                return
            }
            fetch(`http://localhost:8081/Tutor/slots?tutor_id=${this.user}`)
                .then((response) => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (this.mode == "tutSignup" || this.mode == "invigSignup" ){
                        this.tutors_slots = data.length
                    }else{
                        this.slots = data;
                        
                        
                    }
                    
                })
                .catch((error) => {
                    console.error('Error:', error);
                    // Handle any errors here
                });
        }
        ,

        getVenues(){
            if (this.mode === 'tutSignup' || this.mode === 'invigSignup' || this.mode === 'tut_view'){
                return;
            }
            fetch('http://localhost:8081/Venue/all',{method:'GET'})
            .then(response => {

                // Check if the response status is OK (200)
                if (!response.ok) {throw new Error('Network response was not ok');}

                // Parse the JSON response
                return response.json();
            })
            .then(data => {
                this.venues = data
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch
                console.error('Fetch error:', error);
        });
        },

        getSlotType(){
            return ((this.mode === 'tut_setup' || this.mode === "tutSignup")?"Tutorial":"Invigilation");
        },


        slot_select(session,event){
            if (this.mode === "tut_view"){
                const slot = this.slots.filter(e => e.dayOfWeek + e.time === session )
                if (slot.length){
                    this.$emit("details", slot);
                }
                return;
            }
            if (this.mode === 'tutSignup' || this.mode === 'invigSignup'  || this.mode === 'tut_view'){
                if (event.target.classList.contains('selected')){
                    this.modify_slot = true;
                    this.selected_modify = session;
                }
                return;
            }
            if (this.mode === "tut_select"){
                if (this.selected.includes(session)){
                    this.selected = this.selected.filter(x => x != session)
                }else{
                    this.selected.push(session)
                }
                return
            }
            if (this.selected_modify != ""){
                return
            }
            this.modify_slot = !this.modify_slot;
            this.selected_modify = session;
        },


        cancelModify(){
            this.modify_slot = false;
            this.selected_modify = ""
        },


        modify(){
            if (this.mode === 'tutSignup' || this.mode === 'invigSignup' || this.mode === 'tut_view'){
                return;
            }
            const slotsData = [{
                "venue": {
                    "venue_id": this.venue
                },
                "course": {
                    "id": this.course
                },
                "type": this.getSlotType(),
                "dayOfWeek": this.selected_modify.slice(0, 3),
                "time": this.selected_modify.slice(-2),
                "duration": 1,
                "allocations": this.num_tutors
                },
            ]

            console.log(this.selected_modify.slice(0, 3))
            
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(slotsData),
            };

            fetch('http://localhost:8081/Slot/add', requestOptions)
            .then((response) => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((data) => {
                this.getSlots()
                this.venue =""
                this.selected_modify = ""
                this.modify_slot = false
                this.num_tutors = ""
                this.hour_count = ""
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle any errors here
            });
        },


        deleteSlot(slotId){
            if ((this.mode === 'tutSignup' || this.mode === 'invigSignup'  || this.mode === 'tut_view')){
                return;
            }

            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            fetch(`http://localhost:8081/Slot/delete/${slotId}`, requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text(); // or response.json() if the response contains JSON data
                })
                .then((data) => {
                    // Handle the successful response here
                    this.getSlots()
                })
                .catch((error) => {
                    console.error('Error:', error);
                    // Handle any errors here
                });
        },


        getSlots(){
            if (this.mode ===  'tut_view'){
                return;
            }
            const slotType = this.getSlotType();
            fetch(`http://localhost:8081/Slot?courseId=${this.course}&type=${slotType}`)
            .then((response) => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json(); // Assuming the response is in JSON format
            })
            .then((data) => {
                this.selected = data;
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle any errors here
            });
        },

        slotSignUp() {
            // Define the data to send in the POST request
            const requestData = this.tut_selected.map((slotId) => ({
                slotId,
                tutorId: this.user, // You may need to adjust this based on your tutor ID source
            }));

            // Define the fetch options
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            };

            // Make the POST request to the server
            fetch('http://localhost:8081/Slot/assign', requestOptions)
                .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                    return response.text(); // or response.json() if the response contains JSON data
                })
                .then((data) => {
                    // Handle the successful response here
                    console.log('Slot assignment successful:', data);
                    // Optionally, you can perform any necessary actions after successful assignment
                    // For example, update the UI or clear the selected slots
                    this.tut_selected = [];
                })
                .catch((error) => {
                    console.error('Error:', error);
                    // Handle any errors here
                });
            },


        setMaxSlots(){
            if (this.max_selects === "" && !isNaN(parseInt(this.max_selects))){
                return
            }

            fetch(`http://localhost:8081/Course/setMaxAllocations?courseId=${this.course}&maxAllocations=${this.max_selects}`, {method:'POST'})
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        },

        getMaxSlots(){
            fetch(`http://localhost:8081/Course/getMaxAllocations?courseId=${this.course}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((data) => {
                // Handle the response data here
                this.max_selects_per_tutor = data
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle any errors here
            });
        },
        
        onVenuSelectInput(option) {
            this.venue = option
        },

    },


    mounted(){
        this.getSlots()
        this.getTutorSlots()
        this.getMaxSlots()
        this.getVenues()
    },
    
}
</script>

<style>


.day{
    @apply flex justify-center items-center py-3 bg-[#dbeafe] border-r border-r-blue-200 border-b
}

.times>div{
    @apply text-center py-4 border-b border-r bg-[#f5f7f9]
}

.session{
    @apply flex justify-center items-center border-b border-r
}


.selected{
    @apply bg-blue-400 rounded;
}

.selected_modify{
    @apply bg-red-300 rounded;
}

.selected_modify{
    background-image: radial-gradient(white 1px, transparent 0);
    background-size: 10px 10px;
}
</style>