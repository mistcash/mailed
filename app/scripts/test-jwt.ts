import { JWT, KEYS } from './fixtures';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateInputs } from 'noir-jwt';
import * as jose from 'jose';

async function testJWTVerification() {
	console.log('Testing JWT verification...\n');
	const key = await jose.importJWK(KEYS[0]);
	const jwtVerif = await jose.jwtVerify(JWT, key);

	console.log(JSON.stringify(jwtVerif, null, 2));

	const result = await generateInputs({ jwt: JWT, pubkey: KEYS[0], maxSignedDataLength: 900 });

	const outputPath = join(process.cwd(), 'scripts', 'result.json');
	writeFileSync(outputPath, JSON.stringify(result, null, 2));

	console.log(`Results written to: ${outputPath}`);
}

testJWTVerification();