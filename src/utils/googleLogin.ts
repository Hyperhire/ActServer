import axios from "axios";
import qs from "qs";
import { config } from "./../config/config";

const defaultHeaders = {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
};

const getGoogleAccessToken = async (
    code: string,
    redirectUrl: string
): Promise<any> => {
    const url = "https://oauth2.googleapis.com/token";

    const body = {
        code: code,
        client_id: config.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_CREDENTIAL,
        redirect_uri: redirectUrl,
        grant_type: "authorization_code",
    };

    try {
        const response = await axios({
            method: "post",
            url: url,
            headers: defaultHeaders,
            data: qs.stringify(body),
        });

        if (response.status == 500) {
            throw "Google interner error";
        }

        return response.data;
    } catch (e) {
        throw e;
    }
};

const getGoogleProfile = async (access_token: string): Promise<any> => {
    const url = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`;

    try {
        const response = await axios({
            method: "get",
            url: url,
            headers: defaultHeaders,
        });

        if (response.status == 500) {
            throw "Google internal error";
        }
        console.log(response.data);

        return response.data;
    } catch (e) {
        throw e;
    }
};

export { getGoogleAccessToken, getGoogleProfile };
