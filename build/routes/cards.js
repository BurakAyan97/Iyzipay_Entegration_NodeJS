"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ApiError = _interopRequireDefault(require("../error/ApiError"));
var Cards = _interopRequireWildcard(require("../services/iyzico/methods/cards"));
var _users = _interopRequireDefault(require("../db/users"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid"));
var _Session = _interopRequireDefault(require("../middlewares/Session"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  //KART EKLEME
  router.post("/cards", _Session.default, async (req, res) => {
    const {
      card
    } = req.body;
    let result = await Cards.createUserCard({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      email: req.user.email,
      externalId: (0, _nanoid.default)(),
      card: card,
      ...(req.user?.cardUserKey && {
        cardUserKey: req.user.cardUserKey
      })
    });
    if (!req.user.cardUserKey) {
      if (result?.status === "success" && result?.cardUserKey) {
        const user = await _users.default.findOne({
          _id: req.user?._id
        });
        user.cardUserKey = result?.cardUserKey;
        await user.save();
      }
    }
    res.json({
      result
    });
  });

  //KART OKUMA
  router.get("/cards", _Session.default, async (req, res) => {
    if (!req.user?.cardUserKey) {
      throw new _ApiError.default("User has no credit card.", 403, "userHasNoCard");
    }
    let cards = await Cards.getUserCard({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey
    });
    res.status(200).json(cards);
  });

  //KART SİLME-TOKEN
  router.delete("/cards/delete-by-token", _Session.default, async (req, res) => {
    const {
      cardToken
    } = req.body;
    if (!cardToken) {
      throw new _ApiError.default("Card token is required", 400, "cardTokenRequired");
    }
    let deleteResult = await Cards.deleteUserCard({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey,
      cardToken: cardToken
    });
    res.status(200).json(deleteResult);
  });

  //KART SİLME-INDEX
  router.delete("/cards/:cardIndex/delete-by-index", _Session.default, async (req, res) => {
    if (!req.params?.cardIndex) {
      throw new _ApiError.default("Card Index is requierd", 400, "cardIndexRequired");
    }
    let cards = await Cards.getUserCard({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey
    });
    const index = parseInt(req.params?.cardIndex);
    if (index >= cards?.cardDetails.length) {
      throw new _ApiError.default("Card doesnt exists, check index number", 400, "cardIndexInvalid");
    }
    const {
      cardToken
    } = cards?.cardDetails[index];
    let deleteResult = await Cards.deleteUserCard({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey,
      cardToken: cardToken
    });
    res.json(deleteResult);
  });
};
exports.default = _default;