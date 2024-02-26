import Iyzipay from "iyzipay";
import * as Cards from "./methods/cards";
import * as Installments from "./methods/installments";
import nanoid from "../../utils/nanoid";
import * as Logs from "../../utils/logs";
import * as Payment from "./methods/payments";
import * as PaymentThreeDS from "./methods/threeds-payments";
import * as Checkouts from "./methods/checkouts";
import * as CancelPayments from "./methods/cancel-payment";
import * as RefundPayments from "./methods/refund-payments";

/*-------------------------------------------------------------*/
/*a) CARDS */
/*-------------------------------------------------------------*/
//Bir kullanıcı ve kart oluştur
const createUserAndCards = () => {
  Cards.createUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    email: "email@email.com",
    externalId: nanoid(),
    card: {
      cardAlias: "Kredi Kartım",
      cardHolderName: "Burak Bey",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
    },
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur-hata", err);
    });
};

// createUserAndCards();

//Bir kullanıcıya yeni bir kart ekle
const createACardForAUser = () => {
  Cards.createUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    email: "email@email.com",
    externalId: nanoid(),
    cardUserKey: "MkAL/ydAznsjcyzPa9XG8hkYwbY=",
    card: {
      cardAlias: "Kredi Kartım",
      cardHolderName: "Burak Bey",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
    },
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("2-cards-bir-kullanıcıya-kart-ekle", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("2-cards-bir-kullanıcıya-kart-ekle-hata", err);
    });
};

//createACardForAUser();

//Bir kullanıcının kartlarını oku

const readCardOfAUser = () => {
  Cards.getUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    cardUserKey: "MkAL/ydAznsjcyzPa9XG8hkYwbY=",
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku-hata", err);
    });
};

// readCardOfAUser();

//Bir kullanıcının kartını silme
const deleteCardOfAUser = () => {
  Cards.deleteUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    cardUserKey: "MkAL/ydAznsjcyzPa9XG8hkYwbY=",
    cardToken: "lLtOTnxgKgiDjUyHrBAIeRxS/g4=", //Silmek için token lazım
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("4-cards-bir-kullanıcının-kartını-sil", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("4-cards-bir-kullanıcının-kartını-sil-hata", err);
    });
};

// deleteCardOfAUser();

/*-------------------------------------------------------------*/
/*b) INSTALLMENTS */
/*-------------------------------------------------------------*/

//Bir kart ve ücretle ilgili gerçekleşebilecek taksitlerin kontrolü.

const checkInstallments = () => {
  Installments.checkInstallment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    binNumber: "55287900",
    price: "1000",
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("5-installments-bir-kart-ve-ucret-taksit-kontrolü", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile(
        "5-installments-bir-kart-ve-ucret-taksit-kontrolü-hata",
        err
      );
    });
};

// checkInstallments();

/*-------------------------------------------------------------*/
/*c) NORMAL PAYMENTS */
/*-------------------------------------------------------------*/

//Kayıtlı olmayan kartla ödeme yapmak ve kartı kaydetmek

const createPayment = () => {
  return Payment.createPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: "300",
    paidPrice: "300",
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName: "Burak Bey",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0",
    },
    buyer: {
      id: "ASDASD",
      name: "Burak",
      surname: "Ayan",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "11111111111",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2020-10-04 12:43:35",
      registrationAddress:
        "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      ip: "85.34.78.112",
      city: "İstanbul",
      country: "Türkiye",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    billingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    basketItems: [
      {
        id: "BT101",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 90,
      },
      {
        id: "BT102",
        name: "Iphone 12",
        category1: "Telefonlar",
        category1: "IOS Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 150,
      },
      {
        id: "BT103",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 60,
      },
    ],
  })
    .then((result) => {
      console.log(result);
      Logs.logFile(
        "6-payment-yeni-bir-kartla-ödeme-al-ve-kartı-kaydetme",
        result
      );
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile(
        "6-payment-yeni-bir-kartla-ödeme-al-ve-kartı-kaydetme-hata",
        err
      );
    });
};

// createPayment();
//Bir kredi kartıyla ödeme yap ve kartı kaydet
const createPaymentAndSaveKart = () => {
  return Payment.createPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: "300",
    paidPrice: "300",
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardAlias: "Kredi Kartım Ödemeden Sonra",
      cardUserKey: "MkAL/ydAznsjcyzPa9XG8hkYwbY=",
      cardHolderName: "Burak Ayan",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "1",
    },
    buyer: {
      id: "ASDASD",
      name: "Burak",
      surname: "Ayan",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "11111111111",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2020-10-04 12:43:35",
      registrationAddress:
        "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      ip: "85.34.78.112",
      city: "İstanbul",
      country: "Türkiye",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    billingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    basketItems: [
      {
        id: "BT101",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 90,
      },
      {
        id: "BT102",
        name: "Iphone 12",
        category1: "Telefonlar",
        category1: "IOS Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 150,
      },
      {
        id: "BT103",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 60,
      },
    ],
  })
    .then((result) => {
      console.log(result);
      Logs.logFile(
        "7-payment-yeni-bir-kartla-ödeme-al-ve-kartı-kaydet",
        result
      );
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile(
        "7-payment-yeni-bir-kartla-ödeme-al-ve-kartı-kaydet-hata",
        err
      );
    });
};

// createPaymentAndSaveKart();
// readCardOfAUser();

//Bir kayıtlı kart ile ödeme yap
const createPaymentWithSavedKart = () => {
  return Payment.createPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: "300",
    paidPrice: "300",
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "MkAL/ydAznsjcyzPa9XG8hkYwbY=",
      cardToken: "lLcnknbelG6he3BiIqcK51ncvUI=",
    },
    buyer: {
      id: "ASDASD",
      name: "Burak",
      surname: "Ayan",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "11111111111",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2020-10-04 12:43:35",
      registrationAddress:
        "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      ip: "85.34.78.112",
      city: "İstanbul",
      country: "Türkiye",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    billingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    basketItems: [
      {
        id: "BT101",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 90,
      },
      {
        id: "BT102",
        name: "Iphone 12",
        category1: "Telefonlar",
        category1: "IOS Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 150,
      },
      {
        id: "BT103",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 60,
      },
    ],
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("8-payment-kayıtlı-bir-kartla-ödeme-al", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("8-payment-kayıtlı-bir-kartla-ödeme-al-hata", err);
    });
};

// createPaymentWithSavedKart();

/*-------------------------------------------------------------*/
/*d) 3D Secure Payments */
/*-------------------------------------------------------------*/

const initializeThreeDSPayments = () => {
  PaymentThreeDS.initializePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: "300",
    paidPrice: "300",
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payments/3ds/complete",
    paymentCard: {
      cardHolderName: "Burak Bey",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0",
    },
    buyer: {
      id: "ASDASD",
      name: "Burak",
      surname: "Ayan",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "11111111111",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2020-10-04 12:43:35",
      registrationAddress:
        "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      ip: "85.34.78.112",
      city: "İstanbul",
      country: "Türkiye",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    billingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    basketItems: [
      {
        id: "BT101",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 90,
      },
      {
        id: "BT102",
        name: "Iphone 12",
        category1: "Telefonlar",
        category1: "IOS Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 150,
      },
      {
        id: "BT103",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 60,
      },
    ],
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("9-threeds-payments-yeni-bir-kartla-ödeme-al", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("9-threeds-payments-yeni-bir-kartla-ödeme-al-hata", err);
    });
};

// initializeThreeDSPayments();

//3ds secure tamamlama
const completeThreeDSPayment = () => {
  PaymentThreeDS.completePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    paymentId: "Siteden alınacak url'ye gönderiliyor normalde",
    conversationData: "conversation data url'ye gönderiliyor normalde",
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("10-threeds-payments-ödeme-tamamla", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("10-threeds-payments-ödeme-tamamla-hata", err);
    });
};

// completeThreeDSPayment();

//3ds ödemesini hali hazırdaki kayıtlı kartla gerçekleştir.
const initializeThreeDSPaymentsRegisteredCard = () => {
  PaymentThreeDS.initializePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: "300",
    paidPrice: "300",
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payments/3ds/complete",
    paymentCard: {
      cardUserKey: "MkAL/ydAznsjcyzPa9XG8hkYwbY=",
      cardToken: "lLcnknbelG6he3BiIqcK51ncvUI=",
    },
    buyer: {
      id: "ASDASD",
      name: "Burak",
      surname: "Ayan",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "11111111111",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2020-10-04 12:43:35",
      registrationAddress:
        "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      ip: "85.34.78.112",
      city: "İstanbul",
      country: "Türkiye",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    billingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    basketItems: [
      {
        id: "BT101",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 90,
      },
      {
        id: "BT102",
        name: "Iphone 12",
        category1: "Telefonlar",
        category1: "IOS Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 150,
      },
      {
        id: "BT103",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 60,
      },
    ],
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("11-threeds-payments-kayıtlı-bir-kartla-ödeme-al", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("11-threeds-payments-kayıtlı-bir-kartla-ödeme-al-hata", err);
    });
};

// initializeThreeDSPaymentsRegisteredCard();

//3ds ödemesini hali hazırdaki kayıtlı kartla gerçekleştir.
const initializeThreeDSPaymentsWithNewCardAndRegister = () => {
  PaymentThreeDS.initializePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: "300",
    paidPrice: "300",
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payments/3ds/complete",
    paymentCard: {
      cardAlias: "Kredi Kartım Ödemeden Sonra",
      cardUserKey: "MkAL/ydAznsjcyzPa9XG8hkYwbY=",
      cardHolderName: "Burak Ayan",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "1",
    },
    buyer: {
      id: "ASDASD",
      name: "Burak",
      surname: "Ayan",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "11111111111",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2020-10-04 12:43:35",
      registrationAddress:
        "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      ip: "85.34.78.112",
      city: "İstanbul",
      country: "Türkiye",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    billingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    basketItems: [
      {
        id: "BT101",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 90,
      },
      {
        id: "BT102",
        name: "Iphone 12",
        category1: "Telefonlar",
        category1: "IOS Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 150,
      },
      {
        id: "BT103",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 60,
      },
    ],
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("12-threeds-payments-kayıtlı-bir-kartla-ödeme-al", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("12-threeds-payments-kayıtlı-bir-kartla-ödeme-al-hata", err);
    });
};

// initializeThreeDSPaymentsWithNewCardAndRegister();
// readCardOfAUser();

/*-------------------------------------------------------------*/
/*e) CHECKOUT FORM */
/*-------------------------------------------------------------*/

//Checkout form içerisinde ödeme başlat
const initializeCheckoutForm = () => {
  Checkouts.initialize({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: "300",
    paidPrice: "300",
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/checkout/complete/payment",
    cardUserKey: "MkAL/ydAznsjcyzPa9XG8hkYwbY=",
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: "ASDASD",
      name: "Burak",
      surname: "Ayan",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "11111111111",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2020-10-04 12:43:35",
      registrationAddress:
        "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      ip: "85.34.78.112",
      city: "İstanbul",
      country: "Türkiye",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    billingAddress: {
      contactName: "Burak Ayan",
      city: "İstanbul",
      country: "Türkiye",
      address: "Osmanlı Mahallesi, Fidan Sokak, Sezgin Apartmanı No:1/19",
      zipCode: "34732",
    },
    basketItems: [
      {
        id: "BT101",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 90,
      },
      {
        id: "BT102",
        name: "Iphone 12",
        category1: "Telefonlar",
        category1: "IOS Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 150,
      },
      {
        id: "BT103",
        name: "Samsung S20",
        category1: "Telefonlar",
        category1: "Android Telefonlar",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: 60,
      },
    ],
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("13-checkout-form-payments", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("13-checkout-form-payments-hata", err);
    });
};

// initializeCheckoutForm();

//Tamamlanmış veya tamamlanmamış checkout form ödeme bilgisini gösterir
const getFormPayment = () => {
  Checkouts.getFormPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    token: "9e685609-f692-4f74-b7aa-3e4be0050e25",
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("14-checkout-form-payments-get-details", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("14-checkout-form-payments-get-details-hata", err);
    });
};

// getFormPayment();

/*-------------------------------------------------------------*/
/*f) CANCEL PAYMENTS */
/*-------------------------------------------------------------*/

//Ödemeyi iptal etme
const cancelPayments = () => {
  CancelPayments.cancelPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    paymentId: "Siteden alcan",
    ip: "85.34.78.112",
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("15-cancel-payments", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("15-cancel-payments-hata", err);
    });
};
// cancelPayments();

const cancelPaymentsWithReason = () => {
  CancelPayments.cancelPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    paymentId: "Siteden alcan",
    ip: "85.34.78.112",
    reason: Iyzipay.REFUND_REASON.BUYER_REQUEST,
    description: "Kullanıcı isteği ile iptal edildi",
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("16-cancel-payments-with-reason", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("16-cancel-payments-with-reason-hata", err);
    });
};

// cancelPaymentsWithReason();

/*-------------------------------------------------------------*/
/*g) REFUND PAYMENTS */
/*-------------------------------------------------------------*/

//Ödemenin belirli bir parçasını iade et

const refundPayment = () => {
  RefundPayments.refundPayments({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    paymentTransactionId: "Siteden alcan",
    price: "60",
    currency: Iyzipay.CURRENCY.TRY,
    ip: "85.34.78.112",
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("17-refund-payments", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("17-refund-payments", err);
    });
};
refundPayment();

//Ödemenin bir kısmını neden ve açıklama ile iade et

const refundPaymentWithReason = () => {
  RefundPayments.refundPayments({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    paymentTransactionId: "Siteden alcan",
    price: "60",
    currency: Iyzipay.CURRENCY.TRY,
    ip: "85.34.78.112",
    reason: Iyzipay.REFUND_REASON.BUYER_REQUEST,
    description: "Kullanıcı iade istedi",
  })
    .then((result) => {
      console.log(result);
      Logs.logFile("18-refund-payments-with-reason", result);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("18-refund-payments-with-reason-hata", err);
    });
};

refundPaymentWithReason();
