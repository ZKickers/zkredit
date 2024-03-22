#!/bin/bash

# Check if the directory argument is provided
if [ -z "$1" ]; then
  echo "Error: Directory argument is required"
  exit 1
fi

# Construct the input path dynamically
inputPath="proofs/${1}/input.json"
outputPath="proofs/${1}/witness"
outputTxt="proofs/${1}/o.txt"

# Check if the input file exists
if [ ! -f "$inputPath" ]; then
  echo "Error: Input file does not exist at ${inputPath}"
  exit 1
fi

# Execute ZoKrates with the provided input
cat "$inputPath" | zokrates compute-witness --abi --output "$outputPath" --stdin  > "$outputTxt"