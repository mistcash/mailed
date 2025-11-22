use jwt::JWT;

global MAX_DATA_LENGTH: u32 = 900; // max length of signed data (headerb64 + "." + payloadb64)
global MAX_NONCE_LENGTH: u32 = 32; // we are verifying `nonce` claim

fn main(
    email: BoundedVec<u8, 35>,
    data: BoundedVec<u8, MAX_DATA_LENGTH>,
    base64_decode_offset: u32,
    pubkey_modulus_limbs: pub [u128; 18],
    redc_params_limbs: [u128; 18],
    signature_limbs: [u128; 18],
    expected_nonce: pub BoundedVec<u8, MAX_NONCE_LENGTH>,
) {
    let jwt = JWT::init(
        data,
        base64_decode_offset,
        pubkey_modulus_limbs,
        redc_params_limbs,
        signature_limbs,
    );

    jwt.verify();

    // Verify `iss` claim value is "test"
    jwt.assert_claim_string("email".as_bytes(), email);
}

// #[test]
// fn test_main() {
//     main(1, 2);

//     // Uncomment to make test fail
//     // main(1, 1);
// }
