import fetch from 'node-fetch';

/**
 * Do the authentication, and extract the authorization response header.
 *
 * This uses the `USERNAME` and `PASSWORD` env tokens.
 *
 * @returns {Promise<void>}
 */
export async function getBearerToken() {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    redirect: 'follow',
    headers: {
      'content-type': 'application/json',
    },
  };

  const response = await fetch(
    'https://education-backend.ftrprf.be/api/users/authenticate',
    requestOptions,
  );

  console.info('Retrieved JWT token.');

  const jwt = response.headers.get('Authorization');

  // After we get a JWT, exchange it for a bearer token.
  const authRequestOptions = {
    method: 'POST',
    body: JSON.stringify({ domain: 'FTRPRF', token: jwt }),
    redirect: 'follow',
    headers: {
      'content-type': 'application/json',
    },
  };

  const authResponse = await fetch(
    'https://studio-backend.ftrprf.be/authenticate',
    authRequestOptions,
  );

  const jsonResponse = await authResponse.json();
  console.info('Retrieved bearer token.');
  return `Bearer ${jsonResponse.token}`;
}
