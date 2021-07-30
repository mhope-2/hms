import { IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateUserDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  public email: string;

  @IsString()
  public phone: string;

  @IsString()
  public username: string;

  @IsString()
  public password: string;

  @IsString()
  public password2: string;

  @IsOptional()
  @IsString()
  public user_token: string;

  @IsOptional()
  @IsString()
  public role: string;
}


export default CreateUserDto;