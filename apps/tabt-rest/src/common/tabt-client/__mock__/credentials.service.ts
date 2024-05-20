import { HeaderKeys } from '../../context/context.constants';

export class CredentialsService {
  enrichInputWithCredentials = jest.fn().mockImplementation((input) => {
    return {
      Credentials: {
        Account: 'test',
        Password: 'test',
      },
      ...input,
    };
  });

  get extraHeaders() {
    return { [HeaderKeys.X_FORWARDED_FOR]: '12.12.12.12' };
  }

}
