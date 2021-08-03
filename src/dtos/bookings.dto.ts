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

    @IsString()
    public numberOfPeople: Number

    @IsDate()
    public startDate: Date

    @IsDate()
    public endDate: Date
    
}
 

 

export default BookingDto;