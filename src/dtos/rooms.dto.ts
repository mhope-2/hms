import { IsString,IsNumber,MinLength } from 'class-validator';

class RoomsDto {
  @IsString()
  public roomNumber: string

  @IsString()
  public floor: string

  @MinLength(24, {
    each: true,
  })
  public resourceIds: string[];

  @IsNumber()
  public price: Number
}

export default RoomsDto;
