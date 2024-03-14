# Express OpenID Connect Webapp for My Account

This sample demonstrates authentication for an Express Node.js app. The sample quickly shows how to log in, log out, and view profile information of the logged-in user and manage the end users MFA Factors.

See a detailed walk-through of this sample app on the [Express Quickstart](https://auth0.com/docs/quickstart/webapp/express).

## Running This Sample Locally

1. Install the dependencies with npm:

```bash
npm install
```


2. Rename `.env.example` to `.env` and replace or check the following values. 

> ⚠️ Note: If you downloaded this sample app directly from Auth0 Manage Dashboard, or from Auth0 Docs _and_ you chose the Auth0 application you're creating this sample for, then you can check these are configured already: 

- `CLIENT_ID` - your Auth0 application client id
- `ISSUER_BASE_URL` - absolute URL to your Auth0 application domain (ie: `https://accountName.auth0.com`)
- `SECRET` - a randomly rengerated string. You can generate one on the command line with the following `openssl rand -hex 32`
- `DOMAIN` - your Auth0 Custom Domain
- `CANONICAL_DOMAIN` - your Auth0 domain
- `CLIENT_SECRET` - your Auth0 Machine To Machine `client_secret` authorized to access the management api

```bash
mv .env.example .env
```

3. Required Management API scopes for `CLIENT_ID`

```bash
    "update:users",
    "create:user_tickets",
    "read:guardian_factors",
    "update:guardian_factors",
    "read:guardian_enrollments",
    "delete:guardian_enrollments",
    "read:authentication_methods",
    "delete:authentication_methods"
```

4. Run the sample app:

```bash
npm start
```

The sample app will be served at `localhost:3000`.

## Features

- Update name, given_name, given_name, nickname, profile
- Change Email
- Change Password
- Manage MFA Factors

## Auth0 Post Login Actions

- [Progressive Factor Enrolment](https://gist.github.com/vikasjayaram/aeeb74676d4abb7af9b5e570010e7bbb)
- [Change Email](https://gist.github.com/vikasjayaram/1b167ac2de3dd17911539b2dc073ef3a)

## Auth0 Password Reset / Post Challenge Action

- [Password Reset Challenge](https://gist.github.com/vikasjayaram/d0ad252fe7c64659acd4fda94e1afaf5)

## TODO

- [X] Add post login actions to support progressive mfa enrolment 
- [X] Add post login action for change email flow
- [X] Add password reset / post challenge action to challenge for MFA before resetting the password.
- [ ] Add Session Management Section for end users to view / revoke current sessions.

## Support + Feedback

Please use the [Issues queue](https://github.com/vikasjayaram/auth0-use-cases/issues) in this repo for questions and feedback.

## Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## What is Auth0?

Auth0 helps you to easily:

- implement authentication with multiple identity providers, including social (e.g., Google, Facebook, Microsoft, LinkedIn, GitHub, Twitter, etc), or enterprise (e.g., Windows Azure AD, Google Apps, Active Directory, ADFS, SAML, etc.)
- log in users with username/password databases, passwordless, or multi-factor authentication
- link multiple user accounts together
- generate signed JSON Web Tokens to authorize your API calls and flow the user identity securely
- access demographics and analytics detailing how, when, and where users are logging in
- enrich user profiles from other data sources using customizable JavaScript rules

[Why Auth0?](https://auth0.com/why-auth0)

## License

This project is licensed under the MIT license. See the [LICENSE](../LICENSE) file for more info.
