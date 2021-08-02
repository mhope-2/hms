import { IsString,IsNumber,MinLength } from 'class-validator';

class RoomsDto {
  @IsString()
  public roomNumber: string

  @IsString()
  public floor: string

  @MinLength(24, {
    each: true,
    message: 'resourceId must be at least 24 characters',
  })
  public resourceIds: string[];

  @IsNumber()
  public price: Number
}

export default RoomsDto;
