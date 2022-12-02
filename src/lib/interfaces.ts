import type { DocumentLoader } from '@aviarytech/crypto';

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

export enum IProofPurpose {
  verificationMethod = 'verificationMethod',
  assertionMethod = 'assertionMethod',
  authentication = 'authentication',
  keyAgreement = 'keyAgreement',
  contractAgreement = 'contactAgreement',
  capabilityInvocation = 'capabilityInvocation',
  capabilityDelegation = 'capabilityDelegation',
}

export enum IProofType {
  Ed25519Signature2018 = 'Ed25519Signature2018',
  Ed25519Signature2020 = 'Ed25519Signature2020',
  EcdsaSecp256k1Signature2019 = 'EcdsaSecp256k1Signature2019',
  EcdsaSecp256k1RecoverySignature2020 = 'EcdsaSecp256k1RecoverySignature2020',
  JsonWebSignature2020 = 'JsonWebSignature2020',
  RsaSignature2018 = 'RsaSignature2018',
  GpgSignature2020 = 'GpgSignature2020',
  JcsEd25519Signature2020 = 'JcsEd25519Signature2020',
  BbsBlsSignatureProof2020 = 'BbsBlsSignatureProof2020',
  BbsBlsBoundSignatureProof2020 = 'BbsBlsBoundSignatureProof2020',
}

/**
 * A JSON-LD Linked Data proof.
 */
 export interface LinkedDataProof {
  type: IProofType | string // The proof type
  created: string // The ISO8601 date-time string for creation
  proofPurpose: IProofPurpose | string // The specific intent for the proof
  verificationMethod: string // A set of parameters required to independently verify the proof
  challenge?: string // A challenge to protect against replay attacks
  domain?: string // A string restricting the (usage of a) proof to the domain and protects against replay attacks
  proofValue?: string // One of any number of valid representations of proof values
  jws?: string // JWS based proof
  nonce?: string // Similar to challenge. A nonce to protect against replay attacks, used in some ZKP proofs
  requiredRevealStatements?: string[] // The parts of the proof that must be revealed in a derived proof

  [x: string]: string | string[] | undefined
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
		type: string[];
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
	type: string[];
	issuer: { id: string, name?: string, image?: string, url?: string, type?: string } | string;
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

  [x: string]: unknown
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
	type: string[];
	/**
	 * The Verifiable Credentials included in the presentation
	 */
	verifiableCredential: Array<VerifiableCredential> | VerifiableCredential;

  [x: string]: unknown
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

export interface ProofVerificationResult {
	verified: boolean;
	error?: string;
}

export interface LinkedDataSuite {
	type: string;
	date: string;
	context: string;

	createProof: (
		document: any,
		purpose: string,
		documentLoader: DocumentLoader,
		options: {
			domain?: string;
			challenge?: string;
			[key: string]: any;
		}
	) => Promise<LinkedDataProof>;

	verifyProof: (
		proofDocument: LinkedDataProof,
		document: any,
		documentLoader: DocumentLoader
	) => Promise<ProofVerificationResult>;
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
