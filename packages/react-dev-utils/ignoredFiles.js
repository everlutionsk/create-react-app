/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const path = require('path');
const escape = require('escape-string-regexp');
const { getLinkedPackages } = require('link-with');

module.exports = function ignoredFiles(appSrc) {
  const linkedPackageNames = getLinkedPackages().map(pkg => pkg.name);

  if (linkedPackageNames.length === 0) return '**/node_modules/**';

  return `**/node_modules/!(${linkedPackageNames.join('|')})/**`;
};
