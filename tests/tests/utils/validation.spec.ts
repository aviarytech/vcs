import { ValidateCredential, ValidatePresentation } from '../../../src/lib/utils/validation';
import type { Credential, Presentation } from '../../../src/lib/interfaces';

import cred1 from '../../fixtures/credentials/case-10.json';
import pres1 from '../../fixtures/presentations/case-10.json';

class DummyCredentialClass {
	@ValidateCredential(0)
	static methodBeingValidated(credential: Credential) {
		return 42;
	}
}

class DummyPresentationClass {
	@ValidatePresentation(0)
	static methodBeingValidated(presentation: Presentation) {
		return 42;
	}
}

describe('validation utils', () => {
	it('ValidateCredential should pass through valid credential', () => {
		const result = DummyCredentialClass.methodBeingValidated(cred1);
		expect(result).to.be.equal(42);
	});

	it('ValidateCredential should throw error for invalid credential', () => {
		try {
			let credBad = { ...cred1 };
			delete credBad.type;
			const result = DummyCredentialClass.methodBeingValidated(credBad);
			expect(true).to.be.false;
		} catch (e) {
			expect(e.message).to.be.equal('"type" property is required.');
		}
	});

	it('can validate credential with an ISO string date w/o milliseconds', () => {
		let cred = {
			...cred1,
			issuanceDate: new Date().toISOString().slice(0, -5) + 'Z'
		};
		const result = DummyCredentialClass.methodBeingValidated(cred);
		expect(result).to.be.equal(42);
	});

	it('rejects credential with an ISO string date with milliseconds', () => {
		try {
			let cred = {
				...cred1,
				issuanceDate: new Date().toISOString()
			};
			const result = DummyCredentialClass.methodBeingValidated(cred);
			expect(true).to.be.false;
		} catch (e) {
			expect(e.message).to.be.equal(
				'"issuanceDate" is not an ISO date or may contain milliseconds'
			);
		}
	});

	it('ValidatePresentation should pass through valid presentation', () => {
		const result = DummyPresentationClass.methodBeingValidated(pres1);
		expect(result).to.be.equal(42);
	});

	it('ValidatePresentation should throw error for invalid presentation', () => {
		try {
			let presBad = JSON.parse(JSON.stringify(pres1));
			delete presBad.type;
			const result = DummyPresentationClass.methodBeingValidated(presBad);
			expect(true).to.be.false;
		} catch (e) {
			expect(e.message).to.be.equal('"type" property is required.');
		}
	});

	it('ValidatePresentation should throw error for invalid credential in presentation', () => {
		try {
			let presBad = JSON.parse(JSON.stringify(pres1));
			delete presBad.verifiableCredential[0].type;
			const result = DummyPresentationClass.methodBeingValidated(presBad);
			expect(true).to.be.false;
		} catch (e) {
			expect(e.message).to.be.equal('"type" property is required.');
		}
	});
});
