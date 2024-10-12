import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Payment } from "./payment.model";
import { initiatePayment, verifyPayment } from "./payment.utils";
import { User } from "../User/user.model";

type TPayment = {
  userId: string;
};
const createPayment = async (payload: TPayment) => {
  const userId = payload.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const paymentData = {
    customerName: user?.name,
    customerEmail: user?.email,
  };
  const paymentSession = await initiatePayment(paymentData, userId);

  return paymentSession;
};
const paymentConfirmation = async ({
  transactionId,
  userId,
}: {
  transactionId: string;
  userId: string;
}) => {
  let payment;
  const verifyResponse = await verifyPayment(transactionId);
  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    const payment = await Payment.create({ userId, transactionId });
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isPremium: true,
        },
      },
      { new: true }
    );
  }

  return payment;
};

export const PaymentServices = {
  createPayment,
  paymentConfirmation,
};
