import { IsString, IsOptional, IsNumber } from 'class-validator';
 
class BookingDto {

    public constructor(){}

    @IsString()
    @IsOptional()
    public bookingCode: string;
    
    @IsString()
    public roomIds: string

    @IsNumber()
    @IsOptional()
    public cost: Number

    @IsString()
    public userPhone: string

    @IsString()
    public userEmail: string


      

}
 
export default BookingDto;