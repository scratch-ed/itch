# Judges on the result of the execution of the code blocks
result tester for scratch

First install the dependencies. 

```code
npm install 
```

Change the file name to the Scratch code you want to test, located in /scratch_code/
```code
const fileName = 'square-segments-turned.sb3';
```

Then run the code:
```code
mocha test/square-test.js
```

The expected output is:

```code
  square
    #findSquare
      ✓ should detect a square
    #checkColor
      ✓ should be drawn in blue


  2 passing (2s)
```
