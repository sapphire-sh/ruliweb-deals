export const sleep = async (ms: number): Promise<void> => {
	return new Promise((x) => setTimeout(x, ms));
};
