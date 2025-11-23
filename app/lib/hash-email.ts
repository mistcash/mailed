/**
 * Hash email bytes by multiplying each byte by powers of 2147483647
 * Mirrors the Noir circuit implementation (optimized version)
 */
export function hashEmail(email: string): bigint {
	const base = 2147483647n;
	const modulo = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;
	let result = 0n;
	let power = 1n;

	const emailBytes = Buffer.from(email, 'utf-8');

	for (let i = 0; i < emailBytes.length; i++) {
		const byteValue = BigInt(emailBytes[i]);
		result = (result + byteValue * power) % modulo;
		power = (power * base) % modulo;
	}

	return result;
}
