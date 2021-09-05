import tracer from 'dd-trace';
import { PackageService } from './common/package/package.service';
const packageService = new PackageService();
tracer.init({
    env: process.env.NODE_ENV,
    service: packageService.name,
    version: packageService.version,
  }
); // initialisé dans un fichier différent pour empêcher l'accès aux variables avant leur définition.
export default tracer;
