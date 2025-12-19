import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  const signature = request.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const { transactionId, appId } = session.metadata;

        if (appId === "AIChatbot") {
          // ✅ Find unpaid transaction
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });

          if (transaction) {
            // ✅ Add credits to user
            await User.updateOne(
              { _id: transaction.userId },
              { $inc: { credits: transaction.credits } }
            );

            // ✅ Mark transaction as paid
            transaction.isPaid = true;
            await transaction.save();
          }
        } else {
          return response.json({
            received: true,
            message: "Ignored event: Invalid app",
          });
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    response.json({ received: true });
  } catch (error) {
    console.error("Webhook Processing Error:", error);
    response.status(500).send("Internal Server Error");
  }
};

// import Stripe from "stripe";
// import Transaction from "../models/Transaction.js";
// import User from "../models/User.js";

// export const stripeWebhooks = async (request, response) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//   const signature = request.headers["stripe-signature"];

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       request.body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (error) {
//     return response.status(400).send(`Webhook Error: ${error.message}`);
//   }

//   try {
//     switch (event.type) {
//       case "payment_intent.succeeded": {
//         const intent = event.data.object;
//         const sessionList = await stripe.checkout.sessions.list({
//           payment_intent: paymentintent.id,
//         });
//         const session = sessionList.data[0];
//         const { transactionId, appId } = session.metadata;
//         if (appId === "AIChatbot") {
//           const transaction = await Transaction.findOne({
//             _id: transactionId,
//             isPaid: false,
//           });

//           // update credit in user Account
//           await User.updateOne(
//             { _id: transaction.userId },
//             { $inc: { credits: transaction.credits } }
//           );

//           // update payment status
//           transaction.isPaid = true;
//           await transaction.save();
//         } else {
//           return response.json({
//             received: true,
//             message: "Ignored event: Invalid app",
//           });
//         }
//         break;
//       }

//       default:
//         console.log("Unhandled event type: ", event.type);

//         break;
//     }
//     response.json({ received: true });
//   } catch (error) {
//     console.error("Webhook Processing Error: ", error);
//     response.status(500).send("Internal Server Error");
//   }
// };
