const { IncomingWebhook } = require('@slack/webhook');

module.exports.webhook = function(err) {
  const webhook = new IncomingWebhook(
    'https://hooks.slack.com/services/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',
  );
  // Send the notification
  (async () => {
    await webhook.send({
      text: err,
    });
  })();
};
