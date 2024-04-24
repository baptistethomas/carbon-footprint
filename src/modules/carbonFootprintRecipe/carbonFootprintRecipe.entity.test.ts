import { dataSource, GreenlyDataSource } from '../../../config/dataSource';
import { CarbonFootprintRecipe } from './carbonFootprintRecipe.entity';

let carbonFootprintRecipe: CarbonFootprintRecipe;

beforeAll(async () => {
  await dataSource.initialize();
  carbonFootprintRecipe = new CarbonFootprintRecipe({
    name: "hamCheesePizza",
    carbonFootprint: null,
  });
});
beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});
describe("carbonFootprintRecipeEntity", () => {
  describe("constructor", () => {
    it("should create an carbon footprint recipe", () => {
      expect(carbonFootprintRecipe.name).toBe("hamCheesePizza");
    });
    it("should throw an error if the name is empty", () => {
      expect(() => {
        const carbonFootprintRecipe = new CarbonFootprintRecipe({
          name: "  ",
          carbonFootprint: null,
        });
      }).toThrow();
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});