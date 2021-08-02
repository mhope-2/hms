import { IsString,IsNumber } from 'class-validator';

class RoomsDto {
  @IsString()
  public roomNumber: string

  @IsString()
  public floor: string

  @IsString()
  public resourceIds: string;

  @IsNumber()
  public price: Number
}

export default RoomsDto;
