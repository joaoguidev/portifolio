// Joao dantas 100292405
'use strict';
addEventListener('load',navSelect);
addEventListener('click',navSelect);
function navSelect(event){
	let navArr = document.getElementsByClassName('hrefLink');
	for(let i = 0; i < navArr.length; i++){
		if(navArr[i].attributes.href.nodeValue === '#'){
			navArr[i].style.backgroundColor = '#f8204b';
		}
	}
}