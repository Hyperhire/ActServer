import axios from "axios";
import qs from "qs";
import * as jwt from "jsonwebtoken";

const defaultHeaders = {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
};

const createSignWithAppleSecret = () => {
    const token = jwt.sign({}, process.env.APPLE_SECRET_KEY, {
        algorithm: "ES256",
        expiresIn: "1h",
        audience: "https://appleid.apple.com",
        issuer: process.env.APPLE_TEAM_ID, // TEAM_ID
        subject: process.env.APPLE_CLIENT_ID, // Service ID
        keyid: process.env.APPLE_KEY_ID, // KEY_ID
    });
    return token;
};

const getAppleAccessToken = async (code: string, redirectUrl): Promise<any> => {
    const url = `https://appleid.apple.com/auth/token`;

    const body = {
        grant_type: "authorization_code",
        code: code,
        client_secret: createSignWithAppleSecret(),
        client_id: process.env.APPLE_CLIENT_ID,
        redirect_uri: redirectUrl,
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
            // throw new InternalServerErrorException('Kakao Internal Server Error');
        }

        return response.data;
    } catch (e) {
        throw e;
    }
};

const getAppleProfile = async (access_token: string): Promise<any> => {
    const url = `https://appleid.apple.com/auth/token`;

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

        return response.data;
    } catch (e) {
        throw e;
    }
};

export { getAppleAccessToken, getAppleProfile };
