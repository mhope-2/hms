import { IsString, IsOptional, IsNumber, MinLength } from 'class-validator';
 
class BookingDto {

    public constructor(){}

    @IsString()
    @IsOptional()
    public bookingCode: string;
    
    @MinLength(24, {
        each: true,
        message: 'roomId must be at least 24 characters',
      })
    public roomIds: string[]

    @IsNumber()
    public cost: Number

    @IsString()
    public userPhone: string

    @IsString()
    public userEmail: string

}
 
export default BookingDto;