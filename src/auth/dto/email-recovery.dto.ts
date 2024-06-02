import {
  IsString,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
export class EmailRecoveryDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public readonly email?: string;
}
