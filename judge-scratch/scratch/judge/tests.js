
class Tests {
  constructor() {
    this.tests = [];
    this.id = 0;
    this.numberOfCorrectTests = 0;
  }

  add(isCorrect, msgIfCorrect, msgIfWrong) {
    if (isCorrect) {
      this.tests.push({id:this.id, correct: true, msg: msgIfCorrect});
      this.numberOfCorrectTests++;
    } else {
      this.tests.push({id:this.id, correct: false, msg: msgIfWrong});
    }
    this.id++;
  }
}
