var router = require('express').Router();
var _ = require('lodash');
const { requiresAuth } = require('express-openid-connect');
const mfaHelper = require('../lib/auth0.service');
const allowedMfaFactor = require('../utils/allowed-mfa-factors');


router.get('/', function (req, res, next) {
  res.redirect('/profile');
});

router.get('/profile', requiresAuth(), async function (req, res, next) {
  try {
    console.log(req.oidc.user?.sub);
    const userInfo = await req.oidc.fetchUserInfo();
    const factors = await mfaHelper.getFactorsForTenant();
    console.log(factors);
    const authenticators = await mfaHelper.getAuthenticatorsForUser(req.oidc.user?.sub);
    var allwedFactorList = _.merge(_.keyBy(factors, 'name'), _.keyBy(allowedMfaFactor, 'name'));
    var factorList = _.values(allwedFactorList);
    let merged = [], showMfaWarning = false;
    if (authenticators.length > 0) {
      showMfaWarning = (authenticators.length === 1 && authenticators[0].type === "email");
      for (let i = 0; i < factorList.length; i++) {
        merged.push({
          ...factorList[i],
          ...authenticators.find(item => ((item.type === factorList[i].type)))
        });
      }
    } else {
      merged = factorList;
      showMfaWarning = true;
    }
    // console.log(`Authenticators ${JSON.stringify(authenticators)}`);
    res.render('profile', {
      userProfile: JSON.stringify(userInfo, null, 2),
      userInfo,
      allowedMfaFactor: merged,
      authenticators,
      showMfaWarning,
      title: 'My Profile'
    });
  } catch (err) {
    res.render('error', {
      message: err.message,
      error: err
    });
  }
});

router.get('/account/change_email', requiresAuth(), async function (req, res) {
  try {
    console.log(req.oidc.user?.sub, req.params.type);
    return res.oidc.login({
      returnTo: '/profile',
      authorizationParams: {
        redirect_uri: 'http://localhost:3000/callback',
        action: 'change_email'
      },
    });
  } catch (err) {
    res.render('error', {
      message: err.message,
      error: err
    });
  }
});

router.get('/account/change_password', requiresAuth(), async function (req, res) {
  try {
    console.log(req.oidc.user?.sub, req.path);
    const data = await mfaHelper.generatePasswordChangeTicket(req.oidc.user?.sub, process.env.CLIENT_ID, 'http://localhost:3000/logout');
    console.log(data);
    res.redirect(data.ticket);
  } catch (err) {
    console.log(err);
    res.render('error', {
      message: err.message,
      error: err
    });
  }
});

router.post('/account/update', requiresAuth(), async function (req, res) {
  try {
    console.log(req.oidc.user?.sub, req.body);
    const {given_name, family_name, nickname} = req.body;
    console.log(given_name, family_name, nickname);
    let name = given_name.concat(" ", family_name);
    await mfaHelper.updateUser(req.oidc.user?.sub, {name, family_name, given_name, nickname});
    res.redirect('/profile');
  } catch (err) {
    console.log(err);
    res.render('error', {
      message: err.message,
      error: err
    });
  }
});

router.get('/factor/add', requiresAuth(), async function (req, res) {
  try {
    console.log(req.oidc.user?.sub, req.params.type);
    return res.oidc.login({
      returnTo: '/profile',
      authorizationParams: {
        redirect_uri: 'http://localhost:3000/callback',
        acr_values: "http://schemas.openid.net/pape/policies/2007/06/multi-factor",
        factor_action: 'add'
      },
    });
  } catch (err) {
    res.render('error', {
      message: err.message,
      error: err
    });
  }
});

router.get('/factor/add/:type', requiresAuth(), async function (req, res) {
  try {
    console.log(req.oidc.user?.sub, req.params.type);
    return res.oidc.login({
      returnTo: '/profile',
      authorizationParams: {
        redirect_uri: 'http://localhost:3000/callback',
        acr_values: "http://schemas.openid.net/pape/policies/2007/06/multi-factor",
        factor_type: req.params.type,
        factor_action: 'add'
      },
    });
  } catch (err) {
    res.render('error', {
      message: err.message,
      error: err
    });
  }
});

router.get('/removeFactor/:id', requiresAuth(), async function (req, res) {
  try {
    console.log(req.oidc.user);
    if (req.oidc.user?.factor_id) {
      console.log(`Deleting authenticator_id ${req.oidc.user?.factor_id}`);
      await mfaHelper.deleteAuthenticatorById(req.oidc.user?.sub, req.params.id);
    }
    return res.oidc.login({
      returnTo: `/profile`,
      authorizationParams: {
        redirect_uri: 'http://localhost:3000/callback',
      }
    })
  } catch (error) {
    res.render('error', {
      message: error.message,
      error: error
    });
  }
});

router.get('/factor/delete/:id', requiresAuth(), async function (req, res) {
  try {
    console.log(req.oidc.user?.sub, req.params.id);
    //await mfaHelper.deleteAuthenticatorById(req.oidc.user?.sub, req.params.id);
    //return res.redirect('/profile');

    return res.oidc.login({
      returnTo: `/removeFactor/${req.params.id}`,
      authorizationParams: {
        redirect_uri: 'http://localhost:3000/callback',
        acr_values: "http://schemas.openid.net/pape/policies/2007/06/multi-factor",
        factor_id: req.params.id,
        factor_action: 'remove'
      }
    })

  } catch (error) {
    console.error(error);
    res.render('error', {
      message: error.message,
      error: error
    });
  }
});

router.get('/factor/recovery-code', requiresAuth(), async function (req, res) {
  try {
    console.log(req.oidc.user?.sub);
    const response = await mfaHelper.generateRecoveryCode(req.oidc.user?.sub);
    console.log(response);
    return res.json(response);
  } catch (err) {
    res.render('error', {
      message: err.message,
      error: err
    });
  }
});
module.exports = router;
