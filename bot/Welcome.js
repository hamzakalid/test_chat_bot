
// Import required Bot Framework classes.
const { ActionTypes, ActivityHandler, CardFactory } = require('botbuilder');

class WelcomeBot extends ActivityHandler {
    constructor(conversationState, userState, dialog) {
        super();
        // Create state property accessors
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');
        // Create state property accessors
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        // onMessage activity handler
        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');
            console.log(this.dialogState);
            const text = context.activity.text;
            switch (text) {
            case 'start':
                for (const idx in context.activity.membersAdded) {
                    if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                        await context.sendActivity('Welcome Dear customer 🥰.');
                        await context.sendActivity('Welcome  Dear Customer.\n\n' +
                            'I am your personal assistant. I can help you to get the best Foods 🥪 and Drinks 🍻.\n\n' +
                            'Ask me anything about Food 🥪 and Drinks.🍻');
                    }
                }
                break;
            case 'food':
                await context.sendActivity('Here is the list of our Food 🥪');
                await context.sendActivity('1. 🍕 Pizza 🍕\n' +
                    '2. 🍔 Burger 🍔\n' +
                    '3. 🍟 Chips 🍟\n'
                );
            // eslint-disable-next-line no-fallthrough
            case 'user':
                await context.sendActivity('Here is the list of our Drinks 🍻');
                console.log(context.activity.membersAdded);
            // eslint-disable-next-line no-fallthrough
            default:
                await context.sendActivity('Sorry, I did not understand that. Please try again.');
                break;
            }
            await this.dialog.run(context, this.dialogState);
            await next();
        });
        this.onMembersAdded(async (context, next) => {
            for (const idx in context.activity.membersAdded) {
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome Dear customer 🥰.');
                    await context.sendActivity('Welcome  Dear Customer.\n\n' +
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
        await this.conversationState.saveChanges(context, false);
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
