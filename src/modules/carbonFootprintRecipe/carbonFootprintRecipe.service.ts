import {Injectable} from "@nestjs/common";
import {CarbonFootprintRecipe} from "./carbonFootprintRecipe.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ComputeCarbonFootprintRecipeDto} from "./dto/compute-carbonFootprintRecipe.dto";
import {isEmpty} from "../../shared/utils/stringUtils";
import {
    CarbonFootprintRecipeAlreadyExists,
    CarbonFootprintRecipeIngredientsEmptyError,
    CarbonFootprintRecipeNameEmptyError
} from "./exceptions/carbonFootprintRecipe.exception";
import {CarbonEmissionFactor} from "../carbonEmissionFactor/carbonEmissionFactor.entity";

@Injectable()
export class CarbonFootprintRecipeService {

    constructor(
        @InjectRepository(CarbonFootprintRecipe)
        public carbonFootprintRecipeRepository: Repository<CarbonFootprintRecipe>,
        @InjectRepository(CarbonEmissionFactor)
        public carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>,
    ){}

    async computeCarbonFootprintRecipe(carbonFootprintRecipeDto: ComputeCarbonFootprintRecipeDto): Promise<number | null>{
        let carbonFootprint: number | null = 0;
        let hasIngredientNull = false;

        if(isEmpty(carbonFootprintRecipeDto.name)) throw new CarbonFootprintRecipeNameEmptyError();
        else if(carbonFootprintRecipeDto.ingredients.length === 0) throw new CarbonFootprintRecipeIngredientsEmptyError();

        for (const ingredient of carbonFootprintRecipeDto.ingredients){
            const ingredientFound = await this.carbonEmissionFactorRepository.findOne({ where: { name: ingredient.name, unit: ingredient.unit }})
            if(!ingredientFound) {
                hasIngredientNull = true;
                break;
            }
            carbonFootprint += ingredient.quantity * ingredientFound.emissionCO2eInKgPerUnit
        }
        if(hasIngredientNull) carbonFootprint = null;
        const carbonFootprintRecipeAlreadyExist = await this.carbonFootprintRecipeRepository.findOne({ where: { name: carbonFootprintRecipeDto.name }})

        if(!carbonFootprintRecipeAlreadyExist) {
            const carbonFootPrintRecipe = new CarbonFootprintRecipe({
                name: carbonFootprintRecipeDto.name,
                carbonFootprint: carbonFootprint
            })
            await this.carbonFootprintRecipeRepository.save(carbonFootPrintRecipe);
        } else throw new CarbonFootprintRecipeAlreadyExists();
        return carbonFootprint
    }

    async listCarbonFootprintRecipes(): Promise<Array<CarbonFootprintRecipe>> {
        return await this.carbonFootprintRecipeRepository.find();
    }
}