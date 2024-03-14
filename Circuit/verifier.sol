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
        vk.alpha = Pairing.G1Point(uint256(0x0aacb2e121199471b00b56b6bab641ffae7277f399c2dec16bdbac598b08f75d), uint256(0x28d319f58829acb8d90b618499d082637cead614e28a78ade1a8241b15251ea4));
        vk.beta = Pairing.G2Point([uint256(0x0584878eac8e0eac86ff070088610b353ee428bf51cd4ba3c20dbc55a854f1aa), uint256(0x0f714adad2de7b7443aa64118df646acaed17dc5edbdd227002dc857701e68a7)], [uint256(0x209f7039e175898c7def5475bd9251d59284531b65866b406078c712594c295f), uint256(0x05bce9a933b33e7c51906735046ae7851ab2189754ee3e852a676dcafebc5eee)]);
        vk.gamma = Pairing.G2Point([uint256(0x12c0f589843de03216a785d30670e0a8c9f6431d5b63ffe5b41c3eb74bfbe9cd), uint256(0x298f17e3ff9c247b9aa45ceec7e4d0d19dcf2e46e5eb2057422d408c27284eee)], [uint256(0x0d1cf02ff075f35acfce53062461f1b61a2cb5d60014cd9b5bba4d7ebd5071d9), uint256(0x0edf2284a4475b96e0cf66473e73c10b4fed84b1e2677b971ad1023ea8f6ea0d)]);
        vk.delta = Pairing.G2Point([uint256(0x0f5b40230bb5bb9ae0e2c2e7d574cd9e0b6377b569c5e62c0a1d595f50fe84d1), uint256(0x15f03eb21374d8efa8db413b628fe637a90fcc8081ea85cf322067f99a366d1e)], [uint256(0x25d26331722b9001a507db34524e1ad69b10994a57409f6bcfd1be6a08b3caa6), uint256(0x078bb5e1570a42d82158005095a13b122345e90caaa5d91c1aed0c837693a2e0)]);
        vk.gamma_abc = new Pairing.G1Point[](11);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x13cfb78df37fb4dbc4fd8cd69bfaf736e55e6ad1cf7f606161cdaada8b7e5570), uint256(0x2359a99e214a17a0155f315fd6c74dbf35bc211c9730952b50e1a6650e0dcf1a));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x25df6581c59d828fd76a1daffba7b069c3b060a83b802a916a50cdfaea359344), uint256(0x0c8462abfe9010224da30df9632409ba3de2d1da633b4a4a333178a591bdda7c));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x2a3d5c2b1166d5fbc2923a89833c13a9b0db47dfe125c28b55e910574d53fb3d), uint256(0x22e7ea9e4fb99f4f88f9ec0aa97a8ac8afb4f7db8d333ec03bda8a1e7a76817c));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x19e5a65cc4e6c778c90a4619ea37991c7b0271cc9fef908c48bfc0d69d12eaeb), uint256(0x26e10e4dc190de88fc2d223bd111dfdf58788861e016de6c7859c3c2faa64a82));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x216d1ff4c993bd1ddcf2658580897120ea97bbfcc2bbdc3fcd177e2dfe049816), uint256(0x0beff872c528013b78f99cd6c2867507e14da618b2f37c1526f1435cffe4621d));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x10ff3e561835d6b1fa9087a1d727ae18603da712c998e8ed5ffb4e205d03170d), uint256(0x0d7b12a1b62f2b547331405a56485e39a2e727a1509cb2dcc13429eaa49d6bcf));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x096d23f2b07c1de981299c4a5f77a67087e7d9af55850b40e5c9f287e1ccea71), uint256(0x2130ca5c0a651ff54f6dd291ab17e0feaa30707aa55429495f32e0a1ff46898f));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x1f12ef4d70ee2d781f4c72e95831081c6e1d564c82f39cc84b42a233acdd67ca), uint256(0x0b596b5458316f732ec7db05dee9402cdc5b0eff91da66397c0794baa06a109e));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x07186a5d1cff4342c1dc7dfd0332d08a26ae00e414869a690703e6b794f24dee), uint256(0x1d259d5573c27953f6ea0cf414987674cfb7068310b7b146f4c0a4d61e822538));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x24c58055ec1d11ecbfefe6e51fc75d19412d913e22266e3c0e743bae23382a24), uint256(0x29fda6cd0031cc4231e7baf0b52eda5e13d92545a254183cb9de7eb94489fb62));
        vk.gamma_abc[10] = Pairing.G1Point(uint256(0x2c7ac157b273ae9e7ed946afcdf49ca2a8a81f439187b0d0b69eb572e6d65a61), uint256(0x0c2fbcb97205056a2fa6f67812159f49ff9bd7be6b42318269786526eaccfe5c));
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
            Proof memory proof, uint[10] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](10);
        
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
