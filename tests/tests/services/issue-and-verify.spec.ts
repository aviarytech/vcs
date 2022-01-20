import { JsonWebKey, JsonWebSignature2020Suite } from '@aviarytech/crypto';
import { IssuerService } from '../../../src/lib/services/issuer';
import { MockSignatureSuite } from '../../fixtures/mocks/MockSignatureSuite';
import { documentLoader } from '../../fixtures/documentLoader';

import credential from '../../fixtures/credentials/case-10.json';
import key from '../../fixtures/key.json';
import { VerifierService } from '../../../src/lib/services/verifier';

let vc;
describe('issue and verify', () => {
	it('issues a JsonWebSignature2020 VC', async () => {
		const jwk = await JsonWebKey.fromJWK(key);
		const suite = new JsonWebSignature2020Suite({ key: jwk, date: new Date().toISOString() });

		vc = await IssuerService.issueCredential(credential, {
			type: 'vc-ld',
			suite,
			documentLoader
		});
		// compare proof separately
		const { proof, ...cred } = vc;

		expect(cred).to.deep.equal(credential);
		expect(proof).to.have.property('jws');
		expect(proof.jws).to.contain('..');
		expect(proof.proofPurpose).to.be.equal('assertionMethod');
		expect(proof.type).to.be.equal('JsonWebSignature2020');
		expect(proof.verificationMethod).to.be.equal(jwk.id);
	});

	it('verifies a JsonWebKeySignature2020 VC', async () => {
		const jwk = await JsonWebKey.fromJWK(key);
		const suite = new JsonWebSignature2020Suite({ key: jwk, date: new Date().toISOString() });
		const result = await VerifierService.verifyCredential(vc, suite, documentLoader);

		expect(result.verified).to.be.true;
	});
});
