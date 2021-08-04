import { IsString,IsNumber,MinLength } from 'class-validator';

class RoomsDto {
  @IsString()
  public roomNumber: string

  @IsString()
  public floor: string

  @MinLength(1, {
    each: true,
    message: 'resources must be at least 24 characters',
  })
  public resources: string[]

  @IsNumber()
  public price: Number
}

export default RoomsDto;
