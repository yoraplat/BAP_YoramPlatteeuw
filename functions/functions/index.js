
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const generator = require('generate-password');
const nodemailer = require('nodemailer');

admin.initializeApp();
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'nowaste.mailer@gmail.com',
        pass: 'a3UQ0sBacf'
    },
    tls: {
        rejectUnauthorized: false
    }
})

// Moliie api
const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: 'test_r8hU432gKuCvNcg5uBSDaAxmHaqHTd' });

exports.mollieCallback = functions.https.onRequest((request, response) => {
    // Fetch the according payment document
    admin.firestore().collection('payments').doc(request.query.id).get().then((doc) => {

        // Find the payment id in the payment document and update the payment status
        mollieClient.payments.get(doc.data().payment_id).then(async (res) => {
            await admin.firestore().collection('payments').doc(request.query.id).update({
                status: res.status
            })

            response.send({
                "message": "Payment " + res.id + " updated with status: " + res.status,
            })
        })
    })

})

exports.mollieRedirect = functions.https.onRequest((request, response) => {
    // Update this url when the app becomes a standalone app
    // response.redirect('exp://192.168.1.56:19000')
    response.redirect('nowaste://')
})


exports.mollieCheckout = functions.https.onCall((data, context) => {
    // Return payment function to obtain the uri
    return mollieClient.payments.create({
        amount: {
            value: data.price,
            currency: 'EUR'
        },
        description: data.description,
        redirectUrl: data.redirectUrl,
        webhookUrl: data.webhookUrl
    })
        .then(payment => {
            // Create a database item with payment details
            admin.firestore().collection('payments/').doc(data.payment_uid).set({
                payment_id: payment.id,
                price: payment.amount,
                buyer_id: data.buyer_id,
                status: payment.status,
                createAt: payment.createdAt
            })
            return {
                uri: payment.getCheckoutUrl(),
                payment_uid: data.payment_uid
            }
        })
        .catch(error => {
            return error
        });
})


// Chat Backend
exports.newChatMessage = functions.firestore.document('chats/{chatId}/messages/{newMessageId}').onWrite((change, context) => {
    // Listen for new chat messages
    console.log("A new message has been added to chat " + context.params.chatId + ' with the message id: ' + context.params.newMessageId)
    // If a new message has been added, send a notification to the receiving user and add a notification to the corresponding chat
    admin.firestore().collection('chats/').doc(context.params.chatId).update({
        last_message: {
            sender_id: change.after.data().sender_id,
            message_id: context.params.newMessageId
        }
    })

    admin.firestore().collection('chats').doc(context.params.chatId).get().then((res) => {
        // Get id of receiver
        let receiver
        if (res.data().seller_id == change.after.data().sender_id) {
            receiver = res.data().buyer_id
        } else {
            receiver = res.data().seller_id
        }
        // Get push token
        admin.firestore().collection('users').doc(receiver).get().then((user) => {
            sendMessage(user.data().pushtoken)
        })
    })

    const sendMessage = (token) => {
        const message = {
            to: token,
            sound: 'default',
            title: 'Je hebt een nieuw bericht gekregen',
            body: change.after.data().message,
            data: {
                screen: 'Chat',
                type: 'chat',
                // return the id of the chat belonging to the new message
                item_id: context.params.chatId
            },
        };

        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
    }
})

// Item sold
// Listen for new chats, when an item is sold a chat is created for both seller and buyer
exports.itemSold = functions.firestore.document('chats/{chatId}').onCreate((snapshot, context) => {
    const data = snapshot.data()

    // Send a notification to the seller
    // Get the pushtoken from the seller
    admin.firestore().collection('users/').doc(data.seller_id).get().then((res) => {
        sendMessage(res.data().pushtoken)
    })

    const sendMessage = (token) => {
        const message = {
            to: token,
            sound: 'default',
            title: 'Verkocht!',
            body: 'Iemand heeft ' + data.title + ' van je gekocht',
            data: {
                screen: 'Profile',
                type: 'offered',
                item_id: data.post_id
            },
        };

        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
    }
})

// Password reset
exports.passwordReset = functions.https.onCall((data, context) => {
    const newPassword = generator.generate({
        length: 10,
        numbers: true
    })

    return admin.auth().getUserByEmail(data.email)
        .then((user) => {
            admin.auth().updateUser(user.uid, {
                password: newPassword
            })
        })
        .then(() => {
            // Send an email
            let mailOptions = {
                from: 'nowaste.mailer@gmail.com',
                to: data.email,
                subject: 'Nieuw wachtwoord',
                text: 'Je nieuwe wachtwoord is "' + newPassword + '"'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                } else {
                    // return { "result": info.response }
                    console.log(info.response)
                }
            })
        })
        .catch((e) => {
            console.log(e.message)
        })
})
