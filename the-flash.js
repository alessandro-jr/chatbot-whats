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

// Fluxo do bot
const flow = {
    start: {
        text: "Olá, me chamo Alessandro e sou o atendente virtual do *The Flash Play*. 👨🏻‍💻\n\nVamos iniciar seu atendimento? 😁",
        next: "mainMenu"
    },
    mainMenu: {
        text: "Digite o número da opção desejada abaixo. 👇🏼😁\n\n1️⃣ - ATIVAR MEU TESTE GRÁTIS\n2️⃣ - RENOVAR MEU PLANO\n3️⃣ - SUPORTE TÉCNICO",
        options: {
            "1": "testMenu",
            "2": "renewPlan",
            "3": "support"
        },
        invalid: "Opção inválida. Por favor, digite 1, 2 ou 3."
    },
    testMenu: {
        text: "Digite o número do dispositivo que você vai realizar o teste grátis!\n\n1️⃣ - TV Box\n2️⃣ - Fire Stick / Mi Stick\n3️⃣ - Smart TV\n4️⃣ - PC / Notebook\n5️⃣ - Celular / Tablet\n6️⃣ - ChromeCast\n7️⃣ - Xbox One\n8️⃣ - PS4",
        options: {
            "1": "tvBox",
            "2": "fireStick",
            "3": "smartTv",
            "4": "pc",
            "5": "mobile",
            "6": "chromeCast",
            "7": "xbox",
            "8": "ps4"
        },
        invalid: "Opção inválida. Por favor, escolha um número de 1 a 8."
    },
    tvBox: {
        text: "Entendi 😎\nVai assistir no TV Box.\n\nAcesse a Playstore do seu dispositivo, baixe e instale o aplicativo abaixo.\n\n*Iptv Blink Player*\n\n📸 Quando terminar de baixar e instalar só me mandar uma foto do aplicativo aberto, para que eu possa te mandar seu login de acesso!",
        next: "awaitPhoto"
    },
    fireStick: {
        text: "Entendi 😎\nVai assistir no Fire Stick.\n\nAcesse a sua loja de aplicativos no seu dispositivo, baixe e instale o aplicativo abaixo.\n\n*DOWNLOADER*\n\nApós baixar o aplicativo abra ele e coloque o link abaixo.\n\n🔗 http://abrela.me/p2beta\n\nApós colocar o link aperte em GO!\n\n📸 Quando terminar de baixar e instalar só me mandar uma foto do aplicativo aberto, para que eu possa te mandar seu login de acesso!",
        next: "awaitPhoto"
    },
    smartTv: {
        text: "Entendi 😎\nVai assistir na Smart TV.\n\nDigite o número correspondente ao sistema da sua TV.\n\n1️⃣ - SISTEMA ROKU\n2️⃣ - SISTEMA ANDROID\n3️⃣ - LG\n4️⃣ - SAMSUNG\n5️⃣ - TCL\n6️⃣ - PHILCO\n7️⃣ - PHILIPS\n8️⃣ - AOC\n9️⃣ - SONY\n🔟 - PANASONIC",
        options: {
            "1": "roku",
            "2": "androidTv",
            "3": "lg",
            "4": "samsung",
            "5": "tcl",
            "6": "philco",
            "7": "philips",
            "8": "aoc",
            "9": "sony",
            "10": "panasonic"
        },
        invalid: "Opção inválida. Por favor, escolha um número válido."
    },
    roku: {
        text: "Entendi 😎\nVai assistir na Smart TV com sistema Roku.\n\nBaixe o aplicativo *IPTV Smarters* diretamente na loja de aplicativos do seu dispositivo.\n\n📸 Quando terminar de baixar e instalar só me mandar uma foto do aplicativo aberto, para que eu possa te mandar seu login de acesso!",
        next: "awaitPhoto"
    },
    androidTv: {
        text: "Entendi 😎\nVai assistir na Smart TV com sistema Android.\n\nAcesse a Playstore da sua TV e baixe o aplicativo *IPTV Blink Player*.\n\n📸 Quando terminar de baixar e instalar só me mandar uma foto do aplicativo aberto, para que eu possa te mandar seu login de acesso!",
        next: "awaitPhoto"
    },
    lg: {
        text: "Entendi 😎\nVai assistir na Smart TV LG.\n\nBaixe o aplicativo *SS IPTV* diretamente na loja de aplicativos da sua TV.\n\n📸 Quando terminar de baixar e instalar só me mandar uma foto do aplicativo aberto, para que eu possa te mandar seu login de acesso!",
        next: "awaitPhoto"
    },
    samsung: {
        text: "Entendi 😎\nVai assistir na Smart TV Samsung.\n\nBaixe o aplicativo *Smart IPTV* diretamente na loja de aplicativos da sua TV.\n\n📸 Quando terminar de baixar e instalar só me mandar uma foto do aplicativo aberto, para que eu possa te mandar seu login de acesso!",
        next: "awaitPhoto"
    },
    pc: {
        text: "Entendi 😎\nVai assistir no PC / Notebook.\n\nAbre o WhatsApp Web no notebook ou PC e baixa o app que vou te mandar.\n\n📸 Quando terminar de baixar e instalar só me mandar uma foto do aplicativo aberto, para que eu possa te mandar seu login de acesso!",
        next: "awaitPhoto"
    },
    mobile: {
        text: "Entendi 😎\nVai assistir pelo Celular / Tablet.\n\nDigite o número correspondente ao sistema do seu aparelho:\n\n1️⃣ - Android\n2️⃣ - iPhone",
        options: {
            "1": "androidPhone",
            "2": "iosPhone"
        },
        invalid: "Opção inválida. Por favor, escolha 1 ou 2."
    },
    androidPhone: {
        text: "Entendi 😎\nVai assistir em um celular ou tablet Android.\n\nAcesse a Playstore do seu dispositivo e baixe o aplicativo *IPTV Smarters Pro*.\n\n📸 Quando terminar de baixar e instalar só me mandar uma foto do aplicativo aberto, para que eu possa te mandar seu login de acesso!",
        next: "awaitPhoto"
    },
    iosPhone: {
        text: "Entendi 😎\nVai assistir em um celular ou tablet iPhone.\n\nAcesse a App Store e baixe o aplicativo *GSE SMART IPTV*.\n\n📸 Quando terminar de baixar e instalar só me mandar uma foto do aplicativo aberto, para que eu possa te mandar seu login de acesso!",
        next: "awaitPhoto"
    },
    awaitPhoto: {
        text: "Ótimo! Agora envie a foto do aplicativo aberto para continuar o processo. 📸",
        next: "sendLogin"
    },
    sendLogin: {
        text: "Perfeito! Aqui estão os seus dados de acesso:\n\n🔑 *Usuário*: exemploUser\n🔑 *Senha*: exemploSenha\n\nObrigado por usar nossos serviços! 😊",
        next: "end"
    },
    renewPlan: {
        text: "Para renovar o plano, entre em contato diretamente com nosso suporte pelo número:\n\n📞 (00) 12345-6789\n\nObrigado! 😊",
        next: "end"
    },
    support: {
        text: "Para suporte técnico, envie uma mensagem explicando o problema e um de nossos atendentes entrará em contato com você em breve. 😊",
        next: "end"
    },
    end: {
        text: "Obrigado pelo contato! Se precisar de mais ajuda, é só mandar uma mensagem. 😉"
    }
};

// Lógica para gerenciar mensagens recebidas
client.on('message', msg => {
    const chatId = msg.from;

    if (!userState[chatId]) {
        userState[chatId] = { step: "start" };
    }

    const user = userState[chatId];
    const currentStep = flow[user.step];

    if (!currentStep) {
        msg.reply("Ocorreu um erro. Por favor, tente novamente mais tarde.");
        delete userState[chatId];
        return;
    }

    // Envia a mensagem atual
    if (currentStep.text) {
        msg.reply(currentStep.text);
    }

    // Verifica se há opções de resposta
    if (currentStep.options) {
        const userInput = msg.body.trim();
        if (currentStep.options[userInput]) {
            user.step = currentStep.options[userInput];
        } else {
            msg.reply(currentStep.invalid);
        }
    } else if (currentStep.next) {
        user.step = currentStep.next;
    } else {
        delete userState[chatId];
    }
});

// Inicializa o bot
client.initialize();
