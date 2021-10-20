var pluses = document.querySelectorAll('.ques-con span');
var answers = document.querySelectorAll('.ans');

console.log(answers);

for(let i=0; i< pluses.length; i++){
    pluses[i].addEventListener('click', function(){
        answers[i].classList.remove('hidded');
        pluses[i].classList.add('hidded');
    });
}

