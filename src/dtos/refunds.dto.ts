import { IsString } from 'class-validator';

class RefundsDto {

    @IsString()
    public paymentId: string;

    @IsString()
    public reason: string;

}

export default RefundsDto;
