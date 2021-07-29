import { IsString } from 'class-validator';
 
class RoomResourcesDto {

    public constructor(){}

    @IsString()
    public name: string;
    
    @IsString()
    public description: string

}
 
export default RoomResourcesDto;
