import { JWT, KEYS } from './fixtures';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateInputs } from 'noir-jwt';
import * as jose from 'jose';

const pubkey = KEYS[0];
const jwt = JWT;

async function testJWTVerification() {
	console.log('Testing JWT verification...\n');
	const key = await jose.importJWK(pubkey);
	const jwtVerif = await jose.jwtVerify(jwt, key);

	console.log(JSON.stringify(jwtVerif, null, 2));

	const result = await generateInputs({ jwt, pubkey, maxSignedDataLength: 900 });

	const outputPath = join(process.cwd(), 'scripts', 'result.json');
	writeFileSync(outputPath, JSON.stringify(result, null, 2));

	console.log(`Results written to: ${outputPath}`);
}

testJWTVerification();