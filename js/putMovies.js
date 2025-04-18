// Function to show toast notification
function showToast(type, message) {
    const toast = document.getElementById(type === 'success' ? 'successToast' : 'errorToast');
    const messageEl = document.getElementById(type === 'success' ? 'successMessage' : 'errorMessage');
    
    // Hide any existing toasts
    document.querySelectorAll('.toast').forEach(t => {
        t.classList.remove('show');
        t.classList.add('hide');
    });

    // Set message and show toast
    messageEl.textContent = message;
    setTimeout(() => {
        toast.classList.remove('hide');
        toast.classList.add('show');
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            
            // Remove hide class after animation
            setTimeout(() => {
                toast.classList.remove('hide');
            }, 500);
        }, 4000);
    }, 100);
}

// Fetch movie data when the "Fetch Movie" button is clicked
document.addEventListener('DOMContentLoaded', () => {
    const fetchMovieBtn = document.getElementById('fetchMovieBtn');
    const idInput = document.getElementById('id');
    const titleInput = document.getElementById('title');
    const genreInput = document.getElementById('genre');
    const releaseYearInput = document.getElementById('release_year');
    const directorInput = document.getElementById('director');
    const ratingInput = document.getElementById('rating');
    const submitBtn = document.querySelector('.submit-btn');

    fetchMovieBtn.addEventListener('click', () => {
        const movieId = idInput.value.trim();
        console.log('Fetching movie data for ID:', movieId);

        if (!movieId) {
            showToast('error', 'Please enter a movie ID.');
            return;
        }

        if (!/^\d+$/.test(movieId)) {
            showToast('error', 'Movie ID must be a number.');
            return;
        }

        fetch(`http://localhost:3000/api/v1/movies/${movieId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((movie) => {
                console.log('Fetched movie data:', movie);

                // Check if the movie object is valid
                if (!movie || !movie.id) {
                    showToast('error', 'Movie not found.');
                    return;
                }

                // Populate form fields (add fallbacks)
                titleInput.value = movie.title || '';
                genreInput.value = movie.genre || '';
                releaseYearInput.value = movie.release_year || '';
                directorInput.value = movie.director || '';
                ratingInput.value = movie.rating || '';

                // Enable form fields for editing
                titleInput.disabled = false;
                genreInput.disabled = false;
                releaseYearInput.disabled = false;
                directorInput.disabled = false;
                ratingInput.disabled = false;
                submitBtn.disabled = false;

                // Show success message with movie title
                showToast('success', `Movie "${movie.title}" loaded successfully!`);
            })
            .catch((error) => {
                console.error('Error fetching movie data:', error);
                showToast('error', 'Failed to load movie data. Please check the ID.');
            });
    });
});

// Handle form submission for updating the movie
const formEl = document.querySelector('#movieForm');
const submitBtn = document.querySelector('.submit-btn');

formEl.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);
    console.log('Form data on submit:', data);

    if (
        !data.title?.trim() ||
        !data.genre?.trim() ||
        !data.release_year?.trim() ||
        !data.director?.trim() ||
        !data.rating?.trim() ||
        !data.id?.trim()
    ) {
        showToast('error', 'Please fill in all fields.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';

    fetch(`http://localhost:3000/api/v1/movies/${data.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: data.title.trim(),
            genre: data.genre.trim(),
            release_year: parseInt(data.release_year),
            director: data.director.trim(),
            rating: parseFloat(data.rating),
        }),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            showToast('success', 'Movie updated successfully!');
            // Wait for the toast to be visible before redirecting
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        })
        .catch((error) => {
            console.error('Error updating movie:', error);
            showToast('error', `Failed to update movie: ${error.message}`);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Update';
        });
});
