import { JWT, KEYS } from './fixtures';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateInputs } from 'noir-jwt';
import * as jose from 'jose';

type JWTCircuitInputs = {
	data?: {
		storage: number[];
		len: number;
	};
	base64_decode_offset: number;
	pubkey_modulus_limbs: string[];
	redc_params_limbs: string[];
	signature_limbs: string[];
	partial_data?: {
		storage: number[];
		len: number;
	};
	partial_hash?: number[];
	full_data_length?: number;
}

const pubkey = KEYS[0];
const jwt = JWT;

function generateNoirCode(inputs: JWTCircuitInputs): string {
	return `
      let pubkey_modulus_limbs = [${inputs.pubkey_modulus_limbs.join(", ")}];
      let redc_params_limbs = [${inputs.redc_params_limbs.join(", ")}];
      let signature_limbs = [${inputs.signature_limbs.join(", ")}];
      let data: BoundedVec<u8, ${inputs.data!.storage.length}> = BoundedVec::from_array([${inputs.data!.storage.filter(s => s !== 0).join(", ")}]);
      let base64_decode_offset = ${inputs.base64_decode_offset};

      let jwt = JWT::init(
        data,
        base64_decode_offset,
        pubkey_modulus_limbs,
        redc_params_limbs,
        signature_limbs,
      );

      jwt.verify();
    `
}

function generateNoirTestDataPartialHash(inputs: JWTCircuitInputs) {

	return `
      let pubkey_modulus_limbs = [${inputs.pubkey_modulus_limbs.join(", ")}];
      let redc_params_limbs = [${inputs.redc_params_limbs.join(", ")}];
      let signature_limbs = [${inputs.signature_limbs.join(", ")}];
      let partial_data: BoundedVec<u8, 256> = BoundedVec::from_array([${inputs.partial_data!.storage.filter(s => s !== 0).join(", ")}]);
      let base64_decode_offset = ${inputs.base64_decode_offset};
      let partial_hash = [${inputs.partial_hash!.join(", ")}];
      let full_data_length = ${inputs.full_data_length};

      let jwt = JWT::init_with_partial_hash(
        partial_data,
        partial_hash,
        full_data_length,
        base64_decode_offset,
        pubkey_modulus_limbs,
        redc_params_limbs,
        signature_limbs,
      );

      jwt.verify();
    `
}

async function testJWTVerification() {
	console.log('Testing JWT verification...\n');
	const key = await jose.importJWK(pubkey);
	const jwtVerif = await jose.jwtVerify(jwt, key);

	console.log(JSON.stringify(jwtVerif, null, 2));

	const result = await generateInputs({ jwt, pubkey, maxSignedDataLength: 900 });

	const outputPath = join(process.cwd(), 'scripts', 'result.nr');
	writeFileSync(outputPath, generateNoirCode(result));

	console.log(`Results written to: ${outputPath}`);
}

testJWTVerification();