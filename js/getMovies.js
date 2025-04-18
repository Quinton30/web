const API_URL = 'https://app-tslo.onrender.com/api/v1/movies'

fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
    const formattedData = data.map((movies) => [
      movies.id,
      movies.title,
      movies.genre,
      movies.release_year,
      movies.director,
      movies.rating,
    ])

    new gridjs.Grid({
      columns: ['Id', 'Title', 'Genre', 'Release Year', 'Director', 'Rating'],
      data: formattedData,
      search: true,
      sort: true,
      pagination: {
        enabled: true,
        limit: 5,
      },
      resizable: true,
      style: {
        table: {
          border: '1px solid #ccc',
        },
        th: {
          'background-color': '#f4f4f4',
          'text-align': 'left',
        },
        td: {
          padding: '8px',
          'border-bottom': '1px solid #ddd',
        },
      },
    }).render(document.getElementById('grid-container'))
  })
  .catch((error) => console.error('Error fetching data', error))
