import { VerifierService } from '../../../../src/lib/services/verifier';
import { documentLoader } from '../../../fixtures/documentLoader';

import verifiableCredential from '../../../fixtures/verifiableCredentials/case-10.json';
import verifiablePresentation from '../../../fixtures/verifiablePresentations/case-10.json';
import key from '../../../fixtures/key.json';
import { JsonWebKey, JsonWebSignature2020Suite } from '@aviarytech/crypto';

describe('verifier service', () => {
	it('fails verification for an invalid JsonWebKeySignature2020 VC', async () => {
		const jwk = await JsonWebKey.fromJWK(key);
		const suite = new JsonWebSignature2020Suite({ key: jwk, date: new Date().toISOString() });
		const vcCopy = JSON.parse(JSON.stringify(verifiableCredential));
		vcCopy.proof.jws = 'ey..123';
		const result = await VerifierService.verifyCredential(vcCopy, suite, documentLoader);

		expect(result.verified).to.be.false;
	});
	it('verifies a JsonWebKeySignature2020 VC', async () => {
		const jwk = await JsonWebKey.fromJWK(key);
		const suite = new JsonWebSignature2020Suite({ key: jwk, date: new Date().toISOString() });
		const result = await VerifierService.verifyCredential(
			verifiableCredential,
			suite,
			documentLoader
		);

		expect(result.verified).to.be.true;
	});

	it('fails verification for an invalid JsonWebKeySignature2020 VP', async () => {
		const jwk = await JsonWebKey.fromJWK(key);
		const suite = new JsonWebSignature2020Suite({ key: jwk, date: new Date().toISOString() });
		const vpCopy = JSON.parse(JSON.stringify(verifiablePresentation));
		vpCopy.proof.jws = 'ey..123';

		const result = await VerifierService.verifyPresentation(vpCopy, suite, documentLoader);

		expect(result.verified).to.be.false;
	});

	it('verifies a JsonWebKeySignature2020 VP', async () => {
		const jwk = await JsonWebKey.fromJWK(key);
		const suite = new JsonWebSignature2020Suite({ key: jwk, date: new Date().toISOString() });
		const result = await VerifierService.verifyPresentation(
			verifiablePresentation,
			suite,
			documentLoader
		);

		expect(result.verified).to.be.true;
	});
});
