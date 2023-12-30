<template>
  <nav class="flex justify-between w-9/12 mb-5">
        <div class="logo bg-[#1577ea] rounded-lg px-3 flex-center text-white font-bold text-lg">
            MT
        </div>

        <div class="courses mr-3 flex-center relative" v-if="role">
                <div class="course bg-blue-100">
                    <span>{{course}}: </span>
                    <span class="ml-2"> {{role}}</span>
                </div>

            </div>

        <div class="profile flex-center ">
            

            <p class="font-semibold">{{id}}</p>
            <div class="ml-2 image w-10 h-10 bg-gray-500 rounded-full">

            </div>
        </div>
    </nav>
</template>

<script>
export default {
    props: ['role',"id","course"]
}
</script>

<style>
.course{
    @apply px-4 py-1 rounded-md flex justify-between font-bold items-center
}

.course>span:nth-child(2){
    @apply font-bold text-sm
}
</style>