<template>
    
</template>

<script>
import Calendar from '@/components/Calendar.vue';
export default {
    props: ["venues"],
    components:{ Calendar},
    data(){
        return{
            selected_slots:[],
        }
    }
}
</script>

<style>

</style>