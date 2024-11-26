import { filterRecipes } from '../javascript/utils.js';

describe('filterRecipes', () => {
    const mockRecipes = [
        {
            name: 'Recipe 1',
            ingredients: [
                { ingredient: 'Tomate' },
                { ingredient: 'Poulet' }
            ],
            appliance: 'Four',
            ustensils: ['Couteau', 'Saladier'],
            description: 'Délicieuse recette de poulet'
        },
        {
            name: 'Recipe 2',
            ingredients: [
                { ingredient: 'Riz' },
                { ingredient: 'Poisson' }
            ],
            appliance: 'Casserole',
            ustensils: ['Spatule', 'Couteau'],
            description: 'Délicieuse recette de riz'
        }
    ];

    it('should return all recipes when no filters are applied', () => {
        const filteredRecipes = filterRecipes(mockRecipes, [], [], [], []);
        expect(filteredRecipes.length).toBe(2);
    });

    it('should filter recipes by ingredient', () => {
        const filteredRecipes = filterRecipes(mockRecipes, ['tomate'], [], [], []);
        expect(filteredRecipes.length).toBe(1);
        expect(filteredRecipes[0].name).toBe('Recipe 1');
    });

    it('should filter recipes by appliance', () => {
        const filteredRecipes = filterRecipes(mockRecipes, [], ['four'], [], []);
        expect(filteredRecipes.length).toBe(1);
        expect(filteredRecipes[0].name).toBe('Recipe 1');
    });

    it('should filter recipes by ustensil', () => {
        const filteredRecipes = filterRecipes(mockRecipes, [], [], ['couteau'], []);
        expect(filteredRecipes.length).toBe(2);
    });

    it('should filter recipes by search tag', () => {
        const filteredRecipes = filterRecipes(mockRecipes, [], [], [], ['poulet']);
        expect(filteredRecipes.length).toBe(1);
        expect(filteredRecipes[0].name).toBe('Recipe 1');
    });

    it('should return no recipes if filters do not match', () => {
        const filteredRecipes = filterRecipes(mockRecipes, ['beurre'], [], [], []);
        expect(filteredRecipes.length).toBe(0);
    });
});
