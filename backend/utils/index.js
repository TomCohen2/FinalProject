function getCalculatedPrice(cardPrice, cardExpirationDate){
    let currentDate = Date.now()
    let delta = cardExpirationDate - currentDate
    if (delta<=86400) return 0 // less then 1 day is free
    else if (delta <= 172800) return cardPrice * 0.2 // 1 day left => 80% save
    else if (delta <= 259200) return cardPrice * 0.4 // 2 days left => 60% save 
    else if (delta <= 604800) return cardPrice * 0.5 // 1 week left => 50% save
    else if (delta <= 2629743) cardPrice * 0.8 // 1 month left => 20% save
    else return cardPrice // otherwise original user price
  }

  function getPrecentageSaved(cardCalculatedPrice,cardValue){
    const cardPrecentageSaved = (1 - cardCalculatedPrice / cardValue) * 100;
    return cardPrecentageSaved.toFixed(2) + "%";
  }

  module.exports = {getCalculatedPrice, getPrecentageSaved};
