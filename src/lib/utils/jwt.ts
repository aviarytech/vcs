import type { JWTCredential, Credential } from '../interfaces.js';

export const LDCredentialToJWT = (credential: Credential): JWTCredential => {
	let newCred = {} as JWTCredential;

	/* copy credential subject id */
	if (credential.credentialSubject.id) {
		newCred.sub = credential.credentialSubject.id;
		delete credential.credentialSubject.id;
	}

	/* copy credential id */
	if (credential.id) {
		newCred.jti = credential.id;
		delete credential.id;
	}

	/* copy issuer */
	if (typeof credential.issuer === 'string') {
		newCred.iss = credential.issuer;
		delete credential.issuer;
	} else {
		newCred.iss = credential.issuer.id;
		delete credential.issuer;
	}

	/* copy issuance date */
	const issuanceDate = Math.floor(+new Date(credential.issuanceDate) / 1000);
	newCred.nbf = issuanceDate;
	newCred.iat = issuanceDate;
	delete credential.issuanceDate;

	/* copy expiration date */
	if (credential.expirationDate) {
		newCred.exp = Math.floor(+new Date(credential.expirationDate) / 1000);
		delete credential.expirationDate;
	}

	/* nonce */
	newCred.nonce = crypto.getRandomValues(new Uint8Array(12)).toString();
	/* copy the remaining claims into vc */
	newCred.vc = credential;

	return newCred;
};
