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
        vk.alpha = Pairing.G1Point(uint256(0x2b0657f62174b6dad7c8d1d484a9c295ab4cd107af2547cdd98b94ad0d359f4b), uint256(0x05aa54c51d9569a4e857da543bc1f686a964cc8c97cc4554d915ca19f4dba6e1));
        vk.beta = Pairing.G2Point([uint256(0x1df6b419bc4a25412aa74525f662c2d777dda9f3c743534f3ffd0243b6789fb4), uint256(0x2a455ac5dca05cb1ee7bb1cef75efb36419d70f6c2e3e7b0ed9b51954eb4e002)], [uint256(0x0f4388a5ed8849d00d4cb9304b5adaa2091f85612047f1d4e05bd931b0d9feba), uint256(0x07248db75989f1139f75cf8702ed0393e63ff1409bfb9d44e3f651e1efd5fc72)]);
        vk.gamma = Pairing.G2Point([uint256(0x2ef899b67cc093a867862bab3d38141bfd0603296a7d2dc4c486a603be6ea106), uint256(0x28d50c02a896e874e62bf43fdb80502c5609d1f5f2f0f153e16513d31eb49b9b)], [uint256(0x1f0be11cb76d0dc5d22bb340fc2eb83d9d3f14761526328eac1ccfb0b51e843e), uint256(0x257875dd744102bcf2e75193b31cfb832482410fc0a86cc66830bc023416898a)]);
        vk.delta = Pairing.G2Point([uint256(0x2850aa3202cb25c392780de9e13ffcefe171b6f97081791e849c8ef3fcb3aaa9), uint256(0x1d7a4d8314b8266c5601559528369a0aa62c6da1a4f5dd8a516121058fca49e0)], [uint256(0x2483128a191ab22320baf1fb2bd7beeb7a21d58e0313a98c84f23e8cc72145b8), uint256(0x2a7d1a935aa3a167b811087fcd06863957102dce285a39af75a1921956f257f5)]);
        vk.gamma_abc = new Pairing.G1Point[](9);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x0d76cd3f125c2c69b0d3028717c102aa0129b195a253ed71bab409819fd87e2e), uint256(0x29018837954a2e1afa48b0ea3b6bcacaab2ab3014958beeae55d455647aef02b));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x1c71b6d7f9006cae51c2d672f4ecdae55216ed8b42ceef685715f0d6ac618d85), uint256(0x0d3ab3769d786a0df56c92a9ed620b5f5047118a8776f2cceaf3649275ba7059));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x1c30f5c448d4b19f6f1de32e621a4244d98c9de2c23b9a7e9edf40fe7b366a44), uint256(0x22f0c31e019b57f39d6945272b240200bd73154c3432023198093b3105d94ccf));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x02930d4d5b6325f9508cee791ded49da8547b5d87408b013fad214b457674202), uint256(0x13c011ea9bb32a8b3df95cfadcd4d8fe017065e558497c171be7cb4891d6e961));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x15cece49b8dffc6b3c212004c761ce31f7afb54c1f3b1091f6cc242f9258c1b5), uint256(0x04ced3eeb80caea665bb7c737fa022963514cb7351528ddf9a70ea2d3d5610e8));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x252f1f555b2a01668ff9d4276b854649bd28fa954349cc764005c474ed96578d), uint256(0x0e181e211afc66f4c48019b740723bbce377ac2eff5ef74625ad04c78835dc08));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x0f20ee88a388fb4499c8d9b9f85a99f29ee9212b59b9984f69208d41dc2ce5f5), uint256(0x0282ef8b9a5808d49e59f0cb2731071a022e1e4dcfb8b6ec5e622072de02f111));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x16e1c5e37260f31143f903fe444064ea8f10bffe21b17daafdcf93151f73fc66), uint256(0x11291222af621ec89cd4bfa6d5a478d59117af88e75f3626c4a810fae887d711));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x10fcaa841fb77a266c83d1678a122d4049d3d8ed5f8d3eeb38235b5f0216c3ca), uint256(0x2a9f4287f2d41c6cb3d673a3e89ad40a1cfbdb301622068383c859e57ebdbfb3));
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
