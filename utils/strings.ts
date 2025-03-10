export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
export function capitalizeAllLetters(string) {
	return string.toUpperCase();
}
export function toTitleCase(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

export function countWords(str) {
	return str.trim().split(/\s+/).length;
}
