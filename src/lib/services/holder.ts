import type { Credential, VerifiableCredential } from '../interfaces.js';
import { ValidateCredential } from '../utils/validation.js';
import type { DocumentLoader, LinkedDataSuite } from '@aviarytech/crypto';

export class HolderService {
	@ValidateCredential(0)
	static async deriveCredential(
		credential: Credential | VerifiableCredential,
		options: {
			type: 'vc-jwt' | 'vc-ld';
			suite: any;
			documentLoader: DocumentLoader;
		},
		proofOptions?: any
	): Promise<VerifiableCredential> {
		const { type, suite, documentLoader } = options;

		if (!documentLoader) {
			throw new TypeError('"documentLoader" parameter is required.');
		}

		if (!suite) {
			throw new TypeError('"suite" parameter is required.');
		}

		if (type === 'vc-jwt') {
			/* sign jwt vc */
			// TODO JWT
			// return suite.sign(LDCredentialToJWT(credential), { documentLoader });
		} else if (type === 'vc-ld') {
			let newProof;
			if (typeof credential['proof'] === 'undefined') {
				newProof = await suite.createProof(
					credential,
					'assertionMethod',
					documentLoader,
					proofOptions
				);
			} else {
				let oldProof = (credential as VerifiableCredential).proof;
				if (!Array.isArray(oldProof)) {
					oldProof = [oldProof];
				}
				newProof = [
					await suite.createProof(credential, 'assertionMethod', documentLoader, proofOptions),
					...oldProof
				];
			}
			return { ...credential, proof: newProof };
		}
		throw new TypeError('"type" parameter is required and must be "vc-jwt" or "vc-ld".');
	}
}
