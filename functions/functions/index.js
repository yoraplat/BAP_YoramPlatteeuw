
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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
    response.redirect('exp://192.168.1.56:19000')
    // response.redirect('nowaste://')
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
})
