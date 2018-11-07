export async function sleep(tick: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, tick);
	});
}
