import { IsString, IsOptional, IsIn } from 'class-validator';

class PaymentsDto {

    @IsString()
    public bookingId: string;

    @IsString()
    @IsIn(['card', 'cash', 'momo'])
    public method: string;

    @IsOptional()
    @IsString()
    public transactionRef: string;

}

export default PaymentsDto;
