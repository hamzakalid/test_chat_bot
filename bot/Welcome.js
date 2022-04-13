
// Import required Bot Framework classes.
const { ActionTypes, ActivityHandler, CardFactory } = require('botbuilder');

class WelcomeBot extends ActivityHandler {
    constructor(userState) {
        super();

        this.userState = userState;

        this.onMessage(async (context, next) => {
            const text = context.activity.text.toLowerCase();
            switch (text) {
            case 'hello':
            case 'hi':
                await context.sendActivity(`You said "${ context.activity.text }"`);
                break;
            case 'intro':
            case 'help':
                await this.sendIntroCard(context);
                break;
            default:
                await context.sendActivity(`Sorry, I did not understand "${ context.activity.text }" \n\ntype **"intro"** or **"help"** for more information.`);
            }
            await next();
        });
        this.onMembersAdded(async (context, next) => {
            const userName = context.activity.from.name;
            for (const idx in context.activity.membersAdded) {
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome Dear customer 🥰.');
                    await context.sendActivity(`Welcome  ${ userName }.\n\n` +
                    'I am your personal assistant. I can help you to get the best Foods 🥪 and Drinks 🍻.\n\n' +
                    'Ask me anything about Food 🥪 and Drinks.🍻');
                }
            }
            await next();
        });
    }

    async run(context) {
        await super.run(context);

        // Save state changes
        await this.userState.saveChanges(context);
    }

    async sendIntroCard(context) {
        const card = CardFactory.heroCard(
            'Welcome To Our Restaurant!',
            'Welcome to our restaurant! We are here to serve you the best food and drinks in the city. you can select any of the options below to get started.',
            ['https://api.lorem.space/image/drink?w=500&h=300&hash=ppc9ln7k'],
            [
                {
                    type: ActionTypes.MessageBack,
                    title: 'Show Food Menu 🍴',
                    value: 'food'
                },
                {
                    type: ActionTypes.MessageBack,
                    title: 'Show Drinks Menu 🍻',
                    value: 'drinks'
                },
                {
                    type: ActionTypes.MessageBack,
                    title: 'see our location 📍',
                    value: 'location'
                }
            ]
        );

        await context.sendActivity({ attachments: [card] });
    }
}

module.exports.WelcomeBot = WelcomeBot;
