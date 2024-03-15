// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.8.0;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point memory) {
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) pure internal returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }


    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[1];
            input[i * 6 + 3] = p2[i].X[0];
            input[i * 6 + 4] = p2[i].Y[1];
            input[i * 6 + 5] = p2[i].Y[0];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}

contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(uint256(0x17e51aa184ac21ef037510fcd5695d0359f2b07e447957821041e558704baa84), uint256(0x217c5192e53a2a2a8be505ba8a4700cdc2f89b47e207cdfe39779cfdc23bbd2b));
        vk.beta = Pairing.G2Point([uint256(0x0b87e9ea462d03432cee9559bb1ba81a0dbf4c53d9381af0be53e857beffaf53), uint256(0x11a3cf73670dc78a3238fecb3dfef31d52fc71a4a49b0e2dac62beb80562adb5)], [uint256(0x13f9a7e66b822b4cdf51fcb1e035089325ac4db192eca941922c66ff920c75a9), uint256(0x1ba2e6b50021943ae20cc42e6cd1e8fe331a76e6b7e6c2bc176604785ad38930)]);
        vk.gamma = Pairing.G2Point([uint256(0x0680895180c3974496195ec326bf3b28e198b264e6fd33dbe0bf2e70514fcaf9), uint256(0x17cff88b76c5d07ba6db5ed0db20398e5a6eaac654a5ba3ecf20abeed373d063)], [uint256(0x2a6bda72a12a6b616a55fe141047335b1c331c2795710f0fe72d28b304fd53be), uint256(0x1a16d7a3bfe21ca7c2a4cd27357d26e01652100c3e93a4e9448274c24a2030ff)]);
        vk.delta = Pairing.G2Point([uint256(0x0b2e425aaea3240c2960026ae75f01a1f926a89c69eb5bf747fc7ea012890710), uint256(0x0c55b14d16a92a2d28a8635f280d64736d8e70f55a2e31ce647f5d5d12ea7f1d)], [uint256(0x2759dd3c8bc9717a326081aab1369890748f72246f089ebe6b7422a1708b1469), uint256(0x2bae537858b7c5581f64ede63bcb6e4e605a0370254d218f700de03c50d66e8a)]);
        vk.gamma_abc = new Pairing.G1Point[](9);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x1b753efe19cdb20978e9da5ae02f4b2103b23a96f79384a7a53949f391f6941e), uint256(0x12a8df8f28cc048c62dc9f7c290976c599a3e8db2eafdb3c46d47904567428f4));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x0b1f2957b95f81997a31ef2e89df75102e2b26508250205a2a83ba9d70622067), uint256(0x1054f57bbe32efa2b4939b4242a240d7d5a6ee73433e564c4a5470f189be333a));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x1021d99cc88f6fcc557f3a46baf6af63c1c293608948eb255ed2f49dc6e8ef03), uint256(0x0e6a11ba21b7cbb937f68e2155bf48a2842bfc543b5534eaece5b61e52ccf0b8));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x050299533a2c0a5db545656318f2dbaae112b2664340added4034bdd3436f4af), uint256(0x11a8edb84baf9ffdcd3ec77875531f2afd963e46d5672f329ab834c5ddea60b1));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x27cb71d0fd9568b7089b22343e4351103c9e1812fc25dc7fa977f06cc2056e18), uint256(0x0eff09faac312cbb5a24c6c6e503f800bf154c9c130aa455e2ffd4df74170e61));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x2461f6e17133424ab09c93ba3814b7dec1cd164c59dc37a43a588753155a69df), uint256(0x06eeb5caa72c8120ca4bddab73b8ec9a9da2effd70d86201dbfd4fa971eeb371));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x01fa78430bca6c7ee2ee808b1a0f01ff3ff518b2d216f9621c59516ee24c135f), uint256(0x20105f7422233360a9bb16d8e0a7db34a311c0382ea9ab118a5027fc4d95e334));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x1992c1ab723cc333bcc2a268ec04f04c2670d848c191adc00e20736d5c92c4cd), uint256(0x1913c86629caa3c0a2a5310e247cd72d5ce62f9582f03076baba569edda9a7f5));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x2a69a14650095b166e68fab817c87cf7f40de97c94dd067c073a553e012b322f), uint256(0x1995b0c4879341d950517e67f790148d5588aa7ea5acb43b4fbcec59d459cb31));
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if(!Pairing.pairingProd4(
             proof.a, proof.b,
             Pairing.negate(vk_x), vk.gamma,
             Pairing.negate(proof.c), vk.delta,
             Pairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }
    function verifyTx(
            Proof memory proof, uint[8] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](8);
        
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
