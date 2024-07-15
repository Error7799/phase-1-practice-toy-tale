document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const addToyForm = document.querySelector('.add-toy-form');


  fetchToys();
  addToyForm.addEventListener('submit', event => {
    event.preventDefault();
    
    const name = event.target.name.value;
    const image = event.target.image.value;

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0,
      }),
    })
      .then(response => response.json())
      .then(newToy => {
        const card = createToyCard(newToy);
        toyCollection.appendChild(card);
        event.target.reset(); 
      });
  });
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          const card = createToyCard(toy);
          toyCollection.appendChild(card);
        });
      });
  }
  function createToyCard(toy) {
    const card = document.createElement('div');
    card.classList.add('card');

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;
    card.appendChild(h2);

    const img = document.createElement('img');
    img.src = toy.image;
    img.classList.add('toy-avatar');
    card.appendChild(img);

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;
    card.appendChild(p);

    const likeBtn = document.createElement('button');
    likeBtn.classList.add('like-btn');
    likeBtn.id = toy.id;
    likeBtn.textContent = 'Like ❤️';
    likeBtn.addEventListener('click', () => {
      increaseLikes(toy, p);
    });
    card.appendChild(likeBtn);

    return card;
  }
  function increaseLikes(toy, likesElement) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        likes: newLikes,
      }),
    })
      .then(response => response.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        likesElement.textContent = `${updatedToy.likes} Likes`;
      });
  }
});
