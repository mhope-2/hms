import { IsOptional, IsString, ValidateNested } from 'class-validator';

class RolesDto {
  @IsString()
  public role: string

  @IsString()
  public description: string

}

export default RolesDto;