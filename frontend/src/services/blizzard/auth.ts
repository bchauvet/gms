import { UserManager, type UserManagerSettings, Log } from 'oidc-client-ts';

Log.setLogger(console);

const OauthSettings: UserManagerSettings = {
  authority: 'https://oauth.battle.net/',
  client_id: process.env.BLIZZARD_CLIENT_ID!,
  client_secret: process.env.BLIZZARD_CLIENT_SECRET!,
  redirect_uri: `http://localhost:9000/oauth/bnet/`,
  response_type: 'code',
  scope: 'wow.profile',
};

const BnetManager = new UserManager(OauthSettings);

export default BnetManager;
