use jwt::JWT;

global MAX_DATA_LENGTH: u32 = 900; // max length of signed data (headerb64 + "." + payloadb64)
global MAX_NONCE_LENGTH: u32 = 32; // we are verifying `nonce` claim

fn main(
    data: BoundedVec<u8, MAX_DATA_LENGTH>,
    base64_decode_offset: u32,
    pubkey_modulus_limbs: pub [Field; 18],
    redc_params_limbs: [Field; 18],
    signature_limbs: [Field; 18],
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
    jwt.assert_claim_string("iss".as_bytes(), BoundedVec::<u8, 4>::from_array("test".as_bytes()));
}

#[test]
fn test_main() {
    main(1, 2);

    // Uncomment to make test fail
    // main(1, 1);
}
