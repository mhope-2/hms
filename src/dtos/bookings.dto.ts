import { IsString } from 'class-validator';
 
class BookingDto {

    public constructor(){}

    @IsString()
    public bookingCode: string;
    
    @IsString()
    public roomId: string

    @IsString()
    public price: string

    @IsString()
    public userPhone: string

    @IsString()
    public userEmail: string

}
 
export default BookingDto;