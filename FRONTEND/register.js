const API_URL = "https://online-library-backend-three.vercel.app/api"

const handleSubmit = async (event) => {
  event.preventDefault()
  const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  try {
    const response = await fetch(`${API_URL}/borrower/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    const data = await response.json()
    console.log("SERVER REPLY:", data)

    if (response.ok) {
      alert(data.message || data.msg || "Registered successfully!")
      if (data.token) localStorage.setItem('token', data.token)
      window.location.href = 'login.html'
    } else {
      alert(data.message || data.msg || data.error || "Registration failed")
    }
  } catch (error) {
    alert("Try again - cannot reach server")
    console.log(error)
  }
}

document.getElementById("register").addEventListener('submit', handleSubmit)
