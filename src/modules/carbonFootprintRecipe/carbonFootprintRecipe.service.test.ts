import {dataSource} from "../../../config/dataSource";
import {CarbonFootprintRecipe} from "./carbonFootprintRecipe.entity";
import {CarbonFootprintRecipeService} from "./carbonFootprintRecipe.service";
import {getTestEmissionFactor} from "../../seed-dev-data";
import {CarbonEmissionFactor} from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import {
    ComputeCarbonFootprintRecipeDto
} from "./dto/compute-carbonFootprintRecipe.dto";
import {
    CarbonFootprintRecipeAlreadyExists,
    CarbonFootprintRecipeIngredientsEmptyError,
    CarbonFootprintRecipeNameEmptyError
} from "./exceptions/carbonFootprintRecipe.exception";

let carbonFootprintRecipeService: CarbonFootprintRecipeService;
let flourEmissionFactor = getTestEmissionFactor("flour");
let hamEmissionFactor = getTestEmissionFactor("ham");
let oliveOilEmissionFactor = getTestEmissionFactor("oliveOil");
let tomatoEmissionFactor = getTestEmissionFactor("tomato");
let cheeseEmissionFactor = getTestEmissionFactor("cheese");
let computeCarbonFootprintRecipeDto = new ComputeCarbonFootprintRecipeDto
let carbonFootprintRecipe: number | null;

const mockHamCheesePizzaIngredients = {
    ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "flour", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
}

let mockHamCheesePizzaWithFloor = {
    ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        // flour was mistyped in readme, use it as wrong ingredient
        { name: "floor", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
}

beforeAll(async () => {
    await dataSource.initialize();
    carbonFootprintRecipeService = new CarbonFootprintRecipeService(
        dataSource.getRepository(CarbonFootprintRecipe), dataSource.getRepository(CarbonEmissionFactor)
    );
});

beforeEach(async () => {
    //await GreenlyDataSource.cleanDatabase();
    await dataSource.getRepository(CarbonEmissionFactor).save(flourEmissionFactor);
    await dataSource.getRepository(CarbonEmissionFactor).save(hamEmissionFactor);
    await dataSource.getRepository(CarbonEmissionFactor).save(oliveOilEmissionFactor);
    await dataSource.getRepository(CarbonEmissionFactor).save(tomatoEmissionFactor);
    await dataSource.getRepository(CarbonEmissionFactor).save(cheeseEmissionFactor);
});

describe("CarbonFootprintRecipe.service", () => {
    it("should compute carbonFootprintRecipe and throw error because recipe name is empty", async () => {
        computeCarbonFootprintRecipeDto.name = " "
        computeCarbonFootprintRecipeDto.ingredients = []
        await expect(carbonFootprintRecipeService.computeCarbonFootprintRecipe(computeCarbonFootprintRecipeDto)).rejects.toThrow(CarbonFootprintRecipeNameEmptyError)
    });
    it("should compute carbonFootprintRecipe and throw error because recipe ingredients list is empty", async () => {
        computeCarbonFootprintRecipeDto.name = "hamCheesePizza"
        computeCarbonFootprintRecipeDto.ingredients = []
        await expect(carbonFootprintRecipeService.computeCarbonFootprintRecipe(computeCarbonFootprintRecipeDto)).rejects.toThrow(CarbonFootprintRecipeIngredientsEmptyError)
    });
    it("should compute carbonFootprintRecipe and return null because floor ingredient is mistyped", async () => {
        computeCarbonFootprintRecipeDto.name = "hamCheesePizzaWithFloor"
        computeCarbonFootprintRecipeDto.ingredients = mockHamCheesePizzaWithFloor.ingredients
        expect(await carbonFootprintRecipeService.computeCarbonFootprintRecipe(computeCarbonFootprintRecipeDto)).toBeNull()
    });
    it("should compute carbonFootprintRecipe properly and return number", async () => {
        computeCarbonFootprintRecipeDto.name = "hamCheesePizza"
        computeCarbonFootprintRecipeDto.ingredients = mockHamCheesePizzaIngredients.ingredients
        expect(typeof await carbonFootprintRecipeService.computeCarbonFootprintRecipe(computeCarbonFootprintRecipeDto)).toBe('number')
    });
    it("should compute carbonFootprintRecipe but throw already exists recipe hamCheesePizza because we create it in previous test", async () => {
        computeCarbonFootprintRecipeDto.name = "hamCheesePizza"
        computeCarbonFootprintRecipeDto.ingredients = mockHamCheesePizzaIngredients.ingredients
        await expect(carbonFootprintRecipeService.computeCarbonFootprintRecipe(computeCarbonFootprintRecipeDto)).rejects.toThrow(CarbonFootprintRecipeAlreadyExists)
    });
    it("should return carbonFootprintRecipe list", async () => {
        expect(typeof await carbonFootprintRecipeService.listCarbonFootprintRecipes()).toBe('object')
    });
});

afterAll(async () => {
    await dataSource.destroy();
});