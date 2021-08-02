import { IsString } from 'class-validator';

class RoomsDto {
  @IsString()
  public roomNumber: string

  @IsString()
  public floor: string

  @IsString()
  public resourceIds: string

  @IsString()
  public price: Number
}

export default RoomsDto;
