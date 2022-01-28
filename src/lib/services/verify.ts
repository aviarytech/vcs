import type {
	VerifiableCredential,
	VerifiablePresentation,
	VerificationResult
} from '../interfaces.js';
import type { DocumentLoader, LinkedDataSuite } from '@aviarytech/crypto';

/* Verifier Service */
export class VerificationService {
	static async verifyCredential(
		verifiableCredential: VerifiableCredential,
		suite: any,
		documentLoader: DocumentLoader
	): Promise<VerificationResult> {
		let errors = [];
		let checks = [];
		let { proof, ...credential } = verifiableCredential;

		if (!Array.isArray(proof)) {
			proof = [proof];
		}
		for (let i = 0; i < proof.length; i++) {
			if (proof[i].type === suite.type) {
				const result = await suite.verifyProof(proof[i], credential, documentLoader);
				if (!result.verified) {
					errors.push(result.error);
				} else {
					checks.push(proof[i].proofPurpose);
				}
			}
		}
		if (checks.length === 0 && errors.length === 0) {
			throw new Error(`No proof types matched given suite: ${suite.type}`);
		}

		if (errors.length === 0) {
			return {
				verified: true,
				checks,
				warnings: null,
				errors: null
			};
		} else {
			return {
				verified: false,
				checks,
				warnings: null,
				errors
			};
		}
	}

	static async verifyPresentation(
		verifiablePresentation: VerifiablePresentation,
		suite: any,
		documentLoader: DocumentLoader
	): Promise<VerificationResult> {
		let errors = [];
		let checks = [];
		let { proof, ...presentation } = verifiablePresentation;

		if (!Array.isArray(proof)) {
			proof = [proof];
		}
		for (let i = 0; i < proof.length; i++) {
			console.log(proof[i].type);
			console.log(suite.type);
			if (proof[i].type === suite.type) {
				const result = await suite.verifyProof(proof[i], presentation, documentLoader);
				if (!result.verified) {
					errors.push(result.error);
				} else {
					checks.push(proof[i].proofPurpose);
				}
			}
		}

		if (checks.length === 0 && errors.length === 0) {
			throw new Error(`No proof types matched given suite: ${suite.type}`);
		}

		if (errors.length === 0) {
			return {
				verified: true,
				checks,
				warnings: null,
				errors: null
			};
		} else {
			return {
				verified: false,
				checks,
				warnings: null,
				errors
			};
		}
	}
}
