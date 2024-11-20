const recipesContainer = document.querySelector('.recipes');
const searchInput = document.querySelector('.search-bar input');
const ingredientFilter = document.querySelector('.filters select:nth-child(1)');
const applianceFilter = document.querySelector('.filters select:nth-child(2)');
const ustensilFilter = document.querySelector('.filters select:nth-child(3)');
const recipesCount = document.querySelector('.filters span');

let allRecipes = [];
let selectedIngredients = [];

async function fetchRecipes() {
    const response = await fetch('https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json');
    const recipes = await response.json();
    allRecipes = recipes;
    displayRecipes(allRecipes);
    setupFilters(allRecipes);
    searchInput.addEventListener('input', applyFilters);
    [applianceFilter, ustensilFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}

function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';
    recipesCount.textContent = `${recipes.length} recette${recipes.length > 1 ? 's' : ''}`;
    if (recipes.length === 0) {
        recipesContainer.innerHTML = `<p>Aucune recette ne contient '${searchInput.value}'</p>`;
        return;
    }
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        
        const ingredientsList = recipe.ingredients.map(ing => {
            let ingredientString = ing.ingredient;
            if (ing.quantity) {
                ingredientString += `: ${ing.quantity}`;
            }
            if (ing.unit) {
                ingredientString += ` ${ing.unit}`;
            }
            return ingredientString;
        }).join(', ');

        recipeCard.innerHTML = `
            <img src="../images/${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p class="description">${recipe.description}</p>
            <div class="details">
                <p class="time"><span>Temps de préparation:</span> ${recipe.time} minutes</p>
                <p class="ingredients"><span>Ingrédients:</span> ${ingredientsList}</p>
                <p class="ustensiles"><span>Ustensiles:</span> ${recipe.ustensils.join(', ')}</p>
                <p class='appareil'><span>Appareil:</span> ${recipe.appliance}</p>
            </div>
        `;
        
        recipesContainer.appendChild(recipeCard);
    });
}

function setupFilters(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient));
        appliances.add(recipe.appliance);
        recipe.ustensils.forEach(ust => ustensils.add(ust));
    });

    populateFilter(ingredientFilter, Array.from(ingredients));
    populateFilter(applianceFilter, Array.from(appliances));
    populateFilter(ustensilFilter, Array.from(ustensils));

    ingredientFilter.addEventListener('change', addIngredientTag);
}

function populateFilter(filterElement, options) {
    filterElement.innerHTML = '<option value="">Sélectionner</option>';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.toLowerCase();
        opt.textContent = option;
        filterElement.appendChild(opt);
    });
}

function addIngredientTag() {
    const selectedIngredient = ingredientFilter.value.toLowerCase();
    if (selectedIngredient && !selectedIngredients.includes(selectedIngredient)) {
        selectedIngredients.push(selectedIngredient);
        updateIngredientTags();
        applyFilters();
    }
    ingredientFilter.value = '';
}

function updateIngredientTags() {
    const tagContainer = document.querySelector('.filters .tags') || createTagContainer();
    tagContainer.innerHTML = '';
    selectedIngredients.forEach(ingredient => {
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.textContent = ingredient;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.addEventListener('click', () => {
            selectedIngredients = selectedIngredients.filter(i => i !== ingredient);
            updateIngredientTags();
            applyFilters();
        });
        tag.appendChild(removeButton);
        tagContainer.appendChild(tag);
    });
}

function createTagContainer() {
    const tagContainer = document.createElement('div');
    tagContainer.classList.add('tags');
    ingredientFilter.parentElement.appendChild(tagContainer);
    return tagContainer;
}

function applyFilters() {
    const searchQuery = searchInput.value.toLowerCase();
    const selectedAppliance = applianceFilter.value.toLowerCase();
    const selectedUstensil = ustensilFilter.value.toLowerCase();

    const filteredRecipes = allRecipes.filter(recipe => {
        const matchesSearch = !searchQuery || 
            recipe.name.toLowerCase().includes(searchQuery) || 
            recipe.description.toLowerCase().includes(searchQuery) || 
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchQuery));
        const matchesIngredients = selectedIngredients.every(ingredient =>
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === ingredient)
        );
        const matchesAppliance = !selectedAppliance || recipe.appliance.toLowerCase() === selectedAppliance;
        const matchesUstensil = !selectedUstensil || recipe.ustensils.some(ust => ust.toLowerCase().includes(selectedUstensil));

        return matchesSearch && matchesIngredients && matchesAppliance && matchesUstensil;
    });

    displayRecipes(filteredRecipes);
}

fetchRecipes();
