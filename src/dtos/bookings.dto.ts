import { IsString, IsOptional, IsNumber, MinLength, IsDate } from 'class-validator';
 
class BookingDto {

    @IsString()
    @IsOptional()
    public bookingCode: string;
    
    @IsString()
    public roomId: string

    @IsNumber()
    @IsOptional()
    public cost: Number

    @IsString()
    public userPhone: string

    @IsString()
    public userEmail: string

    @IsString()
    public userFullName: string

    @IsNumber()
    public numberOfPeople: Number

    @IsString()
    public startDate: String

    @IsString()
    public endDate: String
    
}
 

 

export default BookingDto;