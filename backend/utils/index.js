function getCalculatedPrice(cardPrice, cardExpirationDate){
    return cardPrice-5;
  }

  function getPrecentageSaved(cardCalculatedPrice,cardValue){
    const cardPrecentageSaved = (1 - cardCalculatedPrice / cardValue) * 100;
    return cardPrecentageSaved.toFixed(2) + "%";
  }

  module.exports = {getCalculatedPrice, getPrecentageSaved};
