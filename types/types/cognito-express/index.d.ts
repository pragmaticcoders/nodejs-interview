declare module "cognito-express" {
  class CognitoExpress {
    constructor(config: {
      region: string;
      cognitoUserPoolId: string;
      tokenUse: string;
      tokenExpiration?: number;
    });

    validate(token: string, callback: (err: Error, payload: JwtToken) => void): void;
  }

  type JwtToken = {
    sub: string; // organizationId
    "cognito:groups": string[];
    "custom:externalId": string;
    token_use: "access" | "id";
    scope: string;
    auth_time: number;
    iss: string;
    exp: number;
    iat: number;
    jti: string;
    client_id: string;
    username: string;
  };

  export = CognitoExpress;
}
