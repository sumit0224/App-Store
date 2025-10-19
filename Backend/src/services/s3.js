const AWS = require('aws-sdk');


const s3 = new AWS.S3({
region: process.env.AWS_REGION,
});


function getPresignedUploadUrl(key, contentType, expires = 60 * 5) {
const params = {
Bucket: process.env.S3_BUCKET_NAME,
Key: key,
Expires: expires,
ContentType: contentType,
};
return s3.getSignedUrlPromise('putObject', params);
}


module.exports = { getPresignedUploadUrl };