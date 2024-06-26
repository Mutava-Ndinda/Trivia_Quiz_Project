const question = document.getElementById("question");
const options = document.querySelector(".quiz-options");
const checkBtn = document.getElementById("check-answer");
const playAgainBtn = document.getElementById("play-again");
const result = document.getElementById("result");
const newCorrectScore = document.getElementById("correct-score");
const totalQuiz = document.getElementById("total-question");

let correctAnswer = "",
  correctScore = (askedCount = 0),
  totalQuestion = 10;

async function loadQuestion() {
  const APIUrl = "https://opentdb.com/api.php?amount=10";
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  result.innerHTML = "";
  showQuestion(data.results[0]);
}

function eventListeners() {
  checkBtn.addEventListener("click", checkAnswer);
  playAgainBtn.addEventListener("click", restartQuiz);
}

document.addEventListener("DOMContentLoaded", function () {
  loadQuestion();
  eventListeners();
  totalQuiz.textContent = totalQuestion;
  newCorrectScore.textContent = correctScore;
});

function showQuestion(data) {
  checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );

  question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
  options.innerHTML = `
        ${optionsList
          .map(
            (option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `
          )
          .join("")}
    `;
  selectOption();
}

function selectOption() {
  options.querySelectorAll("li").forEach(function (option) {
    option.addEventListener("click", function () {
      if (options.querySelector(".selected")) {
        const activeOption = options.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}

function checkAnswer() {
  checkBtn.disabled = true;
  if (options.querySelector(".selected")) {
    let selectedAnswer = options.querySelector(".selected span").textContent;
    if (selectedAnswer == HTMLDecode(correctAnswer)) {
      correctScore++;
      result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
    } else {
      result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
    }
    checkCount();
  } else {
    result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
    checkBtn.disabled = false;
  }
}

function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

function checkCount() {
  askedCount++;
  setCount();
  if (askedCount == totalQuestion) {
    setTimeout(function () {
      console.log("");
    }, 5000);

    result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
    playAgainBtn.style.display = "block";
    checkBtn.style.display = "none";
  } else {
    setTimeout(function () {
      loadQuestion();
    }, 300);
  }
}

function setCount() {
  totalQuiz.textContent = totalQuestion;
  newCorrectScore.textContent = correctScore;
}

function restartQuiz() {
  correctScore = askedCount = 0;
  playAgainBtn.style.display = "none";
  checkBtn.style.display = "block";
  checkBtn.disabled = false;
  setCount();
  loadQuestion();
}
