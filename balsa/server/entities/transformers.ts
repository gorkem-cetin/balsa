import { ValueTransformer } from 'typeorm';
import uuidv4 from 'uuid/v4';
import {SERVER_URL, UPLOADS_DIR} from '../constants';

export class UUIDTransformer implements ValueTransformer {
  public to(value: any): string {
    if (value){
      return value;
    }
    return uuidv4();
  }

  public from(value: string | null): string | null {
    return value;
  }
}

export class FileTransformer implements ValueTransformer {
  public to(value: string): string {
    return value;
  }

  public from(value: string | null): string | null {
    if (value) {
      return `${SERVER_URL}/${UPLOADS_DIR}/${value}`;
    } else {
      return null;
    }
  }
}
