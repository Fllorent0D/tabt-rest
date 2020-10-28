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
}
