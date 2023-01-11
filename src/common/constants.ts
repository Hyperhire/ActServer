export const UserType = {
  INDIVIDUAL: "individual",
  ORGANIZATION: "organization"
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

export const OrderWithdrawRequestStatus = {
  NOT_YET: "notyet",
  REQUESTED: "requested",
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
} as const;

export type TLoginType = typeof LoginType[keyof typeof LoginType]

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
  COMPLETE: "COMPLETE"
};

export const UserSex = {
  MALE: "male",
  FEMALE: "female"
};
