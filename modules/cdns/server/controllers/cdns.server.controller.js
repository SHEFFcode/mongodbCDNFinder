'use strict';

/**
 * Module dependencies
 */
var path        = require('path'),
  mongoose      = require('mongoose'),
  Cdn           = mongoose.model('Cdn'),
  errorHandler  = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an cdn
 */
exports.create = function (req, res) {
  var cdn = new Cdn(req.body);
  cdn.user = req.user;

  cdn.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cdn);
    }
  });
};

/**
 * Show the current cdn
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var cdn = req.cdn ? req.cdn.toJSON() : {};

  // Add a custom field to the CDN, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the CDN model.
  cdn.isCurrentUserOwner = !!(req.user && cdn.user && cdn.user._id.toString() === req.user._id.toString());

  res.json(cdn);
};

/**
 * Update an cdn
 */
exports.update = function (req, res) {
  var cdn = req.cdn;

  cdn.name        = req.body.name;
  cdn.url         = req.body.url;
  cdn.description = req.body.description;
  cdn.version     = req.body.version;
  cdn.type        = req.body.type;

  cdn.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cdn);
    }
  });
};

/**
 * Delete a cdn
 */
exports.delete = function (req, res) {
  var cdn = req.cdn;

  cdn.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cdn);
    }
  });
};

/**
 * List of Cdns
 */
exports.list = function (req, res) {
  Cnd.find().sort('-created').populate('user', 'displayName').exec(function (err, cdns) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cdns);
    }
  });
};

/**
 * CDN middleware
 */
exports.cdnByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cdns is invalid'
    });
  }

  Cdn.findById(id).populate('user', 'displayName').exec(function (err, cdn) {
    if (err) {
      return next(err);
    } else if (!cdn) {
      return res.status(404).send({
        message: 'No cdn with that identifier has been found'
      });
    }
    req.cdn = cdn;
    next();
  });
};
