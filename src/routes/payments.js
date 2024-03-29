import moment from "moment";
import Carts from "../db/carts";
import Users from "../db/users";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as Payments from "../services/iyzico/methods/payments";
import * as Cards from "../services/iyzico/methods/cards";
import nanoid from "../utils/nanoid";
import { CompletePayment } from "../utils/payments";
import Iyzipay from "iyzipay";

export default (router) => {
  //YENİ BİR KARTLA ÖDEME OLUŞTUR VE KARTI KAYDETME
  router.post("/payments/:cartId/with-new-card", Session, async (req, res) => {
    const { card } = req.body;
    if (!card) {
      throw new ApiError("Card is requierd", 400, "cardRequired");
    }
    if (!req.params?.cartId) {
      throw new ApiError("Cart id is requierd", 400, "cardIdRequired");
    }
    const cart = await Carts.findOne({
      _id: req.params?.cartId,
    })
      .populate("buyer")
      .populate("products");
    if (!cart) {
      throw new ApiError("Cart not found", 404, "cartNotFound");
    }
    if (cart?.completed) {
      throw new ApiError("Cart is completed", 400, "cartCompleted");
    }
    card.registerCard = "0";
    const paidPrice = cart.products
      .map((product) => {
        product.price;
      })
      .reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: nanoid(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: Iyzipay.CURRENCY.TRY,
      installments: "1",
      basketId: String(cart?._id),
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard: card,
      buyer: {
        id: String(req.user._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: moment(req.user?.updatedAt).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        registrationDate: moment(req.user?.createdAt).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        zipCode: req.user?.zipCode,
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode,
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode,
      },
      basketItems: cart.products.map((product, index) => {
        return {
          id: String(product._id),
          name: product?.name,
          category1: product.categories[0],
          category2: product.categories[1],
          itemType: Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price,
        };
      }),
    };
    let result = await Payments.createPayment(data);
    await CompletePayment(result);
    res.json(result);
  });

  //YENİ BİR KARTLA ÖDEME OLUŞTUR VE KARTI KAYDET
  router.post(
    "/payments/:cartId/with-new-card/register-card",
    Session,
    async (req, res) => {
      const { card } = req.body;
      if (!card) {
        throw new ApiError("Card is requierd", 400, "cardRequired");
      }
      if (!req.params?.cartId) {
        throw new ApiError("Cart id is requierd", 400, "cardIdRequired");
      }
      const cart = await Carts.findOne({
        _id: req.params?.cartId,
      })
        .populate("buyer")
        .populate("products");
      if (!cart) {
        throw new ApiError("Cart not found", 404, "cartNotFound");
      }
      if (cart?.completed) {
        throw new ApiError("Cart is completed", 400, "cartCompleted");
      }
      if (req.user?.cardUserKey) {
        card.cardUserKey = req.user?.cardUserKey;
      }
      card.registerCard = "1";
      const paidPrice = cart.products
        .map((product) => {
          product.price;
        })
        .reduce((a, b) => a + b, 0);
      const data = {
        locale: req.user.locale,
        conversationId: nanoid(),
        price: paidPrice,
        paidPrice: paidPrice,
        currency: Iyzipay.CURRENCY.TRY,
        installments: "1",
        basketId: String(cart?._id),
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: card,
        buyer: {
          id: String(req.user._id),
          name: req.user?.name,
          surname: req.user?.surname,
          gsmNumber: req.user?.phoneNumber,
          email: req.user?.email,
          identityNumber: req.user?.identityNumber,
          lastLoginDate: moment(req.user?.updatedAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          registrationDate: moment(req.user?.createdAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          registrationAddress: req.user?.address,
          ip: req.user?.ip,
          city: req.user?.city,
          country: req.user?.country,
          zipCode: req.user?.zipCode,
        },
        shippingAddress: {
          contactName: req.user?.name + " " + req.user?.surname,
          city: req.user?.city,
          country: req.user?.country,
          address: req.user?.address,
          zipCode: req.user?.zipCode,
        },
        billingAddress: {
          contactName: req.user?.name + " " + req.user?.surname,
          city: req.user?.city,
          country: req.user?.country,
          address: req.user?.address,
          zipCode: req.user?.zipCode,
        },
        basketItems: cart.products.map((product, index) => {
          return {
            id: String(product._id),
            name: product?.name,
            category1: product.categories[0],
            category2: product.categories[1],
            itemType: Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
            price: product?.price,
          };
        }),
      };
      let result = await Payments.createPayment(data);
      if (!req.user?.cardUserKey) {
        const user = await Users.findOne({
          _id: req.user?._id,
        });
        user.cardUserKey = result?.cardUserKey;
        await user.save();
      }
      await CompletePayment(result);
      res.json(result);
    }
  );

  //VAR OLAN BİR KART İLE ÖDEME YAP -cardIndex
  router.post(
    "/payments/:cartId/:cartIndex/with-registered-card-index",
    Session,
    async (req, res) => {
      let { cardIndex } = req.params;
      if (!cardIndex) {
        throw new ApiError("Cart index is requierd", 400, "cardIndexRequired");
      }
      if (!req.user?.cardUserKey) {
        throw new ApiError(
          "No registered card available",
          400,
          "noRegisteredCardAvailable"
        );
      }
      const cards = await Cards.getUserCard({
        locale: req.user.locale,
        conversationId: nanoid(),
        cardUserKey: req.user?.cardUserKey,
      });
      const index = parseInt(cardIndex);
      if (index >= cards?.cardDetails?.length) {
        throw new ApiError("Card doesn't exist", 400, "cardIndexInvalid");
      }
      const { cardToken } = cards?.cardDetails[index];
      if (!req.params?.cartId) {
        throw new ApiError("Cart id is requierd", 400, "cardIdRequired");
      }
      const cart = await Carts.findOne({
        _id: req.params?.cartId,
      })
        .populate("buyer")
        .populate("products");
      if (!cart) {
        throw new ApiError("Cart not found", 404, "cartNotFound");
      }
      if (cart?.completed) {
        throw new ApiError("Cart is completed", 400, "cartCompleted");
      }

      const paidPrice = cart.products
        .map((product) => {
          product.price;
        })
        .reduce((a, b) => a + b, 0);
      const card = {
        cardToken,
        cardUserKey: req.user?.cardUserKey,
      };
      const data = {
        locale: req.user.locale,
        conversationId: nanoid(),
        price: paidPrice,
        paidPrice: paidPrice,
        currency: Iyzipay.CURRENCY.TRY,
        installments: "1",
        basketId: String(cart?._id),
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: card,
        buyer: {
          id: String(req.user._id),
          name: req.user?.name,
          surname: req.user?.surname,
          gsmNumber: req.user?.phoneNumber,
          email: req.user?.email,
          identityNumber: req.user?.identityNumber,
          lastLoginDate: moment(req.user?.updatedAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          registrationDate: moment(req.user?.createdAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          registrationAddress: req.user?.address,
          ip: req.user?.ip,
          city: req.user?.city,
          country: req.user?.country,
          zipCode: req.user?.zipCode,
        },
        shippingAddress: {
          contactName: req.user?.name + " " + req.user?.surname,
          city: req.user?.city,
          country: req.user?.country,
          address: req.user?.address,
          zipCode: req.user?.zipCode,
        },
        billingAddress: {
          contactName: req.user?.name + " " + req.user?.surname,
          city: req.user?.city,
          country: req.user?.country,
          address: req.user?.address,
          zipCode: req.user?.zipCode,
        },
        basketItems: cart.products.map((product, index) => {
          return {
            id: String(product._id),
            name: product?.name,
            category1: product.categories[0],
            category2: product.categories[1],
            itemType: Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
            price: product?.price,
          };
        }),
      };
      let result = await Payments.createPayment(data);
      await CompletePayment(result);
      res.json(result);
    }
  );

  //VAR OLAN BİR KART İLE ÖDEME YAP -cardToken
  router.post(
    "/payments/:cartId/with-registered-card-token",
    Session,
    async (req, res) => {
      let { cardToken } = req.body;
      if (!cardToken) {
        throw new ApiError("Cart token is requierd", 400, "cardTokenRequired");
      }
      if (!req.user?.cardUserKey) {
        throw new ApiError(
          "No registered card available",
          400,
          "noRegisteredCardAvailable"
        );
      }
      if (!req.params?.cartId) {
        throw new ApiError("Cart id is requierd", 400, "cardIdRequired");
      }
      const cart = await Carts.findOne({ _id: req.params?.cartId })
        .populate("buyer")
        .populate("products");
      if (!cart) {
        throw new ApiError("Cart not found", 404, "cartNotFound");
      }
      if (cart?.completed) {
        throw new ApiError("Cart is completed", 400, "cartCompleted");
      }

      const paidPrice = cart.products
        .map((product) => {
          product.price;
        })
        .reduce((a, b) => a + b, 0);
      const card = {
        cardToken,
        cardUserKey: req.user?.cardUserKey,
      };
      const data = {
        locale: req.user.locale,
        conversationId: nanoid(),
        price: paidPrice,
        paidPrice: paidPrice,
        currency: Iyzipay.CURRENCY.TRY,
        installments: "1",
        basketId: String(cart?._id),
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: card,
        buyer: {
          id: String(req.user._id),
          name: req.user?.name,
          surname: req.user?.surname,
          gsmNumber: req.user?.phoneNumber,
          email: req.user?.email,
          identityNumber: req.user?.identityNumber,
          lastLoginDate: moment(req.user?.updatedAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          registrationDate: moment(req.user?.createdAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          registrationAddress: req.user?.address,
          ip: req.user?.ip,
          city: req.user?.city,
          country: req.user?.country,
          zipCode: req.user?.zipCode,
        },
        shippingAddress: {
          contactName: req.user?.name + " " + req.user?.surname,
          city: req.user?.city,
          country: req.user?.country,
          address: req.user?.address,
          zipCode: req.user?.zipCode,
        },
        billingAddress: {
          contactName: req.user?.name + " " + req.user?.surname,
          city: req.user?.city,
          country: req.user?.country,
          address: req.user?.address,
          zipCode: req.user?.zipCode,
        },
        basketItems: cart.products.map((product, index) => {
          return {
            id: String(product._id),
            name: product?.name,
            category1: product.categories[0],
            category2: product.categories[1],
            itemType: Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
            price: product?.price,
          };
        }),
      };
      let result = await Payments.createPayment(data);
      await CompletePayment(result);
      res.json(result);
    }
  );
};
