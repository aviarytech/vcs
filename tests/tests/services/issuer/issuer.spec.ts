import { MockSignatureSuite } from '../../../fixtures/mocks/MockSignatureSuite';
import { IssuerService } from '../../../../src/lib/services/issuer';
import { documentLoader } from '../../../fixtures/documentLoader';
import { JsonWebKey, JsonWebSignature2020Suite } from '@aviarytech/crypto';

import credential from '../../../fixtures/credentials/case-10.json';
import presentation from '../../../fixtures/presentations/case-10.json';
import key from '../../../fixtures/key.json';

describe('issuer service', () => {
	it("calls 'sign' on a suite when issuing a valid credential", async () => {
		const mockSig = new MockSignatureSuite();
		cy.spy(mockSig, 'createProof');

		const vc = await IssuerService.issueCredential(credential, {
			type: 'vc-ld',
			suite: mockSig,
			documentLoader
		});

		expect(mockSig.createProof).to.be.called;
	});

	it("doesn't call 'sign' on a suite when issuing a bad credential", async () => {
		const mockSig = new MockSignatureSuite();
		cy.spy(mockSig, 'createProof');
		let badCred = { ...credential };
		delete badCred['@context'];

		try {
			const vc = await IssuerService.issueCredential(badCred, {
				type: 'vc-ld',
				suite: mockSig,
				documentLoader
			});
		} catch (e) {
			expect(mockSig.createProof).to.not.be.called;
		}
	});

	it('issues a JsonWebSignature2020 VC', async () => {
		const jwk = await JsonWebKey.fromJWK(key);
		const suite = new JsonWebSignature2020Suite({ key: jwk, date: new Date().toISOString() });

		const vc = await IssuerService.issueCredential(credential, {
			type: 'vc-ld',
			suite,
			documentLoader
		});

		// compare proof separately
		let { proof, ...cred } = vc;
		if (!Array.isArray(proof)) {
			proof = [proof];
		}
		expect(cred).to.deep.equal(credential);
		expect(proof[0]).to.have.property('jws');
		expect(proof[0].jws).to.contain('..');
		expect(proof[0].proofPurpose).to.be.equal('assertionMethod');
		expect(proof[0].type).to.be.equal('JsonWebSignature2020');
		expect(proof[0].verificationMethod).to.be.equal(jwk.id);
	});

	it('issues a JsonWebSignature2020 VP', async () => {
		const jwk = await JsonWebKey.fromJWK(key);
		const suite = new JsonWebSignature2020Suite({ key: jwk, date: new Date().toISOString() });

		const vp = await IssuerService.issuePresentation(presentation, {
			challenge: '1235',
			domain: '1',
			type: 'vc-ld',
			suite,
			documentLoader
		});

		// compare proof separately
		let { proof, ...pres } = vp;
		if (!Array.isArray(proof)) {
			proof = [proof];
		}

		expect(pres).to.deep.equal(presentation);
		expect(proof[0]).to.have.property('jws');
		expect(proof[0].domain).to.equal('1');
		expect(proof[0].challenge).to.equal('1235');
		expect(proof[0].jws).to.contain('..');
		expect(proof[0].proofPurpose).to.be.equal('authentication');
		expect(proof[0].type).to.be.equal('JsonWebSignature2020');
		expect(proof[0].verificationMethod).to.be.equal(jwk.id);
	});
});
