import { UserManager, type UserManagerSettings, Log, WebStorageStateStore } from 'oidc-client-ts';

Log.setLogger(console);

const OauthSettings: UserManagerSettings = {
  authority: 'https://oauth.battle.net/',
  client_id: process.env.BLIZZARD_CLIENT_ID!,
  client_secret: process.env.BLIZZARD_CLIENT_SECRET!,
  redirect_uri: process.env.APP_ROOT_URL + 'auth/bnet/',
  silent_redirect_uri: process.env.APP_ROOT_URL + 'auth/bnet/silent_refresh',
  post_logout_redirect_uri: process.env.APP_ROOT_URL + 'auth/login',
  response_type: 'code',
  scope: 'wow.profile openid',
  userStore: new WebStorageStateStore({ store: window.localStorage, prefix: 'bnet:' }),
  loadUserInfo: true,
};

const BnetManager = new UserManager(OauthSettings);

export default BnetManager;
