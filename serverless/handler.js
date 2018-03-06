'use strict';

module.exports.image = (event, context, cb) => {
  const response = {
    statusCode: 301,
    headers: {
      'Location': 'https://s3.amazonaws.com/red-ethvelope/prosperity.svg',
      'Content-Type': 'image/svg+xml'
    }
  };
  cb(null, response);
}
