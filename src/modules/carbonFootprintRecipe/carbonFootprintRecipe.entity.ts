import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { isEmpty } from '../../shared/utils/stringUtils';

@Entity("carbon_footprint_recipes")
export class CarbonFootprintRecipe extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({nullable: false, unique: true})
    public name: string;

    @Column({type: "float", nullable: true})
    public carbonFootprint: number | null;

    sanitize() {
        if(isEmpty(this.name)){
            throw new Error("Name cannot be empty");
        }
    }

    constructor(props: {
        name: string;
        carbonFootprint: number | null;
    }) {
        super();
        this.name = props?.name;
        this.carbonFootprint = props?.carbonFootprint;
        this.sanitize();
    }
}
