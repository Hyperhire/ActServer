import axios from "axios";
import qs from "qs";

const defaultHeaders = {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
};

const getNaverAccessToken = async (
    code: string,
    redirectUrl: string
): Promise<any> => {
    const url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&code=${code}&state=RANDOM_STATE`;
    console.log(
        "code",
        code,
        redirectUrl,
        process.env.NAVER_CLIENT_ID,
        process.env.NAVER_CLIENT_SECRET
    );
    try {
        const response = await axios({
            method: "get",
            url: url,
            headers: defaultHeaders,
        });

        console.log("response", response.data);

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

        console.log("response from naver", response.data);

        return { ...response.data?.response };
    } catch (e) {
        throw e;
    }
};

export { getNaverAccessToken, getNaverProfile };
