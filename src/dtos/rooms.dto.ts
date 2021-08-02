import { MinLength, IsString, ValidateNested } from 'class-validator';

class RoomsDto {
  @IsString()
  public roomNumber: string

  @IsString()
  public floor: string

  @MinLength(24, {
    each: true,
  })
  resourceIds: string[];

  @IsString()
  public price: Number
}

export default RoomsDto;
