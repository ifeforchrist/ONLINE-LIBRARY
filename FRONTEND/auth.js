const API_URL="http://localhost:7001/api"
  
  const handleSubmit = async(event)=>{
   event.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
   console.log({ email, password})


const response = await fetch(`${API_URL}/borrower/login`, {

   method:'POST',
   headers:{'Content-Type': 'application/json'},
   body:JSON.stringify({ email, password})

})

try{
   const data = await response.json()
   if(response.ok){
      alert(data.message)
      
    localStorage.setItem('token', data.token)
    window.location.href = 'dashboard.html'
   }else{
    alert(data.message)
   }
} catch (error){
  alert("try again ")
  console.log(error)
}
   

     
}
document.getElementById("loginform").addEventListener('submit', handleSubmit)