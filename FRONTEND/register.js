const API_URL="http://localhost:7001/api"
  
  const handleSubmit = async(event)=>{
   event.preventDefault()
   const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
   console.log({ email, password})

try{

   const response = await fetch(`${API_URL}/borrower/register`, {

   method:'POST',
   headers:{'Content-Type': 'application/json'},
   body:JSON.stringify({name,  email, password})

})
   const data = await response.json()
   if(response.ok){
      alert(data.message)
      
    localStorage.setItem('token', data.token)
    window.location.href = 'login.html'
   }else{
    alert(data.message)
   }
} catch (error){
  alert("try again ")
  console.log(error)
}
   

     
}
document.getElementById("register").addEventListener('submit', handleSubmit)