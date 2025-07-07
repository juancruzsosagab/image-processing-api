import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import * as fs from 'fs';
import * as path from 'path';

@ValidatorConstraint({ async: true })
export class IsValidPathConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(value: string, _args: ValidationArguments) {
    if (!value) return false;

    try {
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return /^https?:\/\/.+/.test(value);
      } else {
        const fullPath = path.resolve(process.cwd(), value);
        const stats = await fs.promises.stat(fullPath);
        return stats.isFile();
      }
    } catch {
      return false;
    }
  }

  defaultMessage(_args: ValidationArguments) {
    return `${_args.property} must be a valid URL or an existing local file path`;
  }
}

export function IsValidPath(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPathConstraint,
    });
  };
}
