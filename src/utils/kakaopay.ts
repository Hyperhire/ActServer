import axios from "axios";
import { OrderPaymentType } from "../common/constants";

const kakaopayReady = async order => {
  if (order.paymentType === OrderPaymentType.SINGLE_PAYMENT) {
    const kakaopayReadyResult = await axios.post(
      "https://kapi.kakao.com/v1/payment/ready",
      {
        cid: process.env.KAKAOPAY_SINGLE_PAYMENT_CID,
        partner_order_id: order._id,
        partner_user_id: order.userId,
        item_name: `${order.targetType === "ORG" ? "단체" : "캠페인"} 기부하기`,
        item_code: order.targetId,
        quantity: 1,
        total_amount: order.amount,
        tax_free_amount: 0,
        approval_url: `http://dev.doact.co.kr/payment/${order._id}/approval`,
        cancel_url: `http://dev.doact.co.kr/payment/${order._id}/cancel`,
        fail_url: `http://dev.doact.co.kr/payment/${order._id}/fail`
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`
        }
      }
    );

    return kakaopayReadyResult;
  } else if (order.paymentType === OrderPaymentType.SUBSCRIPTION_PAYMENT) {
    console.log('subscription payment haha')
  }
  throw "Invaid Order Payment Type"
};

const kakaopayApprove = async (order, pg_token) => {
  const kakaopayApproveResult = await axios.post(
    "https://kapi.kakao.com/v1/payment/approve",
    {
      cid: process.env.KAKAOPAY_SINGLE_PAYMENT_CID,
      tid: order.kakaoTID,
      partner_order_id: order._id,
      partner_user_id: order.userId,
      pg_token: pg_token,
      total_amount: order.amount
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`
      }
    }
  );

  return kakaopayApproveResult;
};

export { kakaopayReady, kakaopayApprove };
