// Includes
var http = require('../util/http.js').func;
var getProductInfo = require('./getProductInfo.js').func;
var getGeneralToken = require('../util/getGeneralToken.js').func;

// Args
exports.required = [['asset', 'product']];
exports.optional = ['jar'];

function del(jar, token, assetID){
  var httpOpt = {
    url: '//www.roblox.com/asset/delete-from-inventory',
    options: {
      method: 'POST',
      jar: jar,
      formData: {
        'assetId' : assetID
      },
      headers: {
        'X-CSRF-TOKEN': token
      }
    }
  };
  return http(httpOpt)
  .then(function (body) {
    var json = JSON.parse(body);
    var err = json.errorMsg;
    if (!err) {
      return json;
    } else {
      throw new Error(err);
    }
  });
}



//
function runWithToken (args) {
  var jar = args.jar;
  return getGeneralToken({
    jar: jar
  })
  .then(function (token) {
    return del(jar, token, args.asset);
  });
}

exports.func = function (args) {
  if (!args.product) {
    return getProductInfo({
      asset: args.asset
    })
    .then(function (product) {
      args.product = product;
      return runWithToken(args);
    });
  } else {
    return runWithToken(args);
  }
};
