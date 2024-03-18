zokrates compile --debug --input toor.zok

zokrates setup

cat input.json | zokrates compute-witness --abi --stdin  > o.txt

zokrates generate-proof

zokrates verify 