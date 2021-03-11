
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
    // Redirect to the app
    // Update this url when the app becomes a standalone app
    response.redirect('exp://192.168.1.56:19000')
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
