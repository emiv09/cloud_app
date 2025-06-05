import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';

const REGION = 'eu-north-1';
const CLIENT_ID = '6qn3i7mj4d6qiel9k0h7vv8rnl';

const client = new CognitoIdentityProviderClient({ region: REGION });

export const login = async (username: string, password: string): Promise<boolean> => {
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });

  try {
    const response = await client.send(command);
    const result = response.AuthenticationResult;

    if (result?.AccessToken) {
      localStorage.setItem('accessToken', result.AccessToken);
      localStorage.setItem('idToken', result.IdToken ?? '');
      return true;
    }

    return false;
  } catch (err: any) {
    // Log the full error object for debugging
    console.error('Login failed:', err);

    // If AWS SDK error, it often has 'name' and 'message'
    if (err.name && err.message) {
      alert(`Login failed: ${err.name} - ${err.message}`);
    } else if (typeof err === 'string') {
      alert(`Login failed: ${err}`);
    } else {
      alert('Login failed: Unknown error occurred');
    }

    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
};

export const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};
