const recipesContainer = document.querySelector('.recipes');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const ingredientFilter = document.querySelector('.filters select:nth-child(1)');
applianceFilter = document.querySelector('.filters select:nth-child(2)');
const ustensilFilter = document.querySelector('.filters select:nth-child(3)');
const recipesCount = document.querySelector('.filters span');

let allRecipes = [];
let selectedIngredients = [];
let selectedAppliances = [];
let selectedUstensils = [];
let searchTags = [];

async function fetchRecipes() {
    const response = await fetch('https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json');
    const recipes = await response.json();
    allRecipes = recipes;
    displayRecipes(allRecipes);
    setupFilters(allRecipes);
    searchInput.addEventListener('input', applyBasicSearch); // Recherche en temps réel
    searchButton.addEventListener('click', addSearchTag); // Recherche par tag
}

function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';
    recipesCount.textContent = `${recipes.length} recette${recipes.length > 1 ? 's' : ''}`;
    if (recipes.length === 0) {
        recipesContainer.innerHTML = `<p class="errormessage">Aucune recette ne correspond à votre recherche.</p>`;
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
    updateFilters(recipes);

    ingredientFilter.addEventListener('change', () => addTag(selectedIngredients, ingredientFilter));
    applianceFilter.addEventListener('change', () => addTag(selectedAppliances, applianceFilter));
    ustensilFilter.addEventListener('change', () => addTag(selectedUstensils, ustensilFilter));
}

function updateFilters(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient));
        appliances.add(recipe.appliance);
        recipe.ustensils.forEach(ust => ustensils.add(ust));
    });

    populateFilter(ingredientFilter, Array.from(ingredients), "Ingrédients");
    populateFilter(applianceFilter, Array.from(appliances), "Appareils");
    populateFilter(ustensilFilter, Array.from(ustensils), "Ustensiles");
}

function populateFilter(filterElement, options, filterName) {
    filterElement.innerHTML = `<option value="">${filterName}</option>`;
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.toLowerCase();
        opt.textContent = option;
        filterElement.appendChild(opt);
    });
}

function addTag(selectedArray, filterElement) {
    const selectedValue = filterElement.value.toLowerCase();
    if (selectedValue && !selectedArray.includes(selectedValue)) {
        selectedArray.push(selectedValue);
        updateTags();
        applyFilters();
    }
    filterElement.value = '';
}

function addSearchTag() {
    const searchValue = searchInput.value.toLowerCase();
    if (searchValue && !searchTags.includes(searchValue)) {
        searchTags.push(searchValue);
        searchInput.value = '';
        updateTags();
        applyFilters();
    }
}

function updateTags() {
    const tagContainer = document.querySelector('.tags') || createTagContainer();
    tagContainer.innerHTML = '';
    createTags(tagContainer, selectedIngredients, "tag-ingredient");
    createTags(tagContainer, selectedAppliances, "tag-appliance");
    createTags(tagContainer, selectedUstensils, "tag-ustensil");
    createTags(tagContainer, searchTags, "tag-search");
}

function createTags(container, array, tagClass) {
    array.forEach(value => {
        const tag = document.createElement('div');
        tag.classList.add('tag', tagClass);
        tag.textContent = value;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.addEventListener('click', () => {
            const index = array.indexOf(value);
            if (index > -1) array.splice(index, 1);
            updateTags();
            applyFilters();
        });
        tag.appendChild(removeButton);
        container.appendChild(tag);
    });
}

function createTagContainer() {
    const tagContainer = document.createElement('div');
    tagContainer.classList.add('tags');
    document.querySelector('.filters').after(tagContainer);
    return tagContainer;
}

function applyBasicSearch() {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredRecipes = allRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery) ||
        recipe.description.toLowerCase().includes(searchQuery) ||
        recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchQuery))
    );
    displayRecipes(filteredRecipes);
}

function applyFilters() {
    const filteredRecipes = allRecipes.filter(recipe => {
        const matchesIngredients = selectedIngredients.every(ingredient =>
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === ingredient)
        );
        const matchesAppliances = selectedAppliances.every(appliance =>
            recipe.appliance.toLowerCase() === appliance
        );
        const matchesUstensils = selectedUstensils.every(ustensil =>
            recipe.ustensils.some(ust => ust.toLowerCase() === ustensil)
        );
        const matchesSearchTags = searchTags.every(tag =>
            recipe.name.toLowerCase().includes(tag) ||
            recipe.description.toLowerCase().includes(tag) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(tag))
        );

        return matchesIngredients && matchesAppliances && matchesUstensils && matchesSearchTags;
    });

    displayRecipes(filteredRecipes);
    updateFilters(filteredRecipes);
}

fetchRecipes();
