'use strict';


const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(response => {
        if(response.success){
            location.reload();
        }
    });
};

ApiConnector.current(response => {
    if(response.success){
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();
const requestRates = () => {
    ApiConnector.getStocks(response => {
        if(response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}
requestRates();
setInterval(requestRates, 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, response => {
        if(response.success){
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, `Баланс успешно пополнен на ${data.amount}${data.currency}`);
        } else {
            moneyManager.setMessage(!response.success, "Ошибка пополнения баланса");
        }
    });
};

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, response => {
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, `Конвертирование ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency} выполнено успешно`);      
        } else {      
            moneyManager.setMessage(!response.success, "Произошла ошибка в конвертировании валют");
        }
    });
};

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, `Перевод ${data.amount} ${data.currency} пользователю id${data.to} выполнено успешно`);      
          } else {      
            moneyManager.setMessage(!response.success, "Произошла ошибка, перевод не выполнен");
          }
    });
};

const favoritesWidget = new FavoritesWidget();
    ApiConnector.getFavorites(response => {
        if(response.success){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            favoritesWidget.updateUsersList(response.data)
        };
    });


favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {    
        if (response.success){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            favoritesWidget.updateUsersList(response.data)
            favoritesWidget.setMessage(response.success, `Пользователь ${data.name}(id:${data.id}) успешно добавлен в избранное`);
        } else {
            favoritesWidget.setMessage(!callback.success, "Произошла ошибка. Пользователь не добавлен в избранное");
        }
});
}

favoritesWidget.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, response => {
        if (response.success){
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            favoritesWidget.updateUsersList(response.data)
            favoritesWidget.setMessage(response.success, `Пользователь id:${id} успешно удален из избранного`);
        } else {
            favoritesWidget.setMessage(!callback.success, "Произошла ошибка. Пользователь не удален");
        }
    });
}

