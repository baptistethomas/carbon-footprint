import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CarbonEmissionFactorsModule } from "../carbonEmissionFactor/carbonEmissionFactors.module";
import { CarbonFootprintRecipe } from "./carbonFootprintRecipe.entity";
import {CarbonFootprintRecipeService} from "./carbonFootprintRecipe.service";
import {CarbonFootprintRecipeController} from "./carbonFootprintRecipe.controller";
import {CarbonEmissionFactorsService} from "../carbonEmissionFactor/carbonEmissionFactors.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([CarbonFootprintRecipe, CarbonEmissionFactor]),
        CarbonEmissionFactorsModule,
    ],
    providers: [
        CarbonFootprintRecipeService,
        CarbonEmissionFactorsService,
    ],
    controllers: [CarbonFootprintRecipeController],
})
export class CarbonFootprintRecipeModule {}
