"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _carts = _interopRequireDefault(require("../db/carts"));
var _users = _interopRequireDefault(require("../db/users"));
var _ApiError = _interopRequireDefault(require("../error/ApiError"));
var _Session = _interopRequireDefault(require("../middlewares/Session"));
var Checkout = _interopRequireWildcard(require("../services/iyzico/methods/checkouts"));
var Cards = _interopRequireWildcard(require("../services/iyzico/methods/cards"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid"));
var _payments = require("../utils/payments");
var _iyzipay = _interopRequireDefault(require("iyzipay"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  //CHECKOUT FORM COMPLETE PAYMENT
  router.post("/checkout/complete/payment", async (req, res) => {
    let result = await Checkout.getFormPayment({
      locale: "tr",
      conversationId: (0, _nanoid.default)(),
      token: req.body.token
    });
    await (0, _payments.CompletePayment)(result);
    res.json(result);
  });

  //CHECKOUT FORM INITIALIZE
  router.post("/checkout/:cartId", _Session.default, async (req, res) => {
    if (!req.user?.cardUserKey) {
      throw new _ApiError.default("No registered card available", 400, "noRegisteredCardAvailable");
    }
    if (!req.params?.cartId) {
      throw new _ApiError.default("Cart id is requierd", 400, "cardIdRequired");
    }
    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");
    if (!cart) {
      throw new _ApiError.default("Cart not found", 404, "cartNotFound");
    }
    if (cart?.completed) {
      throw new _ApiError.default("Cart is completed", 400, "cartCompleted");
    }
    if (req.user.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
    }
    const paidPrice = cart.products.map(product => {
      product.price;
    }).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: "1",
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      enabledInstallments: [1, 2, 3, 4, 6, 9],
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.ENDPOINT}/checkout/complete/payment`,
      ...(req.user?.cardUserKey && {
        cardUserKey: req.user?.cardUserKey
      }),
      buyer: {
        id: String(req.user._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        zipCode: req.user?.zipCode
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, index) => {
        return {
          id: String(product._id),
          name: product?.name,
          category1: product.categories[0],
          category2: product.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await Checkout.initialize(data);
    res.json(result);
    const html = `<!DOCTYPE html>
    <html>
    <head>
    <title>Ödeme yap</title>
    <meta charset="UTF-8" />
    ${result?.checkoutFormContent}
    </head>
    </html>`;
    res.send(html);
  });
};
exports.default = _default;