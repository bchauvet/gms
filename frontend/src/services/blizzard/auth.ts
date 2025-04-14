import { UserManager, type UserManagerSettings, Log, WebStorageStateStore } from 'oidc-client-ts';

Log.setLogger(console);

const OauthSettings: UserManagerSettings = {
  authority: 'https://oauth.battle.net/',
  client_id: process.env.BLIZZARD_CLIENT_ID!,
  client_secret: process.env.BLIZZARD_CLIENT_SECRET!,
  redirect_uri: `http://localhost:9000/oauth/bnet/`,
  response_type: 'code',
  scope: 'wow.profile',
  userStore: new WebStorageStateStore({ store: window.localStorage, prefix: 'bnet:' }),
  automaticSilentRenew: true,
};

const BnetManager = new UserManager(OauthSettings);

export default BnetManager;
