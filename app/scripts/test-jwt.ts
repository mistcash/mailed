// scripts/test-utils.ts
import { generateInputs } from 'noir-jwt';
import { JWT, KEYS } from './fixtures';

async function testFlow() {
	const result = await generateInputs({ jwt: JWT, pubkey: KEYS[0], maxSignedDataLength: 900 });
	console.log(result);

}

testFlow();