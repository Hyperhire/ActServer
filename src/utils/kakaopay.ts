import axios from "axios";
import { OrderPaymentType } from "../common/constants";
import { config } from "./../config/config";

const kakaopayReady = async order => {
  try {
    const { _id, userId, targetType, targetId, amount, paymentType } = order;
    const result = await axios.post(
      "https://kapi.kakao.com/v1/payment/ready",
      {
        cid:
          paymentType === OrderPaymentType.SINGLE_PAYMENT
            ? config.KAKAOPAY_SINGLE_PAYMENT_CID
            : config.KAKAOPAY_SUBSCRIPTION_PAYMENT_CID,
        partner_order_id: _id,
        partner_user_id: userId,
        item_name: `${targetType === "ORG" ? "단체" : "캠페인"} 일시 후원하기`,
        item_code: targetId,
        quantity: 1,
        total_amount: amount,
        tax_free_amount: 0,
        approval_url: `http://dev.doact.co.kr/payment/${_id}/approval`,
        cancel_url: `http://dev.doact.co.kr/payment/${_id}/cancel`,
        fail_url: `http://dev.doact.co.kr/payment/${_id}/fail`
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: `KakaoAK ${config.KAKAO_ADMIN_KEY}`
        }
      }
    );

    return result;
  } catch (error) {
    throw error;
  }
};

const kakaopayApprove = async (order, pg_token) => {
  try {
    const { kakaoTID, _id, userId, amount } = order;
    const result = await axios.post(
      "https://kapi.kakao.com/v1/payment/approve",
      {
        cid: config.KAKAOPAY_SINGLE_PAYMENT_CID,
        tid: kakaoTID,
        partner_order_id: _id,
        partner_user_id: userId,
        pg_token: pg_token,
        total_amount: amount
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: `KakaoAK ${config.KAKAO_ADMIN_KEY}`
        }
      }
    );

    return result;
  } catch (error) {
    throw error;
  }
};

const kakaopayRequestSubcriptionPayment = async order => {
  try {
    const { _id, userId, amount, kakaoSID } = order;
    if (!kakaoSID) throw "No kakao SID";
    const result = await axios.post(
      "https://kapi.kakao.com/v1/payment/subscription",
      {
        cid: config.KAKAOPAY_SUBSCRIPTION_PAYMENT_CID,
        sid: kakaoSID,
        partner_order_id: _id,
        partner_user_id: userId,
        quantity: 1,
        total_amount: amount,
        tax_free_amount: 0
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: `KakaoAK ${config.KAKAO_ADMIN_KEY}`
        }
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const kakaopayRequestInactiveSubscriptionBySid = async kakaoSID => {
  try {
    if (!kakaoSID) throw "No kakao SID";
    const result = await axios.post(
      "https://kapi.kakao.com/v1/payment/manage/subscription/inactive",
      {
        cid: config.KAKAOPAY_SUBSCRIPTION_PAYMENT_CID,
        sid: kakaoSID
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: `KakaoAK ${config.KAKAO_ADMIN_KEY}`
        }
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export {
  kakaopayReady,
  kakaopayApprove,
  kakaopayRequestSubcriptionPayment,
  kakaopayRequestInactiveSubscriptionBySid
};
