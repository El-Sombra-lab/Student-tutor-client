<template>
  <div>
        <h1 class="font-bold text-center text-lg mb-4">Add a venue</h1>
        <div v-if="info" class="bg-red-50 p-2 rounded text-center mb-1">
            {{ info }} 
        </div>
        <form>
            <div class="grid grid-cols-2 gap-4 add_venue">
                <div class="flex flex-col">
                    <label for="course_name" class="text-sm mb-1 pl-0 text-gray-600">NAME OF VENUE:</label>
                    <input type="text" class="focus:border-[#1577ea] input" v-model="venue_name" required>
                </div>
                <div>
                    <label for="course_id" class="text-sm mb-1 pl-0 text-gray-600">VENUE CAPACITY:</label>
                    <input type="text" class="focus:border-[#1577ea] input" v-model="venue_capacity" required>
                </div>
            </div>
            <div class="form_submit text-center mb-6" @click="addVenue">Add venue</div>
        </form>

        <h1 class="font-bold text-center text-lg mb-3">List of venues</h1>
        <label for="course_id" class="text-sm pl-0 text-gray-600">SEARCH FOR A VENUE:</label>
        <input type="text" class="focus:border-[#1577ea] input mt-1 mb-3" v-model="venue_search">
            
        <div class="grid grid-cols-2 flex-row mt-1">
            <div class="day rounded-tl-xl">Name</div>
            <div class="day rounded-tr-xl">Capacity</div>
        </div>
        <div class="max-h-48 overflow-y-scroll">
            <div v-for="venue in filtered_venues" :key="venue.venue_id" class="student_list border-b  grid grid-cols-2 relative">
                <span class="text-center">{{venue.venue_id}}</span>
                <span>{{venue.capacity}}</span>
                <button class="absolute top-2 right-4 text-lg rounded-full bg-black text-white w-7 pl-[1px] pb-[1px]">x</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    data(){
        return{
            venues: [],
            venue_capacity: "",
            venue_name:"",
            venue_search:"",
            info:""
        }
    },
    computed:{
            filtered_venues(){
                if (this.venue_search === ""){
                    return this.venues
                }else{
                    return this.venues.filter(x => x.venue_id.toLowerCase().includes(this.venue_search.toLowerCase()))
                }
            }
        },

    methods:{
        addVenue(){
                if (!this.venue_name  || !this.venue_capacity){
                    this.info = "Venue name and capacity should not be empty!"
                    return;
                }
                if (!(/^\d+$/.test(this.capacity))){
                    this.info = "Invalid input for venue capacity!"
                    return;
                }
                fetch(`http://localhost:8081/Venue/add?id=${this.venue_name}&capacity=${this.venue_capacity}`,{method:'POST'})
                    .then(response => {

                        // Check if the response status is OK (200)
                        if (!response.ok) {throw new Error('Network response was not ok');}
                    })
                    .then(data => {
                        this.venues.push({venue_id:this.venue_name, capacity:this.venue_capacity})
                        this.venue_name = "";
                        this.venue_capacity = "";
                    })
                    .catch(error => {
                        // Handle any errors that occurred during the fetch
                        console.error('Fetch error:', error);
                });
                
        },
        
    },
    mounted(){
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
    }
}
</script>

<style>

</style>