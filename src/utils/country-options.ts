import { countries } from 'countries-list';

export const countryOptions = Object.entries(countries).map(([code, data]) => ({
	label: data.name,
	value: code
}));
