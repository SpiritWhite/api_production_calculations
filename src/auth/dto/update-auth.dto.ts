import { PartialType } from '@nestjs/mapped-types';
import { SingInAuthDto } from './sing-in-auth.dto';

export class UpdateAuthDto extends PartialType(SingInAuthDto) {}
