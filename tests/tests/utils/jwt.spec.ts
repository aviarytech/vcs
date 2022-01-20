import { LDCredentialToJWT } from "../../../src/lib/utils/jwt";
import credential from "../../fixtures/credentials/case-10.json";
describe("jwt utils", () => {
  it("should reformat credential to JWT format", () => {
    const newCred = LDCredentialToJWT(credential);

    expect(newCred.jti).to.be.equal("urn:uvci:af5vshde843jf831j128fj");
    expect(newCred.vc).to.not.have.property("id");
    expect(newCred.sub).to.be.equal("did:example:123");
    expect(newCred.vc.credentialSubject).to.not.have.property("id");
    expect(newCred.iss).to.be.equal(
      "did:key:z6MkiY62766b1LJkExWMsM3QG4WtX7QpY823dxoYzr9qZvJ3"
    );
    expect(newCred.vc).to.not.have.property("issuer");
    expect(newCred.nbf).to.be.equal(1575375592);
    expect(newCred.iat).to.be.equal(1575375592);
    expect(newCred.vc).to.not.have.property("issuanceDate");
    expect(newCred.exp).to.be.equal(1890994792);
    expect(newCred.vc).to.not.have.property("expirationDate");
    expect(newCred).to.have.property("nonce");
    expect(newCred.vc.type).to.eql([
      "VerifiableCredential",
      "VaccinationCertificate",
    ]);
    expect(newCred.vc["@context"]).to.eql([
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/vaccination/v1",
    ]);
  });
});
