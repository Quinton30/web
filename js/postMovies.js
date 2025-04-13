document.getElementById('movieForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const formData = {
    title: document.getElementById('title').value,
    genre: document.getElementById('genre').value,
    release_year: parseInt(document.getElementById('release_year').value),
    director: document.getElementById('director').value,
    rating: parseFloat(document.getElementById('rating').value),
  }

  try {
    const response = await fetch('http://localhost:3000/api/v1/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to add movie')
    }

    // Show success toast
    const toast = new bootstrap.Toast(document.getElementById('successToast'))
    toast.show()

    // Reset form
    document.getElementById('movieForm').reset()
  } catch (error) {
    // Show error toast
    const toast = new bootstrap.Toast(document.getElementById('errorToast'))
    document.getElementById('errorMessage').textContent = error.message
    toast.show()
  }
})
