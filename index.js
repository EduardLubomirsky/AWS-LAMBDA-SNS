const AWS = require('aws-sdk');
const SNS = new AWS.SNS();

exports.handler = async (event) => {
    const { phoneNumber, message } = JSON.parse(event.body);
    const params = {
        PhoneNumber: phoneNumber,
        Message: message
    };

    const messageIdPromise = new Promise((resolve, reject) => {
        SNS.publish(params, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.MessageId);
            }
        });
    });

    const messageId = await messageIdPromise;

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                ...JSON.parse(event.body),
                messageId,
            }
        ),
    };
}