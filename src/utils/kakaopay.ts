import axios from "axios";

const kakaopayReady = async (order,donation) => {
    const kakaopayReadyResult = await axios.post(
        "https://kapi.kakao.com/v1/payment/ready",
        {
            "cid": process.env.KAKAOPAY_CID,
            "partner_order_id": order._id,
            "partner_user_id": order.userId,
            "item_name": `${donation._id}_${donation.isRecurring}`,
            "item_code": order.donationId,
            "quantity": 1,
            "total_amount": donation.amount,
            "tax_free_amount": 0,
            "approval_url": "https://www.doact.co.kr/approval",
            "cancel_url": "https://www.doact.co.kr/cancel",
            "fail_url": "https://www.doact.co.kr/fail"

        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                "Authorization": `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`
            }
        }
      );
      
      return kakaopayReadyResult;
}

const kakaopayApprove = async (order, donation, pg_token) => {
    console.log(order)
    const kakaopayApproveResult = await axios.post(
        "https://kapi.kakao.com/v1/payment/approve",
        {
            "cid": process.env.KAKAOPAY_CID,
            "tid": order.kakaoTID,
            "partner_order_id": order._id,
            "partner_user_id": order.userId,
            "pg_token": pg_token,
            "total_amount": donation.amount,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                "Authorization": `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`
            }
        }
      );
      
      return kakaopayApproveResult;
}

export { kakaopayReady, kakaopayApprove }