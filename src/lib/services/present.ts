import type {
	Credential,
	LinkedDataSuite,
	Presentation,
	VerifiableCredential,
	VerifiablePresentation
} from '../interfaces.js';
import { ValidateCredential, ValidatePresentation } from '../utils/validation.js';
import type { DocumentLoader, LinkedDataProof } from '@aviarytech/crypto';

export class PresentationService {
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

	@ValidatePresentation(0)
	static async provePresentation(
		presentation: Presentation,
		options: {
			domain?: string;
			challenge: string;
			type: 'vc-jwt' | 'vc-ld';
			suite: LinkedDataSuite;
			documentLoader: DocumentLoader;
		}
	): Promise<VerifiablePresentation> {
		const { type, suite, documentLoader, ...opts } = options;

		if (type === 'vc-jwt') {
			/* sign jwt vc */
			// TODO JWT
			// return suite.sign(LDCredentialToJWT(credential), { documentLoader });
		} else if (type === 'vc-ld') {
			/* sign linked data vp */
			const proof = await suite.createProof(presentation, 'authentication', documentLoader, opts);
			return { ...presentation, proof };
		}
		throw new TypeError('"type" parameter is required and must be "vc-jwt" or "vc-ld".');
	}
}
