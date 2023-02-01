let input = document.querySelector('input');
let autocompleteArea = document.querySelector('.autocomplete');
let repo = document.querySelector('.repo');

function showAutocomplete(data) {
   for (let i = 0; i < 5; i++) {
      let name = data.items[i].name;
      let owner = data.items[i].owner.login;
      let stars = data.items[i].stargazers_count;

      autocompleteArea.insertAdjacentHTML(
         'beforeend',
         `<div class='autocomplete__item' data-name='${name}' data-owner='${owner}' data-stars='${stars}'>${name}</div>`
      );
   }
}

function removeAutocomplete() {
   autocompleteArea.innerHTML = null;
}

function debounce(fn) {
   let time;
   return function () {
      clearTimeout(time);
      time = setTimeout(() => {
         fn();
      }, 700);
   };
}

async function respFn() {
   removeAutocomplete();
   let inputValue = input.value.replace(/\s+/g, '');
   if (inputValue != '') {
      let resp = await fetch(
         `https://api.github.com/search/repositories?q=${inputValue}`
      );
      let data = await resp.json();
      showAutocomplete(data);
   }
   return;
}

function removeRepoCard(event) {
   if (event.target.getAttribute('class') === 'repo__closebtn') {
      event.target.parentNode.remove();
   }
}

autocompleteArea.addEventListener('click', (event) => {
   repo.insertAdjacentHTML(
      'beforeend',
      `<div class='repo__card'>
         <div>
            <p class="repo__info">Name: ${event.target.getAttribute(
               'data-name'
            )}</p>
            <p class="repo__info">Owner: ${event.target.getAttribute(
               'data-owner'
            )}</p>
            <p class="repo__info">Stars: ${event.target.getAttribute(
               'data-stars'
            )}</p>
         </div>
         <div class="repo__closebtn"></div>
      </div>`
   );
   removeAutocomplete();
   input.value = '';
});

let respFnDebounce = debounce(respFn);
input.addEventListener('input', respFnDebounce);
repo.addEventListener('click', removeRepoCard);
