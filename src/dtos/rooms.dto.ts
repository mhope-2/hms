import { IsString } from 'class-validator';

class RoomsDto {
  @IsString()
  public roomNumber: string

  @IsString()
  public floor: string

  @IsString()
  resourceIds: string;

  @IsString()
  public price: Number
}

export default RoomsDto;
