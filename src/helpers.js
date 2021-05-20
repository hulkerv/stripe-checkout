const moment = require('moment');
const helpers = {};

helpers.timeago = created_at => {
  return moment(created_at).fromNow();  
};


module.exports = helpers;