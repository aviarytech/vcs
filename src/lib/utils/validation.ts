import type { Credential, Presentation } from '../interfaces.js';
import { ValidationError } from '../errors/ValidationError.js';

export const checkCredential = (credential: Credential) => {
	if (!credential['@context']) {
		throw new ValidationError('Verifiable Credentials MUST include a @context property.');
	}

	// TODO check jsonld is valid

	if (!credential.type) {
		throw new ValidationError('"type" property is required.');
	} else {
		let type = typeof credential.type === 'string' ? [credential.type] : credential.type;
		if (!type.includes('VerifiableCredential')) {
			throw new ValidationError('"type" property must contain "VerifiableCredential".');
		}
	}

	let issuanceDate = new Date(credential.issuanceDate).toISOString();
	if (issuanceDate.slice(0, -5) + 'Z' !== credential.issuanceDate) {
		throw new ValidationError('"issuanceDate" is not an ISO date or may contain milliseconds');
	}

	if (credential.expirationDate) {
		let expirationDate = new Date(credential.expirationDate).toISOString();
		if (expirationDate.slice(0, -5) + 'Z' !== credential.expirationDate) {
			throw new ValidationError('"expirationDate" is not an ISO date or may contain milliseconds');
		}
	}

	let issuer = typeof credential.issuer === 'string' ? credential.issuer : credential.issuer.id;
	if (!issuer) {
		throw new ValidationError('"issuer" is required');
	}

	if (credential.credentialStatus) {
		if (!credential.credentialStatus.id) {
			throw new Error('"credentialStatus" must include an id.');
		}
		if (!credential.credentialStatus.type) {
			throw new Error('"credentialStatus" must include a type.');
		}
	}
};

// index is the parameter index in the function that is being decorated
// TODO is there a better way to do this? possibly adding another decorator
// to the parameter and saving it for use here
export const ValidateCredential =
	(index: number) =>
	(target: Object, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
		let originalFunction: Function = propertyDescriptor.value;
		propertyDescriptor.value = function () {
			let credential: Credential = arguments[index];
			try {
				checkCredential(credential);
			} catch (e) {
				console.error(e);
				throw e;
			}

			return originalFunction.apply(this, arguments);
		};
		return propertyDescriptor;
	};

export const checkPresentation = (presentation: Presentation) => {
	if (!presentation['@context']) {
		throw new ValidationError('Verifiable Presentations MUST include a @context property.');
	}

	// TODO check jsonld is valid

	if (!presentation.type) {
		throw new ValidationError('"type" property is required.');
	} else {
		let type = typeof presentation.type === 'string' ? [presentation.type] : presentation.type;
		if (!type.includes('VerifiablePresentation')) {
			throw new ValidationError('"type" property must contain "VerifiablePresentation".');
		}
	}
};

export const ValidatePresentation =
	(index: number) =>
	(target: Object, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
		let originalFunction: Function = propertyDescriptor.value;
		propertyDescriptor.value = function () {
			let presentation: Presentation = arguments[index];

			try {
				checkPresentation(presentation);
			} catch (e) {
				console.error(e);
				throw e;
			}

			const vcs = Array.isArray(presentation.verifiableCredential)
				? presentation.verifiableCredential
				: [presentation.verifiableCredential];
			vcs.forEach((vc) => {
				try {
					console.log(vc);
					checkCredential(vc);
				} catch (e) {
					console.error(e);
					throw e;
				}
			});

			return originalFunction.apply(this, arguments);
		};
		return propertyDescriptor;
	};
