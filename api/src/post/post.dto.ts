import { IsString } from 'class-validator';
 
class CreatePostDto {

    public constructor(){}

    @IsString()
    public postImagePath: string;
    
    @IsString()
    public postTitle: string
    
    @IsString()
    public postBody: string;

    @IsString()
    public username: string;

}
 
export default CreatePostDto;