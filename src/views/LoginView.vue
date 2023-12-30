1<template>
  <div class="auth_div flex-center">
    <router-link to="/signup">
      <div class="logOrSign_link">Sign up</div>
    </router-link>
    <div class="auth_tab">
      <h1 class="font-semibold text-[32px] h-[40px]">Log in</h1>
      <h2 class="font-medium text-[24px] mb-4">to start tutoring</h2>

      <form>
          <label for="ID">UCT ID</label>
          <input type="text" name="id" id="id" placeholder="ABCXYZ999" v-model="campusId">

          <label for="password">Password</label>
          <input type="password" name="password" id="password" placeholder="%###@&*" v-model="password">

          <a href="#" class="mb-2 text-gray-600 pl-1">Forgort password?</a>

          <div to="/student" @click="login" class="form_submit flex-center">Log in</div>
      </form>
    </div>
  </div>
  
</template>

<script>
export default {
  data() {
    return {
      campusId: '',
      password: ''
    };
  },
  methods: {
    async login() {
      const response = await fetch('http://localhost:8081/auth/login', {
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
        const user = await response.json();
        localStorage.setItem('username',this.campusId)
        localStorage.setItem('role',user.role)
        console.log(user)

        if (user.role ==="Student"){
          this.$router.push('/student');
          return
        }

        if (user.role ==="Admin"){
          this.$router.push('/admin');
          return
        }
        
        localStorage.setItem('course',user.course.id)

        if (user.role ==="Tutor"){
          this.$router.push('/tutor');
        }

        

        

        if (user.role ==="convenor"){
          this.$router.push('/convenor');
        }

        if (user.role ==="TA"){
          this.$router.push('/ta');
        }

        // Do something after successful login
      } else {
        console.error('Login failed');
        // Handle login failure
      }
    }
  }
};
</script>

<style>

.auth_div{
  @apply bg-[#f9f9f9]  h-screen relative;
}

form>*{
  @apply block
}

form>input, .input{
  @apply w-full border-[#e5e5e5] border py-2 px-4 rounded-lg mb-6;
}

form>input:focus{
  @apply outline-none;
}

label{
  @apply text-[16px] text-gray-600 pl-1;
}

.form_submit{
  @apply font-bold text-white bg-[#1577ea] py-3 rounded 
}

.logOrSign_link{
  @apply absolute top-4 right-7 bg-black text-white rounded-3xl py-2 px-5
}

.auth_tab{
  @apply w-96 shadow-2xl rounded-2xl py-10 px-8
}
</style>