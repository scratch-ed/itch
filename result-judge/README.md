# Judges on the result of the execution of the code blocks
result tester for scratch

First install the dependencies. 

```code
npm install 
```

Change the file name in the test file (eg. square-test.js) to the Scratch code you want to test, located in /scratch_code/
```code
const fileName = 'square.sb3';
```

Then run the code:
```code
mocha test/multiple-squares.js
```

The expected output is:

```code
mocha test/square-test.js


  square
    onResult
      #findSquare
        ✓ should find exactly one square
    onCode
      #usesLoop
        ✓ should be coded by using a loop
      #repeatedCode
        ✓ should repeat the code in the loop at least twice
      #usesPenDown
        ✓ should contain a penDown block


  4 passing (3s)

```
