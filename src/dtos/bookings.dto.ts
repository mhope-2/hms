import { IsString, IsOptional } from 'class-validator';
 
class BookingDto {

    public constructor(){}

    @IsString()
    @IsOptional()
    public bookingCode: string;
    
    @IsString()
    public roomIds: string

    @IsString()
    public price: string

    @IsString()
    public userPhone: string

    @IsString()
    public userEmail: string

}
 
export default BookingDto;