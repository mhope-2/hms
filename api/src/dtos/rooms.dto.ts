import { IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateUserDto {
  @IsString()
  public roomNumber: string

  @IsString()
  public floor: string

  @IsString()
  public resources: string
}

  price: { type: Number, required: true}

export default CreateUserDto;