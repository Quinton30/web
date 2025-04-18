// Toast handling function
function showToast(toastElement, duration = 4000) {
    // Hide any existing toasts
    document.querySelectorAll('.toast').forEach(toast => {
        toast.classList.remove('show');
        toast.classList.add('hide');
    });

    // Show new toast
    setTimeout(() => {
        toastElement.classList.remove('hide');
        toastElement.classList.add('show');
        
        // Hide toast after duration
        setTimeout(() => {
            toastElement.classList.remove('show');
            toastElement.classList.add('hide');
            
            // Remove hide class after animation
            setTimeout(() => {
                toastElement.classList.remove('hide');
            }, 500);
        }, duration);
    }, 100);
}

document.getElementById('movieForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        release_year: parseInt(document.getElementById('release_year').value),
        director: document.getElementById('director').value,
        rating: parseFloat(document.getElementById('rating').value),
    };

    try {
        const response = await fetch('http://localhost:3000/api/v1/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add movie');
        }

        // Show success toast
        showToast(document.getElementById('successToast'));

        // Reset form
        document.getElementById('movieForm').reset();
    } catch (error) {
        // Show error toast
        const errorToast = document.getElementById('errorToast');
        document.getElementById('errorMessage').textContent = error.message;
        showToast(errorToast);
    }
});
