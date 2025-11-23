import { NextRequest, NextResponse } from 'next/server';

/**
 * MOCK API ENDPOINT - FOR DEVELOPMENT ONLY
 * 
 * This is a mock implementation that simulates the claim process.
 * Replace this with real implementation that:
 * 1. Generates ZK proof using Mist SDK
 * 2. Submits transaction using backend Starknet account
 * 3. Returns actual transaction hash from blockchain
 */

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { proof } = body;

		console.log('Recieved proof:', proof);

		return NextResponse.json({
			message: 'Proof received',
		});
	} catch (error) {
		console.error('Claim API error:', error);
		return NextResponse.json(
			{
				error: 'Failed to process claim',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}
