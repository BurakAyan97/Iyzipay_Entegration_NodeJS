import Iyzipay from "iyzipay";
import * as Cards from "./methods/cards";
import * as Installments from "./methods/installments";
import nanoid from "../../utils/nanoid";
import * as Logs from "../../utils/logs";
import iyzipay from "./connection/iyzipay";

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
      Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur-hata", result);
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
      Logs.logFile("2-cards-bir-kullanıcıya-kart-ekle-hata", result);
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
      Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku-hata", result);
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
      Logs.logFile("4-cards-bir-kullanıcının-kartını-sil-hata", result);
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
        result
      );
    });
};

checkInstallments();
