import { IsString } from 'class-validator';
 
class RoomResourcesDto {

    @IsString()
    public name: string;
    
    @IsString()
    public description: string

}
 
export default RoomResourcesDto;
