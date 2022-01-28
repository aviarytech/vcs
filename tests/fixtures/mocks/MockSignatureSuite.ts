import type { DocumentLoader, LinkedDataSuite, ProofVerificationResult } from '@aviarytech/crypto';
import type { Credential, JWTCredential } from '../../../src/lib/interfaces';

export class MockSignatureSuite implements LinkedDataSuite {
	type = 'mock';
	date = new Date().toISOString();
	context = 'mock';

	async getVerificationMethod() {
		return null;
	}

	async createProof(
		credential: Credential | JWTCredential,
		purpose: string,
		documentLoader: DocumentLoader
	): Promise<any> {
		return {};
	}

	async verifyProof(
		proofDocument: any,
		document: any,
		documentLoader: DocumentLoader
	): Promise<ProofVerificationResult> {
		return { verified: true };
	}
}
