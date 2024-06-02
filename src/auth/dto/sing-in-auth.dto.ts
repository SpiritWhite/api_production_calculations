import {
  IsString,
  IsEmail,
  IsNotEmpty,
  ValidateIf,
  IsBoolean,
  IsOptional,
} from 'class-validator';
export class SingInAuthDto {
  @ValidateIf((value) => {
    if (value.email !== undefined) return false;
    return true;
  })
  @IsNotEmpty()
  @IsString()
  public username: string = undefined;
  @ValidateIf((value) => {
    if (value.username !== undefined) return false;
    return true;
  })
  @IsNotEmpty()
  @IsEmail()
  public email: string = undefined;
  @IsNotEmpty()
  @IsString()
  public password: string;
  @IsOptional()
  @IsBoolean()
  public remember: boolean = false;
}
