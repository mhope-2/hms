import { IsOptional, IsString, ValidateNested } from 'class-validator';

class RolesDto {
  @IsString()
  public roomNumber: string

  @IsString()
  public floor: string

  @IsString()
  public resources: Object

  @IsString()
  public price: Number
}

export default RolesDto;