import { IsNotEmpty } from 'class-validator';

export class AddDeviceDto {
  @IsNotEmpty({ message: 'Device id is required' })
  deviceId: string;

  @IsNotEmpty({ message: 'Token is required' })
  token: string;
}
