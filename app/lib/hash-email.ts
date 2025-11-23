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

// Test function mirroring the Noir test
function testHashEmail() {
	const email = "cryspacedao@gmail.com";
	const expectedHash = 0x2b5dc7ea15c5584de0324e87e34e4d8c1fb751e9585e487dafc3b00ebd812dfan;
	const actualHash = hashEmail(email);

	console.log(`Testing hash_email function:`);
	console.log(`Email: ${email}`);
	console.log(`Expected: ${expectedHash.toString(16)}`);
	console.log(`Actual:   ${actualHash.toString(16)}`);
	console.log(`Match: ${actualHash === expectedHash ? '✓' : '✗'}`);

	if (actualHash !== expectedHash) {
		throw new Error(`Hash mismatch! Expected ${expectedHash.toString(16)}, got ${actualHash.toString(16)}`);
	}

	console.log('\nTest passed! ✓');
}

// Example usage
if (require.main === module) {
	testHashEmail();
}

