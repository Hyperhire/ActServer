export const UserType = {
  INDIVIDUAL: "ind",
  ORGANIZATION: "org"
};

export const OrderType = {
  ORGANIZATION: "ORG",
  CAMPAIGN: "CAMPAIGN"
};

export const OrderPaidStatus = {
  NOT_YET: "notyet",
  CANCEL: "cancel",
  FAIL: "fail",
  APPROVED: "approved"
};

export const OrderPaymentType = {
  SINGLE_PAYMENT: "SINGLE",
  SUBSCRIPTION_PAYMENT: "SUBSCRIPTION"
};

export const PaymentGateway = {
  KAKAO: "KAKAO",
  NAVER: "NAVER"
};

export const LoginType = {
  EMAIL: "EMAIL",
  KAKAO: "KAKAO",
  NAVER: "NAVER",
  APPLE: "APPLE",
  GOOGLE: "GOOGLE"
};

export const UserStatus = {
  NORMAL: "NORMAL",
  DELETED: "DELETED"
};

export const OrgStatus = {
  PENDING: "PENDING",
  AUTHORIZED: "AUTHORIZED",
  UNAVAILABLE: "UNAVAILABLE",
  DELETED: "DELETED"
};

export const PostStatus = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  DECLINED: "DECLINED",
  APPROVED: "APPROVED"
};

export const SubscriptionDate = {
  FIRST: 1,
  TENTH: 10,
  TWENTIETH: 20
};

export const WithdrawStatus = {
  PENDING: "PENDING",
  COMPELETE: "COMPLETE"
};
