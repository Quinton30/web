// Function to show a Bootstrap toast
function showToast({ priority, title, message }) {
  const toastEl = document.getElementById('toastContainer')
  const toastTitleEl = document.getElementById('toastTitle')
  const toastMessageEl = document.getElementById('toastMessage')

  toastTitleEl.textContent = title
  toastMessageEl.textContent = message

  toastEl.className = 'toast'
  if (priority === 'success') {
    toastEl.classList.add('bg-success', 'text-white')
  } else if (priority === 'danger') {
    toastEl.classList.add('bg-danger', 'text-white')
  }

  const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 })
  bsToast.show()
}

// Fetch movie data when the "Fetch Movie" button is clicked
document.addEventListener('DOMContentLoaded', () => {
  const fetchMovieBtn = document.getElementById('fetchMovieBtn')
  const idInput = document.getElementById('id')
  const titleInput = document.getElementById('title')
  const genreInput = document.getElementById('genre')
  const releaseYearInput = document.getElementById('release_year')
  const directorInput = document.getElementById('director')
  const ratingInput = document.getElementById('rating')
  const submitBtn = document.querySelector('.submit-btn')

  fetchMovieBtn.addEventListener('click', () => {
    const movieId = idInput.value.trim()
    console.log('Fetching movie data for ID:', movieId)

    if (!movieId) {
      showToast({
        priority: 'danger',
        title: 'Error',
        message: 'Please enter a movie ID.',
      })
      return
    }

    if (!/^\d+$/.test(movieId)) {
      showToast({
        priority: 'danger',
        title: 'Error',
        message: 'Movie ID must be a number.',
      })
      return
    }

    fetch(`http://localhost:3000/api/v1/movies/${movieId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((movie) => {
        console.log('Fetched movie data:', movie)

        // Check if the movie object is valid
        if (!movie || !movie.id) {
          showToast({
            priority: 'danger',
            title: 'Error',
            message: 'Movie not found.',
          })
          return
        }

        // Populate form fields (add fallbacks)
        titleInput.value = movie.title || ''
        genreInput.value = movie.genre || ''
        releaseYearInput.value = movie.release_year || ''
        directorInput.value = movie.director || ''
        ratingInput.value = movie.rating || ''

        // Enable form fields for editing
        titleInput.disabled = false
        genreInput.disabled = false
        releaseYearInput.disabled = false
        directorInput.disabled = false
        ratingInput.disabled = false
        submitBtn.disabled = false

        showToast({
          priority: 'success',
          title: 'Success',
          message: 'Movie data loaded successfully!',
        })
      })
      .catch((error) => {
        console.error('Error fetching movie data:', error)
        showToast({
          priority: 'danger',
          title: 'Error',
          message: 'Failed to load movie data. Please check the ID.',
        })
      })
  })
})

// Handle form submission for updating the movie
const formEl = document.querySelector('.form')
const submitBtn = document.querySelector('.submit-btn')

formEl.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(formEl)
  const data = Object.fromEntries(formData)
  console.log('Form data on submit:', data)

  if (
    data.title === '' ||
    data.genre === '' ||
    data.release_year === '' ||
    data.director === '' ||
    data.rating === '' ||
    !data.id
  ) {
    showToast({
      priority: 'danger',
      title: 'Error',
      message: 'Please fill in all fields.',
    })
    return
  }

  submitBtn.disabled = true
  submitBtn.textContent = 'Updating...'

  fetch(`http://localhost:3000/api/v1/movies/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: data.title,
      genre: data.genre,
      release_year: parseInt(data.release_year), // Convert year to a number
      director: data.director,
      rating: parseFloat(data.rating), // Convert rating to a float
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      return res.json()
    })
    .then((data) => {
      showToast({
        priority: 'success',
        title: 'Movie Updated',
        message: 'The movie has been updated successfully!',
      })
      setTimeout(() => {
        window.location.href = 'index.html'
      }, 2000)
    })
    .catch((error) => {
      showToast({
        priority: 'danger',
        title: 'Error',
        message: 'Failed to update the movie: ' + error.message,
      })
    })
    .finally(() => {
      submitBtn.disabled = false
      submitBtn.textContent = 'Update'
    })
})
