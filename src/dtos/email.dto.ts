import { IsString, IsOptional, isEmail, IsEmail } from 'class-validator';
 
class EmailDto {

    @IsString()
    public userFullName: string

    @IsString()
    public subject: string

    @IsEmail()
    public senderEmail: string;
    
    @IsEmail()
    public recipientEmail: string

    @IsString()
    public recipientPhone: string

    @IsString()
    public mailContent: string
    
}
 

export default EmailDto;