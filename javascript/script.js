const recipesContainer = document.querySelector('.recipes');
const searchInput = document.querySelector('.search-bar input');

async function fetchRecipes() {
    const response = await fetch('https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json');
    const recipes = await response.json();
    displayRecipes(recipes);
    searchInput.addEventListener('input', () => filterRecipes(recipes));
}

function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        
        recipeCard.innerHTML = `
            <img src="../images/${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p class="description">${recipe.description}</p>
            <p class="ingredients">Ingrédients: ${recipe.ingredients.join(', ')}</p>
        `;
        
        recipesContainer.appendChild(recipeCard);
    });
}

function filterRecipes(recipes) {
    const query = searchInput.value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(query) || 
        recipe.description.toLowerCase().includes(query) || 
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
    );
    displayRecipes(filteredRecipes);
}

fetchRecipes();
