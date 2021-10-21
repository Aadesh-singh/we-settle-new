var li = document.querySelectorAll('li');
var bars = document.querySelector('.bars');

bars.addEventListener('click', function(){
    for(let i = 1; i< li.length - 1; i++){
        li[i].classList.toggle('hidden');
    }
})
