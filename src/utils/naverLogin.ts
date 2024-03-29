import axios from "axios";
import qs from "qs";
import { config } from "./../config/config";

const defaultHeaders = {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
};

const getNaverAccessToken = async (
    code: string,
    redirectUrl: string
): Promise<any> => {
    const url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${config.NAVER_CLIENT_ID}&client_secret=${config.NAVER_CLIENT_SECRET}&code=${code}&state=RANDOM_STATE`;
    try {
        const response = await axios({
            method: "get",
            url: url,
            headers: defaultHeaders,
        });

        if (response.status == 500) {
            throw "Naver interner error";
        }

        return response.data;
    } catch (e) {
        throw e;
    }
};

const getNaverProfile = async (access_token: string): Promise<any> => {
    const url = "https://openapi.naver.com/v1/nid/me";

    try {
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                ...defaultHeaders,
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (response.status == 500) {
            throw "internal error";
        }

        return { ...response.data?.response };
    } catch (e) {
        throw e;
    }
};

export { getNaverAccessToken, getNaverProfile };
