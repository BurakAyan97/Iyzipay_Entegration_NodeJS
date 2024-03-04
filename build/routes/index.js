"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _test = _interopRequireDefault(require("./test"));
var _users = _interopRequireDefault(require("./users"));
var _cards = _interopRequireDefault(require("./cards"));
var _installments = _interopRequireDefault(require("./installments"));
var _payments = _interopRequireDefault(require("./payments"));
var _paymentsThreeds = _interopRequireDefault(require("./payments-threeds"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = [_test.default, _users.default, _cards.default, _installments.default, _payments.default, _paymentsThreeds.default];