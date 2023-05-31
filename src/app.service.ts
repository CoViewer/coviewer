import { Injectable } from '@nestjs/common';

import * as packageJson from '../package.json';

@Injectable()
export class AppService {
  getInfo(): object {
    return {
      site: '玖叁的漫画站',
      app: packageJson.name,
      version: packageJson.version,
      repository: packageJson.repository,
      homepage: packageJson.homepage,
    };
  }
}
