# Judges on the result of the execution of the code blocks
result tester for scratch

First install the dependencies. 

```code
npm install 
```

Change the file name in the test file (eg. multiple-squares.js) to the Scratch code you want to test, located in /scratch_code/
```code
const fileName = '10-squares.sb3';
```

Then run the code:
```code
mocha test/square-test.js
```

The expected output is:

```code
  square
    #findSquare
      ✓ should find 10 squares

  1 passing (2s)
```
