export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' | 'tv' {
	const userAgent = navigator.userAgent.toLowerCase();

	// Check for TV
	if (userAgent.includes('tv') || userAgent.includes('smart-tv')) {
		return 'tv';
	}

	// Check for tablet
	if (/ipad|android(?!.*mobile)/i.test(userAgent)) {
		return 'tablet';
	}

	// Check for mobile
	if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
		return 'mobile';
	}

	// Default to desktop
	return 'desktop';
}
