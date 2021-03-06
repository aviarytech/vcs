import type { DocumentLoader } from '@aviarytech/crypto';
import { NotImplementedError } from '../errors/NotImplementedError.js';
import type { Credential, VerifiableCredential } from '../interfaces.js';
import { ValidateCredential } from '../utils/validation.js';

export class IssuanceService {
	@ValidateCredential(0)
	static async issueCredential(
		credential: Credential,
		options: {
			type: 'vc-jwt' | 'vc-ld';
			suite: any;
			documentLoader: DocumentLoader;
		}
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
			/* sign linked data vc */
			const proof = await suite.createProof(credential, 'assertionMethod', documentLoader);
			return { ...credential, proof: proof };
		}
		throw new TypeError('"type" parameter is required and must be "vc-jwt" or "vc-ld".');
	}

	updateCredentialStatus() {
		throw new NotImplementedError('updateCredentialStatus not implemented yet');
	}
}
