import axios from "axios";
import qs from "qs";

const defaultHeaders = {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
};

const getKakaoAccessToken = async (
    code: string,
    redirectUrl: string
): Promise<any> => {
    const url = `https://kauth.kakao.com/oauth/token`;

    const body = {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: redirectUrl,
        code: code,
    };

    try {
        const response = await axios({
            method: "post",
            url: url,
            headers: defaultHeaders,
            data: qs.stringify(body),
        });

        if (response.status == 500) {
            throw "kakao interner error";
        }

        return response.data;
    } catch (e) {
        throw e;
    }
};

const getKakaoProfile = async (access_token: string): Promise<any> => {
    console.log("access token", access_token);
    const url = `https://kapi.kakao.com/v2/user/me`;

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

        console.log("response from kakao", response.data);

        return { ...response.data, email: response.data?.kakao_account?.email };
    } catch (e) {
        throw e;
    }
};

export { getKakaoAccessToken, getKakaoProfile };
