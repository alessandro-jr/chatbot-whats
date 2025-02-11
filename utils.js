// Envia um menu para o usuário
function sendMenu(client, chatId, menu) {
    client.sendMessage(chatId, menu);
}

// Envia uma mensagem de erro com o menu
function sendError(client, chatId, menu) {
    client.sendMessage(chatId, 'Opção inválida. Escolha uma das opções abaixo:');
    client.sendMessage(chatId, menu);
}

module.exports = {
    sendMenu,
    sendError
};
