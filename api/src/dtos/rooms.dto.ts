import { IsOptional, IsString, ValidateNested } from 'class-validator';

class roomsDto {
  @IsString()
  public roomNumber: string

  @IsString()
  public floor: string

  @IsString()
  public price: Object
}


export default roomsDto;