import {CarbonFootprintRecipeService} from "./carbonFootprintRecipe.service";
import {CarbonFootprintRecipe} from "./carbonFootprintRecipe.entity";
import {Body, Controller, Get, HttpException, HttpStatus, Post, ValidationPipe} from "@nestjs/common";
import {ComputeCarbonFootprintRecipeDto} from "./dto/compute-carbonFootprintRecipe.dto";
import {CarbonFootprintRecipeAlreadyExists} from "./exceptions/carbonFootprintRecipe.exception";

@Controller("carbon-footprint-recipes")
export class CarbonFootprintRecipeController {
    constructor(
        private readonly carbonFootprintRecipeService: CarbonFootprintRecipeService,
    ) {}

    @Get()
    async listCarbonFootprintRecipes(): Promise<Array<CarbonFootprintRecipe>>{
        try {
            return await this.carbonFootprintRecipeService.listCarbonFootprintRecipes()
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('compute')
    async computeCarbonFootprintRecipe(@Body(ValidationPipe) carbonFootprintRecipeDto: ComputeCarbonFootprintRecipeDto): Promise<number | null>{
        try {
            return await this.carbonFootprintRecipeService.computeCarbonFootprintRecipe(carbonFootprintRecipeDto);
        } catch (error) {
            if (error instanceof CarbonFootprintRecipeAlreadyExists) {
                throw new HttpException(error.message, HttpStatus.CONFLICT)
            } else {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}