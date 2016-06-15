'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema     = mongoose.Schema;

/**
 * CDN Schema
 */
var CdnSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  url: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  version: {
    type: String,
    default: '',
    trim: true
  },
  type: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Cdn', CdnSchema);
