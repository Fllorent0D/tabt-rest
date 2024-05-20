import { v4 as uuidv4 } from 'uuid';

export abstract class GuidUtil {
    static generateUuid(): string {
        return uuidv4();
    }
}
