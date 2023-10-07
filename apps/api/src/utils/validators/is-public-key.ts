import { PublicKey } from '@solana/web3.js';
import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function IsPublicKey(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPublicKey',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _: ValidationArguments) {
          try {
            const publicKey = new PublicKey(value);

            return !!publicKey;
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Solana public key`;
        },
      },
    });
  };
}

export function isPublicKey(address: string) {
  try {
    const publicKey = new PublicKey(address);
    return !!publicKey;
  } catch (error) {
    return false;
  }
}
