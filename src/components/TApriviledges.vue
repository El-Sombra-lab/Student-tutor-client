<template>
    <h1 class="text-center font-bold mb-5">Select TA priviledges.</h1>
    <div class="flex flex-col priviledges">
        <span>Selection of tutors <input type="checkbox"/></span>
        <span>Seting up of tutorial slots. <input type="checkbox"/></span>
        <span>Seting up of invigilation slots. <input type="checkbox"/></span>
    </div>
    <div class="priv_btns grid grid-cols-2 gap-6 mt-6">
        <div class="form_submit text-center">Save</div>
        <div class="form_submit text-center bg-red-500" @click="toggleModal">Cancel</div>
    </div>
</template>

<script>



export default {
    props: ["venues"],
}
</script>

<style>

</style>