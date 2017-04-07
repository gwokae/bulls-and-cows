var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function randomComparator() {
  return Math.random() - Math.random();
}
function isBadAnswer (correctAns, ans) {
  var expectedRegex = new RegExp('^[0-9]{' + correctAns.length  + '}$');
  if (!ans.match(expectedRegex)) {
    return 'expected answer format is all numbers and length(' + correctAns.length + ') but got' + ans;
  }

  // for (var i = 0; i < ans.length - 1; i++) {
  //   if (ans.slice(i+1).indexOf(ans[i]) > -1) {
  //     return 'repeating number found in the answer' + ans;
  //   }
  // }
}

module.exports = {
  generate: function(digits) {
    var code = '';
    if (digits > numbers.length) {
        throw new Error('too long to generate', digits)
    }

    return numbers.sort(randomComparator).slice(0, digits).reduce(function(code, num) {
      return code + num
    }, '');
  },
  newGame: function(correctAns) {
    var playing = true;
    var history = [];
    return {
      guess: function(ans) {
        if (!playing) return this.show();

        var result = {};
        var badAnswerMessage = isBadAnswer(correctAns, ans),
          answerLength = correctAns.length;
        if (badAnswerMessage) {
          history.push({ ans, error: badAnswerMessage});
          result.error = badAnswerMessage;
        } else {
          var bulls = 0, cows = 0, isCorrect = false;
          for (var i = 0; i < answerLength; i++) {
            var idx = ans.indexOf(correctAns[i]);
            if (idx === i) {
              bulls++;
            } else if(idx > -1) {
              cows++;
            }
          }
          if (bulls === answerLength) {
            playing = false;
            isCorrect = true;
          }
          var hint = {bulls, cows, ans, isCorrect};
          history.push(hint);
          result.hint = hint;
        }
        result.completed = !playing;
        return result;
      },
      cheat: function() {
        return correctAns;
      },
      show: function() {
        return {
          history: JSON.parse(JSON.stringify(history)),
          completed: this.isCompleted(),
          answerLength: correctAns.length
        }
      },
      isCompleted: function() {
        return !playing;
      }
    }
  }
}