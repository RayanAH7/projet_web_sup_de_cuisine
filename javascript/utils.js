function filterRecipes(recipes, ingredients, appliances, ustensils, tags) {
    return recipes.filter(recipe => {
        const matchesIngredients = ingredients.every(ingredient =>
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === ingredient)
        );
        const matchesAppliances = appliances.every(appliance =>
            recipe.appliance.toLowerCase() === appliance
        );
        const matchesUstensils = ustensils.every(ustensil =>
            recipe.ustensils.some(ust => ust.toLowerCase() === ustensil)
        );
        const matchesSearchTags = tags.every(tag =>
            recipe.name.toLowerCase().includes(tag) ||
            recipe.description.toLowerCase().includes(tag) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(tag))
        );

        return matchesIngredients && matchesAppliances && matchesUstensils && matchesSearchTags;
    });
}

export { filterRecipes };
