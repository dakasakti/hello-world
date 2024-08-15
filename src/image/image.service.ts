import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ImageService {
  async isValidImageUrl(url: string): Promise<boolean> {
    try {
      const response = await axios.head(url);
      const mimeType = response.headers['content-type'];

      return mimeType?.startsWith('image/') ?? false;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
