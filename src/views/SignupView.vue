<template>
  <div class="auth_div flex-center">
    <router-link to="/login">
      <div class="logOrSign_link">Log In</div>
    </router-link>
    <div class="auth_tab">
      <h1 class="font-semibold text-[32px] h-[40px]">Sign up</h1>
      <h2 class="font-medium text-[24px] mb-4">to start tutoring</h2>

      <form>
          <label for="ID">UCT ID</label>
          <input type="text" name="id" id="id" placeholder="ABCXYZ999" v-model="campusId">

          <label for="password">Password</label>
          <input type="password" name="password" id="password" placeholder="%###@&*" v-model="password">

          
          <label for="password_retype">Retype Password</label>
          <input type="password" name="password_retype" id="password_retype" placeholder="%###@&*" v-model="password_retype">

          <div class="form_submit flex-center"  @click="signUp">Sign up</div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      password_retype:"",
      password:"",
      campusId:""
    }
  },

  methods:{
    async signUp(){
      const response = await fetch('http://localhost:8081/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: this.campusId,
          password: this.password
        })
      });

      if (response.ok) {
        localStorage.setItem('username', this.campusId);
        this.$router.push('/student');

      } else {
        console.error('Signup failed');
      }
    }
  }
}
</script>

<style>

</style>