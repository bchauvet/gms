import axios from 'axios';

const getToken = async () => {
  await axios
    .post(
      'https://oauth.battle.net/token',
      {
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: process.env.BLIZZARD_CLIENT_ID!,
          password: process.env.BLIZZARD_CLIENT_SECRET!,
        },
      },
    )
    .then((resp) => {
      localStorage.setItem('authToken', resp.data.access_token);
    });
};

export { getToken };
