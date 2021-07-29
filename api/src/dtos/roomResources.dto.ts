import { IsString } from 'class-validator';
 
class roomResourcesDto {

    public constructor(){}

    @IsString()
    public name: string;
    
    @IsString()
    public description: string

}
 
export default roomResourcesDto;
