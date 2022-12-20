import axios from "axios";
import { OrderPaymentType, OrderType } from "../common/constants";

const kakaopayReady = async order => {
  const kakaopayReadyResult = await axios.post(
    "https://kapi.kakao.com/v1/payment/ready",
    {
      cid:
        order.paymentType === OrderPaymentType.SINGLE_PAYMENT
          ? process.env.KAKAOPAY_SINGLE_PAYMENT_CID
          : process.env.KAKAOPAY_SUBSCRIPTION_PAYMENT_CID,
      partner_order_id: order._id,
      partner_user_id: order.userId,
      item_name: `${order.targetType === "ORG" ? "단체" : "캠페인"} 일시 후원하기`,
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

const kakaopayRequestSubcription = async order => {
  const kakaopayRequestSubcriptionResult = await axios.post(
    "https://kapi.kakao.com/v1/payment/subscription",
    {
      cid: process.env.KAKAOPAY_SUBSCRIPTION_PAYMENT_CID,
      sid: order.kakaoSID,
      partner_order_id: order._id,
      partner_user_id: order.userId,
      quantity: 1,
      total_amount: order.amount,
      tax_free_amount: 0
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`
      }
    }
  );
  return kakaopayRequestSubcriptionResult;
};

export { kakaopayReady, kakaopayApprove, kakaopayRequestSubcription };
