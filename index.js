const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const menus = require('./menus'); // Menus importados de outro arquivo
const { sendMenu, sendError } = require('./utils'); // Funções auxiliares

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: 'C:/CUBO/chatbot-whats/node_modules/puppeteer/Chrome-bin/chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let userState = {}; // Armazena o estado de cada usuário

// Gerar QR Code no terminal
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code gerado! Escaneie com seu WhatsApp.');
});

// Conexão do WhatsApp
client.on('ready', () => {
    console.log('Bot está pronto!');
});

// Tratamento de mensagens recebidas
client.on('message', async msg => {
    const chatId = msg.from;
    const message = msg.body.trim();

    if (!userState[chatId]) {
        userState[chatId] = { step: 'menu-principal', resumo: [], lastInteraction: Date.now() };
    }

    const user = userState[chatId];
    user.lastInteraction = Date.now(); // Atualiza a última interação

    switch (user.step) {
        case 'menu-principal':
            if (message === '1') {
                user.step = 'planos';
                user.resumo.push('Visitou: Planos e Preços');
                sendMenu(client, chatId, menus.menuPlanos);
            } else if (message === '2') {
                user.step = 'suporte';
                user.resumo.push('Visitou: Suporte Técnico');
                sendMenu(client, chatId, menus.menuSuporte);
            } else if (message === '3') {
                client.sendMessage(chatId, 'Bem-vindo à área de clientes!'); // Mensagem padrão para todos
            } else if (message === '9') {
                client.sendMessage(chatId, `Resumo das Informações:\n${user.resumo.join('\n')}`);
                user.step = 'livre';
            } else if (message === '0') {
                client.sendMessage(chatId, 'Atendimento encerrado. Obrigado por entrar em contato!');
                delete userState[chatId];
            } else {
                sendError(client, chatId, menus.menuPrincipal);
            }
            break;

        case 'planos':
            if (['1', '2', '3'].includes(message)) {
                client.sendMessage(chatId, 'Para adquirir o plano, entre em contato conosco pelo WhatsApp.');
                user.resumo.push(`Selecionou Plano ${message}`);
            } else if (message === '0') {
                user.step = 'menu-principal';
                sendMenu(client, chatId, menus.menuPrincipal);
            } else {
                sendError(client, chatId, menus.menuPlanos);
            }
            break;

        case 'suporte':
            if (['1', '2', '3'].includes(message)) {
                client.sendMessage(chatId, 'Obrigado por nos informar. Entraremos em contato para ajudar.');
                user.resumo.push(`Selecionou Suporte ${message}`);
            } else if (message === '0') {
                user.step = 'menu-principal';
                sendMenu(client, chatId, menus.menuPrincipal);
            } else {
                sendError(client, chatId, menus.menuSuporte);
            }
            break;

        case 'livre':
            if (message === '0') {
                user.step = 'menu-principal';
                sendMenu(client, chatId, menus.menuPrincipal);
            } else {
                client.sendMessage(chatId, 'Você está em modo livre. Digite 0 para encerrar o atendimento.');
            }
            break;
    }
});

// Limpeza de usuários inativos
setInterval(() => {
    const now = Date.now();
    for (const chatId in userState) {
        if (now - userState[chatId].lastInteraction > 10 * 60 * 1000) { // 10 minutos
            delete userState[chatId];
            console.log(`Usuário ${chatId} removido por inatividade.`);
        }
    }
}, 60 * 1000); // Verifica a cada minuto

// Tratamento de erros
client.on('error', error => {
    console.error('Erro no cliente:', error);
});

// Inicializa o bot
client.initialize();
