// Copyright 2018 Keybase, Inc. All rights reserved. Use of
// this source code is governed by the included BSD license.

package libkb

// Code for encoding and decoding Keybase packet types.

import (
	"encoding/base64"

	"github.com/keybase/client/go/kbcrypto"
)

func DecodeSKBPacket(data []byte) (*SKB, error) {
	var info SKB
	err := kbcrypto.DecodePacketFromBytes(data, &info)
	if err != nil {
		return nil, err
	}
	return &info, nil
}

func DecodeArmoredSKBPacket(s string) (*SKB, error) {
	b, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		return nil, err
	}
	return DecodeSKBPacket(b)
}

func DecodeNaclSigInfoPacket(data []byte) (NaclSigInfo, error) {
	var info NaclSigInfo
	err := kbcrypto.DecodePacketFromBytes(data, &info)
	if err != nil {
		return NaclSigInfo{}, err
	}
	return info, nil
}

func DecodeArmoredNaclSigInfoPacket(s string) (NaclSigInfo, error) {
	b, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		return NaclSigInfo{}, err
	}
	return DecodeNaclSigInfoPacket(b)
}

func DecodeNaclEncryptionInfoPacket(data []byte) (NaclEncryptionInfo, error) {
	var info NaclEncryptionInfo
	err := kbcrypto.DecodePacketFromBytes(data, &info)
	if err != nil {
		return NaclEncryptionInfo{}, err
	}
	return info, nil
}

func DecodeArmoredNaclEncryptionInfoPacket(s string) (NaclEncryptionInfo, error) {
	b, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		return NaclEncryptionInfo{}, err
	}
	return DecodeNaclEncryptionInfoPacket(b)
}
