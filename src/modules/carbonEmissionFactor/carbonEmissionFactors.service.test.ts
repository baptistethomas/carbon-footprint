import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";
import { getTestEmissionFactor } from '../../seed-dev-data';
import { dataSource, GreenlyDataSource } from '../../../config/dataSource';

let flourEmissionFactor = getTestEmissionFactor("flour");
let hamEmissionFactor = getTestEmissionFactor("ham");
let oliveOilEmissionFactor = getTestEmissionFactor("oliveOil");
let carbonEmissionFactorService: CarbonEmissionFactorsService;

beforeAll(async () => {
  await dataSource.initialize();
  carbonEmissionFactorService = new CarbonEmissionFactorsService(
    dataSource.getRepository(CarbonEmissionFactor)
  );
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource
    .getRepository(CarbonEmissionFactor)
    .save(oliveOilEmissionFactor);
});

describe("CarbonEmissionFactors.service", () => {
  it("should save new emissionFactors", async () => {
    await carbonEmissionFactorService.save([
      hamEmissionFactor,
      flourEmissionFactor,
    ]);
    const retrieveChickenEmissionFactor = await dataSource
      .getRepository(CarbonEmissionFactor)
      .findOne({ where: { name: "flour" } });
    expect(retrieveChickenEmissionFactor?.name).toBe("flour");
  });
  it("should retrieve emission Factors", async () => {
    const carbonEmissionFactors = await carbonEmissionFactorService.findAll();
    expect(carbonEmissionFactors).toHaveLength(1);
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
