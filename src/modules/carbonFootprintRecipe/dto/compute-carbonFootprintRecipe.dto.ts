import {IsArray, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class ComputeCarbonFootprintRecipeDto {
    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsArray()
    public ingredients: CarbonFootprintRecipeIngredientDto[];
}

export class CarbonFootprintRecipeIngredientDto {
    @IsNotEmpty()
    @IsString()
    public readonly name: string;

    @IsNotEmpty()
    @IsString()
    public readonly unit: string;

    @IsNotEmpty()
    @IsNumber()
    public readonly quantity: number;
}