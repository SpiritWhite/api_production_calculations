import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
export class SingUpAuthDto {
  @IsNotEmpty()
  @IsString()
  public username: string = undefined;

  @IsNotEmpty()
  @IsEmail()
  public email: string = undefined;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  public password: string;

  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public userImg: string;

  @IsNotEmpty()
  @IsString()
  public birthdate: Date;

  @IsBoolean()
  public isGoogleAccount: boolean = false;
}
