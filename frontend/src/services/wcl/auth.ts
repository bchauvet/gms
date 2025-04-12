import { UserManager, type UserManagerSettings, Log } from 'oidc-client-ts';

Log.setLogger(console);

const OauthSettings: UserManagerSettings = {
  authority: 'https://www.warcraftlogs.com/oauth/',
  client_id: process.env.WCL_CLIENT_ID!,
  client_secret: process.env.WCL_CLIENT_SECRET!,
  redirect_uri: `http://localhost:9000/oauth/wcl/`,
  response_type: 'code',
  scope: 'wow.profile',
};

const WCLManager = new UserManager(OauthSettings);

export default WCLManager;
