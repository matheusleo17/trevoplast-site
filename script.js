document.querySelectorAll('.menu-list a').forEach(function(a){a.addEventListener('click',function(){a.closest('details').removeAttribute('open')})});
