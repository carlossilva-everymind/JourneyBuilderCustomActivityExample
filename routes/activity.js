const { v1: Uuidv1 } = require('uuid');
const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');

/**
 * The Journey Builder calls this method for each contact processed by the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.execute = async (req, res) => {
  logger.info('Executing: ')
  // console.log('req.body: ', req.body);
  logger.info('req.body:')
  logger.info(req.body);

  try {
    const id = Uuidv1();
    // decode data
    const data = JWT(req.body);
    // console.log('Executing: ', data);

    console.log('decoded data:', data);
    logger.info(data);

    await SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY, [
      {
        keys: {
          Id: id,
          SubscriberKey: data.inArguments[0].contactKey,
        },
        values: {
          Event: data.inArguments[0].DropdownOptions,
          Text: data.inArguments[0].Text,
        },
      },
    ]);
  } catch (error) {
    logger.error(error);
  }

  res.status(200).send({
    status: 'ok',
  });
};

/**
 * Endpoint that receives a notification when a user saves the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.save = (req, res) => {
  res.status(200).send({
    success: true,
  });
};

/**
 *  Endpoint that receives a notification when a user publishes the journey.
 * @param req
 * @param res
 */
exports.publish = (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};

/**
 *  Endpoint that receives a notification when a user publishes the journey.
 * @param req
 * @param res
 */
exports.unpublish = (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};

/**
 * Endpoint that receives a notification when a user performs
 * some validation as part of the publishing process.
 * @param req
 * @param res
 */
exports.validate = async (req, res) => {
  logger.info('Validating: ')
  logger.info('req.body:')
  logger.info(req.body);

  try {
    // decode data
    const data = JWT(req.body);
    console.log('decoded data:', data);
    logger.info(data);

  } catch (error) {
    logger.error(error);
  }

  res.status(200).send({
    success: true,
  });
};

/**
 * Endpoint that receives a notification when a user performs
 * some validation as part of the publishing process.
 * @param req
 * @param res
 */
exports.stop = (req, res) => {
  res.status(200).send({
    success: true,
  });
};
/**
 * Endpoint that receives a notification when a user performs
 * some validation as part of the publishing process.
 * @param req
 * @param res
 */
exports.testsave = (req, res) => {
  res.status(200).send({
    success: true,
  });
};
