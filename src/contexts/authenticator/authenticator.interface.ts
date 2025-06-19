'use client';

import { IUser } from '@/interfaces/user.interface';

export interface Authenticator {
	requestOtp(email: string, isSignup: boolean): Promise<{ success: boolean; message: string }>;
	verifyOtp(email: string, otp: string): Promise<boolean>;
	resendOtp(email: string): Promise<{ success: boolean; message: string }>;
	setUser(user: IUser): void;
	setUserFromStorage(): void;
	setTokenFromStorage(): void;
	handleRefreshToken(oldRefreshToken: string): Promise<boolean>;
	signout(): Promise<void>;
	updateUser(user: Partial<IUser>): Promise<boolean>;
	user: IUser;
	accessToken: string;
	refreshToken: string;
}
