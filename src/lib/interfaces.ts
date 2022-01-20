export interface VerificationResult {
	verified: boolean;
	/**
	 * The checks performed
	 */
	checks?: Array<string>;
	/**
	 * Warnings
	 */
	warnings?: Array<string>;
	/**
	 * Errors
	 */
	errors?: Array<string>;
}

export interface ProofVerification {
	verified: boolean;
	error: string;
}

/**
 * A JSON-LD Linked Data proof.
 */
export interface LinkedDataProof {
	/**
	 * Linked Data Signature Suite used to produce proof.
	 */
	type?: string;
	/**
	 * Date the proof was created.
	 */
	created?: string;
	/**
	 * Verification Method used to verify proof.
	 */
	verificationMethod?: string;
	/**
	 * The purpose of the proof to be used with verificationMethod.
	 */
	proofPurpose?: string;
	/**
	 * Detached JSON Web Signature
	 */
	jws?: string;
	/**
	 * challenge to prevent replay attacks
	 */
	challenge?: string;
	/**
	 * domain
	 */
	domain?: string;
	/**
	 * value
	 */
	proofValue?: string;
	/**
	 * nonce
	 */
	nonce?: number;
}

export interface JWTCredential {
	/**
	 * The credential subject ID
	 */
	sub?: string;
	/**
	 * The ID of the credential
	 */
	jti?: string;
	/**
	 * The issuer of the credential
	 */
	iss: string;
	/**
	 * The issuance date of the credential (unix timestamp)
	 */
	nbf: number;
	/**
	 * The issuance date of the credential (unix timestamp)
	 */
	iat: number;
	/**
	 * The expiry date of the credential (unix timestamp)
	 */
	exp?: number;
	/**
	 * The nonce included in the signed data payload
	 */
	nonce: string;
	/**
	 * The remaining credential properties
	 */
	vc: {
		'@context': Array<string> | string;
		type: Array<string> | string;
		credentialSubject: any;
		[k: string]: any;
	};
}

/**
 * A JSON-LD Credential.
 */
export interface Credential {
	/**
	 * The JSON-LD context of the credential.
	 */
	'@context': Array<string> | string;
	/**
	 * The ID of the credential.
	 */
	id?: string;
	/**
	 * The JSON-LD type of the credential.
	 */
	type: Array<string> | string;
	issuer: { id: string } | string;
	/**
	 * The issuanceDate
	 */
	issuanceDate: string;
	/**
	 * The expirationDate
	 */
	expirationDate?: string;
	/**
	 * The credential subject
	 */
	credentialSubject: {
		/**
		 * credential subject ID
		 */
		id?: string;
		[k: string]: any;
	};
	/**
	 * The status of the credential
	 */
	credentialStatus?: {
		id: string;
		type: string;
	};
}

/**
 * A JSON-LD Presentation.
 */
export interface Presentation {
	/**
	 * The JSON-LD context of the presentation.
	 */
	'@context': Array<string> | string;
	/**
	 * The ID of the presentation.
	 */
	id?: string;
	/**
	 * The JSON-LD type of the presentation.
	 */
	type: Array<string> | string;
	/**
	 * The Verifiable Credentials included in the presentation
	 */
	verifiableCredential: Array<VerifiableCredential> | VerifiableCredential;
}

export interface VerifiablePresentation extends Presentation {
	proof: LinkedDataProof | Array<LinkedDataProof>;
}

export interface VerifiableCredential extends Credential {
	proof: LinkedDataProof | Array<LinkedDataProof>;
}

export interface LinkedDataKey {
	id: string;
	type: string;
}

// export interface SignatureSuite {
//   key?: JsonWebKey | LinkedDataKey;

//   getVerificationMethod: (options: {
//     proof: LinkedDataProof;
//     documentLoader: DocumentLoader;
//   }) => Promise<JsonWebKey | LinkedDataKey>;

//   deriveProof?: (
//     verifiableCredential: VerifiableCredential,
//     frame: object
//   ) => Promise<VerifiableCredential>;

//   createProof: (
//     credential: Credential | JWTCredential,
//     proofPurpose: string,
//     options: { documentLoader: DocumentLoader }
//   ) => Promise<LinkedDataProof>;

//   verifyProof: (
//     proof: LinkedDataProof,
//     verifiableCredential: VerifiableCredential,
//     options: { documentLoader: DocumentLoader }
//   ) => Promise<ProofVerification>;
// }
