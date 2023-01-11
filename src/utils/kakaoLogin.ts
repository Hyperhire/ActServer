import axios from 'axios';
import qs from 'qs';

const defaultHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  };

const authHostUrl = 'https://kauth.kakao.com';
const hostUrl = 'https://kapi.kakao.com';

const getKakaoAccessToken = async (code: string): Promise<any>  => {
    const authEndpoint = '/oauth/token';
    const url = `${authHostUrl}${authEndpoint}`;

    const body = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID,
      redirect_uri: process.env.KAKAO_REDIRECT_URL,
      code: code,
    };
    
    try {
      const response = await axios({
        method: 'post',
        url: url,
        headers: defaultHeaders,
        data: qs.stringify(body),
      });

      if (response.status == 500) {
        throw "kakao interner error"
        // throw new InternalServerErrorException('Kakao Internal Server Error');
      }

      return response.data;
    } catch (e) {
        throw e
    }
  }

const getKakaoProfile = async (access_token: string): Promise<any> => {
    const profileEndpoint = '/v2/user/me';
    const url = `${hostUrl}${profileEndpoint}`;

    try {
      const response = await axios({
        method: 'get',
        url: url,
        headers: {
            ...defaultHeaders,
            Authorization: `Bearer ${access_token}`
        }
      });

      if (response.status == 500) {
        throw "internal error"
      }

      return response.data;
    } catch (e) {
      throw e
    }
}

export {
    getKakaoAccessToken,
    getKakaoProfile
}