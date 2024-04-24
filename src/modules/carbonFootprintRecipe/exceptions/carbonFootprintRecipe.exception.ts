export class CarbonFootprintRecipeNameEmptyError extends Error {
    constructor(message: string = "Name can't be empty") {
        super(message);
        this.name = 'NameEmptyError';
    }
}

export class CarbonFootprintRecipeIngredientsEmptyError extends Error {
    constructor(message: string = "Ingredients can't be empty") {
        super(message);
        this.name = 'IngredientsEmptyError';
    }
}

export class CarbonFootprintRecipeAlreadyExists extends Error {
    constructor(message: string = "Recipe using this name already exists") {
        super(message);
        this.name = 'RecipeAlreadyExists';
    }
}