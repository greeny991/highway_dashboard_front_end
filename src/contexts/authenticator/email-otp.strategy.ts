'use client';

import { Authenticator } from '@/contexts/authenticator/authenticator.interface';
import { IUser } from '@/interfaces/user.interface';
import axios from 'axios';

export default class EmailOtpAuthenticator implements Authenticator {
	private STORAGE_ACCESS_TOKEN_KEY = 'auth-access-token';
	private STORAGE_REFRESH_TOKEN_KEY = 'auth-refresh-token';
	private STORAGE_USER_KEY = 'auth-user';
	private _user?: IUser;
	private _accessToken?: string;
	private _refreshToken?: string;
	private apiUrl: string;

	constructor() {
		this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
	}

	get user(): IUser {
		return <IUser>this._user;
	}

	get accessToken(): string {
		return <string>this._accessToken;
	}

	get refreshToken(): string {
		return <string>this._refreshToken;
	}

	setUser(user: IUser): void {
		this._user = user;
		this.storageUser(user);
	}

	setUserFromStorage(): void {
		const data = localStorage.getItem(this.STORAGE_USER_KEY);
		this._user = data ? JSON.parse(data) : null;
	}

	setTokenFromStorage(): void {
		const accessToken = localStorage.getItem(this.STORAGE_ACCESS_TOKEN_KEY) as string;
		const refreshToken = localStorage.getItem(this.STORAGE_REFRESH_TOKEN_KEY) as string;
		this._accessToken = accessToken;
		this._refreshToken = refreshToken;
	}

	private storageAccessToken(accessToken: string): void {
		localStorage.setItem(this.STORAGE_ACCESS_TOKEN_KEY, accessToken);
	}

	private storageRefreshToken(refreshToken: string): void {
		localStorage.setItem(this.STORAGE_REFRESH_TOKEN_KEY, refreshToken);
	}

	private storageUser(user: IUser): void {
		localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(user));
	}

	async requestOtp(
		email: string,
		isSignup: boolean = false
	): Promise<{ success: boolean; message: string }> {
		try {
			await axios.post(`${this.apiUrl}/auth/authenticate`, { email, isSignup });
			return {
				success: true,
				message: 'OTP sent successfully'
			};
		} catch (error) {
			console.error('Error requesting OTP:', error);

			return {
				success: false,
				message: (error as any).response.data.message
			};
		}
	}

	async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
		try {
			await axios.post(`${this.apiUrl}/auth/resend-otp`, { email });
			return {
				success: true,
				message: 'OTP resent successfully'
			};
		} catch (error) {
			console.error('Error resending OTP:', error);
			return {
				success: false,
				message: (error as any).response.data.message
			};
		}
	}

	async verifyOtp(email: string, otp: string): Promise<boolean> {
		try {
			const response = await axios.post(`${this.apiUrl}/auth/verify-otp`, { email, otp });
			const { accessToken, refreshToken, user } = response.data;

			this._accessToken = accessToken;
			this._user = user;

			this.storageAccessToken(accessToken);
			this.storageUser(user);
			this.storageRefreshToken(refreshToken);

			return true;
		} catch (error) {
			console.error('Error verifying OTP:', error);
			return false;
		}
	}

	async handleRefreshToken(oldRefreshToken: string): Promise<boolean> {
		try {
			const response = await axios.post(`${this.apiUrl}/auth/refresh`, {
				refreshToken: oldRefreshToken
			});

			const { accessToken, refreshToken, user } = response.data;

			this._accessToken = accessToken;
			this._user = user;

			this.storageAccessToken(accessToken);
			this.storageUser(user);
			this.storageRefreshToken(refreshToken);

			return true;
		} catch (error) {
			console.error('Error refreshing token:', error);
			return false;
		}
	}

	async signout(): Promise<void> {
		this._user = undefined;
		this._accessToken = undefined;
		this._refreshToken = undefined;
		localStorage.clear();
	}

	async updateUser(user: Partial<IUser>): Promise<boolean> {
		try {
			console.log('Making API call to update user:', user);
			const response = await axios.put(`${this.apiUrl}/users/me`, user, {
				headers: {
					Authorization: `Bearer ${this._accessToken}`
				}
			});

			console.log('API response:', response.data);
			const updatedUser = response.data;
			if (this._user) {
				const newUser: IUser = { ...this._user, ...updatedUser };
				console.log('New user state:', newUser);
				this._user = newUser;
				this.storageUser(newUser);
			}

			return true;
		} catch (error) {
			console.error('Error updating user:', error);
			return false;
		}
	}
}
