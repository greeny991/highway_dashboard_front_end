import jwt from 'jsonwebtoken';

export const isTokenExpired = (token: string) => {
	if (!token) return true;

	try {
		const decoded = jwt.decode(token) as { exp: number };
		if (!decoded || !decoded.exp) {
			return true;
		}
		const currentTime = new Date().getTime() / 1000;

		return decoded.exp < currentTime;
	} catch (error) {
		console.error('Error checking token expiration', error);
		return true;
	}
};
