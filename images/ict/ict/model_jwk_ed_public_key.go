/*
 * OIDC ID Certifcation Token Userinfo Endpoint
 *
 * Endpoint for OpenID Connect's ID Certifcation Token endpoint for userinfo.
 *
 * API version: 0.4.0
 * Generated by: Swagger Codegen (https://github.com/swagger-api/swagger-codegen.git)
 */
package ict

import (
	"errors"
)

type JwkEdPublicKey struct {
	KeyType   KeyType `json:"kty"`
	CurveName EdCurve `json:"crv"`
	X         string  `json:"x"`
}

func EdJwkFromJson(json map[string]interface{}) (JwkEdPublicKey, error) {
	// Parse key type
	keyType, err := KeyTypeFromJson(json, "kty")
	if err != nil {
		return JwkEdPublicKey{}, errors.New("failed to parse key type: " + err.Error())
	}
	if keyType != EC {
		return JwkEdPublicKey{}, errors.New("failed to parse key type: expected attribute 'kty' to be 'EC' but found '" + string(keyType) + "'")
	}

	// Read curve name
	curveName, err := EdCurveFromJson(json, "crv")
	if err != nil {
		return JwkEdPublicKey{}, errors.New("failed to parse curve name: " + err.Error())
	}
	if curveName != "Ed25519" {
		return JwkEdPublicKey{}, errors.New("failed to parse curve name: expected curve name 'Ed25519'")
	}

	// Parse x coordinate
	x, err := StringFromJson(json, "x")
	if err != nil {
		return JwkEdPublicKey{}, errors.New("failed to parse x coordinate: " + err.Error())
	}

	// Return as struct
	return JwkEdPublicKey{
		KeyType:   keyType,
		CurveName: curveName,
		X:         x,
	}, nil
}
